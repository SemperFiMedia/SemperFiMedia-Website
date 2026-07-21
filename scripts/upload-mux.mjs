// scripts/upload-mux.mjs
// Usage: node scripts/upload-mux.mjs "<absolute-path-to-video>"
// Reads MUX creds from .env.local, creates a direct upload, PUTs the file,
// then polls the asset until ready and prints the playback id + duration.
import { readFileSync, createReadStream, statSync } from 'node:fs';
import { basename } from 'node:path';

function loadEnv() {
  const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const env = loadEnv();
const ID = env.MUX_TOKEN_ID;
const SECRET = env.MUX_TOKEN_SECRET;
if (!ID || !SECRET) throw new Error('Missing MUX_TOKEN_ID / MUX_TOKEN_SECRET in .env.local');
const AUTH = 'Basic ' + Buffer.from(`${ID}:${SECRET}`).toString('base64');

const filePath = process.argv[2];
if (!filePath) throw new Error('Pass the video file path as the first argument');
const size = statSync(filePath).size;
console.log(`Uploading ${basename(filePath)} (${(size / 1e6).toFixed(0)} MB)`);

// 1) create direct upload
const uploadRes = await fetch('https://api.mux.com/video/v1/uploads', {
  method: 'POST',
  headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cors_origin: '*',
    new_asset_settings: { playback_policy: ['public'] },
  }),
});
if (!uploadRes.ok) throw new Error(`create upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
const { data: upload } = await uploadRes.json();
console.log('Upload id:', upload.id);

// 2) PUT the file to the signed URL
const put = await fetch(upload.url, {
  method: 'PUT',
  headers: { 'Content-Type': 'video/quicktime', 'Content-Length': String(size) },
  body: createReadStream(filePath),
  duplex: 'half',
});
if (!put.ok) throw new Error(`file PUT failed: ${put.status} ${await put.text()}`);
console.log('File uploaded. Waiting for asset to be created…');

async function getJson(url) {
  const r = await fetch(url, { headers: { Authorization: AUTH } });
  if (!r.ok) throw new Error(`${url} -> ${r.status} ${await r.text()}`);
  return (await r.json()).data;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let assetId;
for (let i = 0; i < 60 && !assetId; i++) {
  const u = await getJson(`https://api.mux.com/video/v1/uploads/${upload.id}`);
  assetId = u.asset_id;
  if (!assetId) await sleep(2000);
}
if (!assetId) throw new Error('Timed out waiting for asset_id');
console.log('Asset id:', assetId);

let asset;
for (let i = 0; i < 150; i++) {
  asset = await getJson(`https://api.mux.com/video/v1/assets/${assetId}`);
  if (asset.status === 'ready') break;
  if (asset.status === 'errored') throw new Error('Asset errored: ' + JSON.stringify(asset.errors));
  process.stdout.write(`\r  status: ${asset.status} (${i})   `);
  await sleep(4000);
}
console.log('\nStatus:', asset.status);

const playbackId = asset.playback_ids?.[0]?.id;
console.log('\n==== RESULT ====');
console.log('PLAYBACK_ID :', playbackId);
console.log('DURATION_S  :', asset.duration);
console.log('THUMBNAIL   :', `https://image.mux.com/${playbackId}/thumbnail.webp`);
console.log('================');

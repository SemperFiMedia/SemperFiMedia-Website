/**
 * Fleming Photos behind-the-scenes work, grouped by shoot for
 * /social-reels/fleming-photos. Playback IDs are Mux; covers live in
 * public/images/fleming and match the Fleming cover template. Model names come
 * from the interview lower thirds and project folders.
 */

export type FlemingVideo = {
  title: string;
  /** Model or subject credit shown under the reel. */
  credit?: string;
  playbackId: string;
  cover: string;
  aspect: 'vertical' | 'video';
};

export type FlemingShoot = {
  id: string;
  /** Short name for the jump bar. */
  nav: string;
  label: string;
  title: string;
  blurb: string;
  videos: FlemingVideo[];
};

const cover = (id: string) => `/images/fleming/${id}.jpg`;

export const FLEMING_SHOOTS: FlemingShoot[] = [
  {
    id: 'planet-v',
    nav: 'Planet V',
    label: 'SHOOT · PLANET V',
    title: 'Planet V — the alien group shoot.',
    blurb: 'A themed group shoot. One cinematic cut of the day, plus a reel for each model.',
    videos: [
      { title: 'Planet V Video Shoot', playbackId: 'hb02BPS009KGeiLFF6ns3K701zpAx50001I4J02DMOrIAKJsM', cover: cover('h04'), aspect: 'video' },
      { title: 'Mother Alien', credit: 'Mother Alien “V” · Owner, Planet V', playbackId: 'XHgi1DnlMmAcMNR7QBun6hIFNHhZtXyARIhDvhqjAX8', cover: cover('v26'), aspect: 'vertical' },
      { title: 'CoCo Samone', credit: 'CoCo Samone', playbackId: 'AcmYAR003emc00zRqcbY9sJI1lzd018zsJt2gJ1aE00Avbc', cover: cover('v23'), aspect: 'vertical' },
      { title: 'Darnell McGowan', credit: 'Darnell McGowan · Designer & Stylist', playbackId: 'DCN1hS00FiqlHZQSDorKKW01zVkaFEB025WTujiDdeUGcQ', cover: cover('v24'), aspect: 'vertical' },
      { title: 'Kreative Keazy', credit: 'Kreative Keazy · Creative Director', playbackId: 'uUH6m7NwR02eJPF4hfi2GCLMFZI4w1YGu01SmV2QZOQHg', cover: cover('v25'), aspect: 'vertical' },
      { title: 'Quinntaria Phipps', credit: 'Quinntaria Phipps', playbackId: '5ybjFs9qJnTLGpCYY3kagej3UOfwby9CFBRu3ZQg9bg', cover: cover('v27'), aspect: 'vertical' },
    ],
  },
  {
    id: 'western',
    nav: 'Western',
    label: 'SHOOT · WESTERN',
    title: 'Hats, boots, and barn light.',
    blurb: 'A western set, cut into a reel for each look.',
    videos: [
      { title: 'The Redhead Cowgirl', playbackId: 'mlUxtmJz00OnDFvwCHyVhvbIjSJ8nKFKQNa46QhiUcy4', cover: cover('v07'), aspect: 'vertical' },
      { title: 'The Gunslinger', playbackId: 'e9pV6SlqUDGF2VscaQe01dVty00zKfYiQ4KmbAU5w5LgM', cover: cover('v08'), aspect: 'vertical' },
      { title: 'Whitley in the Barn', credit: 'Whitley', playbackId: '7WHKofclvyMPpTPpMMZHWrVyLdnxIFdNUd6ExrsmK3I', cover: cover('v10'), aspect: 'vertical' },
      { title: 'Western & Glam', playbackId: '01g2D1ddCRiFVe02kV5GgdunO4wF7rIGegKJiKghKauFo', cover: cover('v03'), aspect: 'vertical' },
    ],
  },
  {
    id: 'behind-the-camera',
    nav: 'Behind the Camera',
    label: 'BEHIND THE CAMERA',
    title: 'The photographers at work.',
    blurb: 'The other side of the lens: lighting, direction, and the moment the shot lands.',
    videos: [
      { title: 'The Photoshoot', playbackId: 'jPm14S1wl6E4EM8EiJgfwIP7VOMo8bucsY2gR5kubLE', cover: cover('h07'), aspect: 'video' },
      { title: 'The Photographers', playbackId: 'G1LfqF8gwjT9H4hLIOub00jftqTdFc7pR3nzs1QqQca8', cover: cover('v04'), aspect: 'vertical' },
      { title: 'Sequins & Strobes', playbackId: 'V2EvNxHiYznKMSxEJ02QtuhU22iz01iSPism4i1pYDEks', cover: cover('v11'), aspect: 'vertical' },
      { title: 'On Set', playbackId: 'rkTio6Lg4eJTQsEZWy3r19eyx02sI5Qa4AU00WqrhxbtI', cover: cover('v30'), aspect: 'vertical' },
    ],
  },
  {
    id: 'portraits',
    nav: 'Portraits & Fashion',
    label: 'PORTRAITS & FASHION',
    title: 'Street fashion, families, and Valentine’s.',
    blurb: 'Fashion on location, a multi-generation family session, and a Valentine’s portrait shoot.',
    videos: [
      { title: 'Street Fashion', playbackId: '89tCZ2TqJJeIYace9nBoRqFjOegwAfzSmB02X6994WSM', cover: cover('h05'), aspect: 'video' },
      { title: 'Family & Valentine’s', playbackId: 'fWwrlPIhH01EcbT00SnVoe00Y00ex13Kpl8vIVH01rEe68fc', cover: cover('h06'), aspect: 'video' },
      { title: 'Valentine’s Day', playbackId: 'FiVRpH8lNFKnkl1cQrMYntzEE5GnXzeayy2W5JNSzmk', cover: cover('v28'), aspect: 'vertical' },
    ],
  },
  {
    id: 'cover-shoot',
    nav: 'Cover Shoot',
    label: 'SHOOT · COVER SHOOT · JUNE 2024',
    title: 'The 2024 cover shoot.',
    blurb: 'Two cuts from the June 2024 cover shoot.',
    videos: [
      { title: 'The Cover Shoot', playbackId: 'K02IK2GQmQLesi1600UWC00tQkldihIBywhUbIToo9vri4', cover: cover('h08'), aspect: 'video' },
      { title: 'Cover Shoot, Promo Cut', playbackId: '97C5SxlgvqCVaazEmUSTtwSu02S85s9DG9WCgufAs22U', cover: cover('h10'), aspect: 'video' },
    ],
  },
  {
    id: 'boudoir-glam',
    nav: 'Boudoir & Glam',
    label: 'BOUDOIR & GLAM',
    title: 'Lace, light, and leopard print.',
    blurb: 'Boudoir and glam sets, each cut into its own reel.',
    videos: [
      { title: 'Slow & Sultry', playbackId: 'aeotv2DpA6MoKiWXWmXlTe02saTvs8cyFByjm6XLnIZ00', cover: cover('v01'), aspect: 'vertical' },
      { title: 'Whitley', credit: 'Whitley', playbackId: 'iHDY26302PyNCwPWunnoZXR1k00YVS02DWfm76J6n00BgUc', cover: cover('v02'), aspect: 'vertical' },
      { title: 'Whitley, Part Two', credit: 'Whitley', playbackId: 'YZcDO13iftN00Fpe89AP7IRVXOYwBwkgqbkOyXAfpfeA', cover: cover('v09'), aspect: 'vertical' },
      { title: 'Gold & Lace', playbackId: '2umWV3E5LIPgnRwQWQEKQ6gAzoSQZVuga2celWPoisA', cover: cover('v05'), aspect: 'vertical' },
      { title: 'Veil & Leopard', playbackId: 'y93b00LFd22rmY4M1nlj4BMJ01cyTFJzlwixYuUBSXric', cover: cover('v06'), aspect: 'vertical' },
      { title: 'Sheer Gold', playbackId: 'suc8qUNY7HZMaVXgYYIhvAXIaud9TI02hNUZmr27NrEI', cover: cover('v12'), aspect: 'vertical' },
      { title: 'The Vanity', playbackId: 'rDyMuJWdvkjj5Muqn2mkI83tewZSXD00Zh01uVkjUP21E', cover: cover('v13'), aspect: 'vertical' },
    ],
  },
  {
    id: 'whitley',
    nav: 'Whitley',
    label: 'SHOOT · WHITLEY',
    title: 'Whitley — the full session.',
    blurb: 'The session film, the behind-the-scenes from start to finish, and four reels.',
    videos: [
      { title: 'Whitley', credit: 'Whitley', playbackId: 'jSzaxt1rAg9CjeAhHpBPG1Nqk5RQTEgb4S8lMVWrouY', cover: cover('h03'), aspect: 'video' },
      { title: 'The Full Session', playbackId: 'aTI2Eki4YnsRjXa01QNBWo4026HbH00ppNr4qo02YXyrVXU', cover: cover('h09'), aspect: 'video' },
      { title: 'Latex & Light', credit: 'Whitley', playbackId: 'FCqq2FqnFTfGqan01VValIw9w2uERnosRAnwLmg2jYmQ', cover: cover('v19'), aspect: 'vertical' },
      { title: 'Red & Black', playbackId: 'D6RospWmf7FNfKCLrfpEtzUEjwXcSmsGATHwfoINmwI', cover: cover('v20'), aspect: 'vertical' },
      { title: 'Fishnet & Strobes', credit: 'Whitley', playbackId: 'vTNYdJIQyYmeQnD2WKqBb9rxIJTSe001fiDj17zSuMDk', cover: cover('v21'), aspect: 'vertical' },
      { title: 'Whitley Unplugged', credit: 'Whitley', playbackId: 't02OX7KckmAlgybl3OeX02i502oT6PuXS7iRZt68CkR6I4', cover: cover('v22'), aspect: 'vertical' },
    ],
  },
  {
    id: 'carrie',
    nav: 'Carrie',
    label: 'SHOOT · CARRIE',
    title: 'Carrie in red.',
    blurb: 'The shoot film and two reels.',
    videos: [
      { title: 'Carrie', credit: 'Carrie', playbackId: 'JOiFu5pJPGFGLTeHIjEfHpBUDHsRTZDOpBYSoyd2Gw00', cover: cover('h01'), aspect: 'video' },
      { title: 'Carrie in Red', credit: 'Carrie', playbackId: 'fYelQfWssezpChTBUORZYeLpQpG8vvl2WaUJp844gfI', cover: cover('v14'), aspect: 'vertical' },
      { title: 'Black Roses', credit: 'Carrie', playbackId: '6Ibmqrp8apjloNFYicNVBOqb8MT2eljiBy6e402vsq2I', cover: cover('v15'), aspect: 'vertical' },
    ],
  },
  {
    id: 'charissa',
    nav: 'Charissa',
    label: 'SHOOT · CHARISSA',
    title: 'Charissa under neon.',
    blurb: 'The shoot film and three photo reels.',
    videos: [
      { title: 'Charissa', credit: 'Charissa', playbackId: 'slMDq01XLi8qnsFXBpkdcqgTEJpOy3WIulDQiz3hiKkU', cover: cover('h02'), aspect: 'video' },
      { title: 'Charissa Under Neon', credit: 'Charissa', playbackId: 'NyckJajSSgSzgdclgYgZvFR01PNyhLuSDFtYKggBxYmY', cover: cover('v16'), aspect: 'vertical' },
      { title: 'Neon Lace', credit: 'Charissa', playbackId: '8WcZZ015XEVQlxtzxOqUFOQyKGiKkQ01fFOIaHqvQUur8', cover: cover('v17'), aspect: 'vertical' },
      { title: 'Neon Nights', credit: 'Charissa', playbackId: 'PjNroYkokvQ44nYcb5QTnUV00dnaMP1RpmDh00Tb14KB00', cover: cover('v18'), aspect: 'vertical' },
    ],
  },
];

export const FLEMING_REEL_COUNT = FLEMING_SHOOTS.reduce((n, s) => n + s.videos.length, 0);

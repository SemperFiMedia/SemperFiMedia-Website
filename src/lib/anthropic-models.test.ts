/**
 * The chat concierge and the proposal generator run on different models on
 * purpose — different volume, different value per run. This pins that intent
 * so a future "tidy-up" doesn't silently collapse them back to one setting.
 *
 * It also guards the failure that produced this split: the old default sat on
 * a comment with an expiry date that nothing enforced, and went six weeks
 * stale.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ENV_SRC = readFileSync(join(__dirname, 'env.ts'), 'utf8');

describe('Anthropic model configuration', () => {
  it('gives each AI feature its own setting', () => {
    expect(ENV_SRC).toContain("chatModel: process.env.ANTHROPIC_MODEL ?? 'claude-opus-5'");
    expect(ENV_SRC).toContain(
      "proposalModel: process.env.ANTHROPIC_PROPOSAL_MODEL ?? 'claude-fable-5'",
    );
  });

  it('routes each feature to its own model', () => {
    const chat = readFileSync(join(__dirname, '..', 'app', 'api', 'chat', 'route.ts'), 'utf8');
    const proposal = readFileSync(
      join(__dirname, '..', 'app', 'api', 'proposal', 'route.ts'),
      'utf8',
    );
    expect(chat).toContain('env.anthropic.chatModel');
    expect(chat).not.toContain('env.anthropic.proposalModel');
    expect(proposal).toContain('env.anthropic.proposalModel');
    expect(proposal).not.toContain('env.anthropic.chatModel');
  });

  it('documents both settings for anyone setting the project up', () => {
    const example = readFileSync(join(__dirname, '..', '..', '.env.local.example'), 'utf8');
    expect(example).toContain('ANTHROPIC_MODEL=');
    expect(example).toContain('ANTHROPIC_PROPOSAL_MODEL=');
  });

  it('states no deadline the code cannot enforce', () => {
    // The note this replaced said "switch after ~Jul 15" and nothing checked it.
    expect(ENV_SRC).not.toMatch(/through ~?[A-Z][a-z]{2} \d/);
    expect(ENV_SRC).not.toMatch(/switch to Opus 4\.6/);
  });
});

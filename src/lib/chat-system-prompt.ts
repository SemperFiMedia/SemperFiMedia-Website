/**
 * Backward-compatible export. The prompt is now assembled from the reseller
 * config engine — edit client details in ./chatbot/client-config.ts and the
 * reusable framework in ./chatbot/system-prompt.ts.
 */
import { semperFiConfig } from './chatbot/client-config';
import { buildSystemPrompt } from './chatbot/system-prompt';

export const CHAT_SYSTEM_PROMPT = buildSystemPrompt(semperFiConfig);

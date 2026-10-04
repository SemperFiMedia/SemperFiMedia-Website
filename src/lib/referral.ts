/**
 * The wedding referral reward. /refer, the referral form, the nav and footer
 * links, the notification email and the chatbot all read it from here.
 *
 * Before 2026-10-04 the $200 was typed into fifteen places.
 */
import { formatPrice } from '@/lib/utils';

export const REFERRAL_REWARD = 200;

/** "$200" */
export function referralRewardLabel(): string {
  return formatPrice(REFERRAL_REWARD);
}

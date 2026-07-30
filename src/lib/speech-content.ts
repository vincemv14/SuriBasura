import { TrashCategory, FIVE_R_DATA } from "./categories";

/**
 * Generate English speech content dynamically based on category.
 * The voice reads in English for clarity, while on-screen text is Filipino.
 */

const BEST_ACTION_ENGLISH: Record<string, string> = {
  reduce: "Reduce — avoid creating this waste in the first place.",
  reuse: "Reuse — find a new purpose for this item.",
  recover: "Recover — turn this waste into something useful like compost or energy.",
  recycle: "Recycle — bring it to a recycling center or junk shop.",
  repair: "Repair — fix it instead of throwing it away.",
};

export function getSpeechText(category: TrashCategory): string {
  const data = FIVE_R_DATA[category];
  if (!data) {
    return "Item detected. Please check the recommendations on screen.";
  }

  const actionDesc = BEST_ACTION_ENGLISH[data.bestAction] || "Check the screen for recommendations.";

  return `The item detected is: ${category}. The best action for this item is to ${actionDesc}`;
}

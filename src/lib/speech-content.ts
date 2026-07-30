import { TrashCategory } from "./categories";

/**
 * English speech content for text-to-voice (clearer for kids to understand via AI voice).
 * The on-screen text is in Filipino, but the voice reads in English for clarity.
 */

export const SPEECH_INTRO: Record<TrashCategory, string> = {
  "plastic bottle":
    "The item detected is a plastic bottle! Here's what you can do:",
  "plastic wrapper/sachet":
    "The item detected is a plastic wrapper or sachet! Here's what you can do:",
  "paper/cardboard":
    "The item detected is paper or cardboard! Here's what you can do:",
  glass:
    "The item detected is glass! Here's what you can do:",
  "metal/can":
    "The item detected is a metal can! Here's what you can do:",
  "e-waste":
    "The item detected is electronic waste! Here's what you can do:",
  "organic/food waste":
    "The item detected is organic or food waste! Here's what you can do:",
  styrofoam:
    "The item detected is styrofoam! Here's what you can do:",
  other:
    "The item is not clearly identified. Here are some general tips:",
};

export const SPEECH_BEST_ACTION: Record<TrashCategory, string> = {
  "plastic bottle":
    "The best action is to Reduce. Use a reusable water bottle so you don't need single-use plastic anymore.",
  "plastic wrapper/sachet":
    "The best action is to Reduce. Buy refills or in bulk instead of single-serve sachets.",
  "paper/cardboard":
    "The best action is to Recycle. Keep it dry and bring it to the junk shop or recycling center.",
  glass:
    "The best action is to Reuse. Wash it and use it again as storage, a drinking glass, or decoration.",
  "metal/can":
    "The best action is to Recycle. Metal cans have value. Bring them to the junk shop.",
  "e-waste":
    "The best action is to Repair. Most electronics can still be fixed by a local technician.",
  "organic/food waste":
    "The best action is to Recover. Compost it! It turns into rich soil in just a few weeks.",
  styrofoam:
    "The best action is to Reduce. Styrofoam cannot be recycled here in the Philippines. Avoid it by bringing your own container.",
  other:
    "The best action is to Reduce. Think before buying — do you really need it?",
};

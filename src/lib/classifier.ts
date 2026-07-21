import { TrashCategory } from "./categories";

// Mapping of MobileNet ImageNet class keywords to our trash categories.
// MobileNet returns labels like "water bottle", "pop bottle", "envelope", etc.
// We map these to our 9 categories using keyword matching.

const CATEGORY_KEYWORDS: Record<TrashCategory, string[]> = {
  "plastic bottle": [
    "water bottle",
    "pop bottle",
    "bottle",
    "plastic bottle",
    "water jug",
  ],
  "plastic wrapper/sachet": [
    "plastic bag",
    "packet",
    "wrapper",
    "bag",
    "diaper",
    "shopping bag",
    "grocery bag",
  ],
  "paper/cardboard": [
    "envelope",
    "cardboard",
    "paper",
    "carton",
    "book",
    "newspaper",
    "notebook",
    "tissue",
    "toilet paper",
    "box",
    "mail",
    "letter",
  ],
  glass: [
    "wine bottle",
    "beer bottle",
    "glass",
    "vase",
    "jar",
    "goblet",
    "beer glass",
    "cocktail",
    "cup",
    "pitcher",
    "measuring cup",
  ],
  "metal/can": [
    "can",
    "tin",
    "aluminum",
    "pop can",
    "beer can",
    "soda can",
    "metal",
    "iron",
    "steel",
    "pan",
    "pot",
    "frying pan",
    "wok",
    "caldron",
    "cauldron",
  ],
  "e-waste": [
    "computer",
    "keyboard",
    "mouse",
    "monitor",
    "laptop",
    "phone",
    "cell phone",
    "cellular phone",
    "remote",
    "television",
    "tv",
    "screen",
    "printer",
    "modem",
    "router",
    "speaker",
    "headphone",
    "earphone",
    "cable",
    "charger",
    "battery",
    "circuit",
    "chip",
    "radio",
    "ipod",
    "mp3",
    "cassette",
    "cd player",
    "disk",
    "hard disc",
  ],
  "organic/food waste": [
    "banana",
    "apple",
    "orange",
    "fruit",
    "food",
    "vegetable",
    "meat",
    "bread",
    "egg",
    "corn",
    "mushroom",
    "broccoli",
    "cauliflower",
    "cucumber",
    "pepper",
    "lemon",
    "pineapple",
    "strawberry",
    "pomegranate",
    "fig",
    "pizza",
    "hamburger",
    "hotdog",
    "pretzel",
    "bagel",
    "dough",
    "ice cream",
    "plate",
    "leaf",
    "flower",
  ],
  styrofoam: [
    "styrofoam",
    "foam",
    "polystyrene",
    "takeout",
    "takeaway",
  ],
  other: [],
};

export interface ClassificationResult {
  category: TrashCategory;
  confidence: number;
  rawLabel: string;
}

export function mapLabelToCategory(
  predictions: Array<{ className: string; probability: number }>
): ClassificationResult {
  // Go through predictions from highest to lowest confidence
  for (const prediction of predictions) {
    const label = prediction.className.toLowerCase();

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (category === "other") continue;

      for (const keyword of keywords) {
        if (label.includes(keyword) || keyword.includes(label)) {
          return {
            category: category as TrashCategory,
            confidence: prediction.probability,
            rawLabel: prediction.className,
          };
        }
      }
    }
  }

  // If no match found, return "other" with the top prediction's info
  return {
    category: "other",
    confidence: predictions[0]?.probability || 0,
    rawLabel: predictions[0]?.className || "unknown",
  };
}

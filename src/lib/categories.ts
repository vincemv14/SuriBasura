export type TrashCategory =
  | "plastic bottle"
  | "plastic wrapper/sachet"
  | "paper/cardboard"
  | "glass"
  | "metal/can"
  | "e-waste"
  | "organic/food waste"
  | "styrofoam"
  | "other";

export const VALID_CATEGORIES: TrashCategory[] = [
  "plastic bottle",
  "plastic wrapper/sachet",
  "paper/cardboard",
  "glass",
  "metal/can",
  "e-waste",
  "organic/food waste",
  "styrofoam",
  "other",
];

export interface FiveRRecommendation {
  reduce: string;
  reuse: string;
  recover: string;
  recycle: string;
  repair: string | null; // null = not applicable for this category
  bestAction: "reduce" | "reuse" | "recover" | "recycle" | "repair";
  bestActionSummary: string;
}

export const CATEGORY_EMOJI: Record<TrashCategory, string> = {
  "plastic bottle": "🧴",
  "plastic wrapper/sachet": "🍬",
  "paper/cardboard": "📦",
  "glass": "🫙",
  "metal/can": "🥫",
  "e-waste": "🔌",
  "organic/food waste": "🍌",
  "styrofoam": "🥡",
  "other": "❓",
};

export const FIVE_R_DATA: Record<TrashCategory, FiveRRecommendation> = {
  "plastic bottle": {
    reduce:
      "Bring a reusable water bottle or tumbler. One reusable bottle replaces hundreds of single-use PET bottles per year.",
    reuse:
      "Clean it and use as a plant pot, pencil holder, or refill it with drinking water from a purified source a few more times before retiring it.",
    recover:
      "PET bottles have value — collect them and bring to a junk shop. They are melted into polyester fiber for clothing and bags.",
    recycle:
      "Flatten and cap it, then drop off at the barangay MRF or nearest junk shop. [PLACEHOLDER: Add Liliw-specific drop-off location]",
    repair: null,
    bestAction: "reduce",
    bestActionSummary: "Switch to a reusable bottle to cut this waste at the source.",
  },
  "plastic wrapper/sachet": {
    reduce:
      "Buy in bulk (tingi refill stations) instead of single-serve sachets. One refill replaces 30+ sachets per month.",
    reuse:
      "Hard to reuse food-grade — but clean sachets can be woven into bags or mats by community eco-brick programs.",
    recover:
      "Some cement kilns accept sachet waste as fuel (co-processing). Check if your LGU has a collection program for this.",
    recycle:
      "Most MRFs cannot recycle multilayer sachets. Segregate them separately. [PLACEHOLDER: Add Liliw-specific sachet collection partner if available]",
    repair: null,
    bestAction: "reduce",
    bestActionSummary: "Sachets are nearly impossible to recycle. Avoid them — buy refills instead.",
  },
  "paper/cardboard": {
    reduce:
      "Go digital for receipts & notes. Reuse paper bags. Opt out of unnecessary flyers and packaging.",
    reuse:
      "Use the blank side for notes or kids' drawing paper. Cardboard boxes become storage or craft projects.",
    recover:
      "Compost uncoated paper — it breaks down in 2–6 weeks and enriches soil.",
    recycle:
      "Keep it dry and flatten it. Paper/cardboard is one of the easiest materials to recycle. Bring to any junk shop or MRF. [PLACEHOLDER: Add Liliw junk shop address]",
    repair: null,
    bestAction: "recycle",
    bestActionSummary: "Paper is easy to recycle — keep it dry and bring it to the junk shop.",
  },
  glass: {
    reduce:
      "Choose products in refillable glass containers or buy from sari-sari stores that accept bottle returns.",
    reuse:
      "Glass jars are perfect for food storage, drinking glasses, candle holders, or terrariums. Wash and reuse indefinitely.",
    recover:
      "Crushed glass (cullet) can be used in construction as aggregate. Some LGUs collect it for this purpose.",
    recycle:
      "Glass is infinitely recyclable. Bring clean bottles to the junk shop or MRF. Separate by color if required. [PLACEHOLDER: Add Liliw glass collection point]",
    repair: null,
    bestAction: "reuse",
    bestActionSummary: "Glass lasts forever — wash it and reuse as storage or decor.",
  },
  "metal/can": {
    reduce:
      "Use a reusable lunchbox instead of canned goods where possible. Cook fresh when you can.",
    reuse:
      "Tin cans become planters, pen holders, lanterns, or storage containers. Sand edges smooth first for safety.",
    recover:
      "Metals have high scrap value. Aluminum cans are especially valuable — a kilo of cans fetches ₱40–80 at junk shops.",
    recycle:
      "Rinse, flatten, and bring to a junk shop. Aluminum and tin are endlessly recyclable. [PLACEHOLDER: Add nearest Liliw junk shop buying metals]",
    repair: "Dented metal items (pots, tools, utensils) can often be hammered back into shape or re-welded cheaply at a local repair shop.",
    bestAction: "recycle",
    bestActionSummary: "Metals are valuable and infinitely recyclable — sell them to a junk shop.",
  },
  "e-waste": {
    reduce:
      "Take care of electronics so they last longer — use cases, surge protectors, and keep firmware updated.",
    reuse:
      "If it still works, donate or sell to someone who can use it. Old phones become security cameras, music players, or kids' learning tools.",
    recover:
      "E-waste contains precious metals (gold, copper, palladium). Certified recyclers extract these safely.",
    recycle:
      "NEVER burn e-waste — toxic fumes. Bring to a DENR-accredited e-waste collector or LGU collection drive. [PLACEHOLDER: Add Liliw/Laguna e-waste collection events]",
    repair: "Most electronics can be repaired — phone screen replacements, battery swaps, charging port fixes. Check with local technicians before discarding.",
    bestAction: "repair",
    bestActionSummary: "Try repair first — most electronics can be fixed affordably by a local technician.",
  },
  "organic/food waste": {
    reduce:
      "Plan meals, store food properly, and eat leftovers first. The best food waste is the kind that never happens.",
    reuse:
      "Vegetable scraps become broth. Stale bread becomes breadcrumbs. Overripe bananas make great kakanin or banana bread.",
    recover:
      "Compost it! Organic waste breaks down into rich soil in 4–8 weeks. Even a small bin on a balcony works.",
    recycle:
      "Not recyclable in the traditional sense, but community composting programs turn it into garden soil. [PLACEHOLDER: Liliw composting program contact]",
    repair: null,
    bestAction: "recover",
    bestActionSummary: "Compost it — organic waste becomes rich soil in just a few weeks.",
  },
  styrofoam: {
    reduce:
      "Bring your own containers (BYOC) for takeout. Refuse styrofoam packaging when you can choose alternatives.",
    reuse:
      "Clean styrofoam containers can be used for seedling trays or paint palettes, but they degrade quickly.",
    recover:
      "Some specialized facilities densify styrofoam into blocks for reuse. Very few exist in PH currently.",
    recycle:
      "Styrofoam is technically recyclable but almost no facility in the Philippines accepts it. Segregate it and advocate for bans. [PLACEHOLDER: Check if Liliw has styrofoam ban ordinance]",
    repair: null,
    bestAction: "reduce",
    bestActionSummary: "Styrofoam can't realistically be recycled here — avoid it entirely by bringing your own container.",
  },
  other: {
    reduce:
      "Think before buying: do you really need it? Choosing products with less packaging reduces waste at the source.",
    reuse:
      "Get creative — many items have a second life as craft materials, organizers, or donation items.",
    recover:
      "Check if the item has material value (metal parts, usable components) that a junk shop or repair shop would take.",
    recycle:
      "If you're unsure, ask your barangay MRF or local junk shop what they accept. [PLACEHOLDER: Liliw MRF contact number]",
    repair: "If the item is broken but fixable, try a local repair shop before discarding.",
    bestAction: "reduce",
    bestActionSummary: "When in doubt, the best action is to reduce — avoid creating this waste next time.",
  },
};

export const R_COLORS: Record<string, string> = {
  reduce: "bg-red-100 text-red-800 border-red-300",
  reuse: "bg-blue-100 text-blue-800 border-blue-300",
  recover: "bg-amber-100 text-amber-800 border-amber-300",
  recycle: "bg-green-100 text-green-800 border-green-300",
  repair: "bg-purple-100 text-purple-800 border-purple-300",
};

export const R_ICONS: Record<string, string> = {
  reduce: "🚫",
  reuse: "♻️",
  recover: "⚡",
  recycle: "🔄",
  repair: "🔧",
};

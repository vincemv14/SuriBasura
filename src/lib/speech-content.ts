import { TrashCategory, FIVE_R_DATA } from "./categories";

/**
 * Generate English speech content dynamically based on category.
 * Each category gets a unique voice message explaining
 * WHY the recommended 5R action is best for that particular trash type.
 * The message structure changes depending on which R is recommended,
 * so the listener hears a distinctly different tone and advice per category.
 */

const CATEGORY_SPEECH: Record<string, string> = {
  // ─── REDUCE-focused items ───────────────────────────────────────────
  "plastic bottle":
    "This is a plastic bottle. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because every plastic bottle takes 450 years to break down. " +
    "The most powerful thing you can do is carry your own reusable tumbler or water jug. " +
    "One reusable bottle eliminates hundreds of disposable bottles every year. " +
    "If you already have this bottle, flatten it, keep the cap on, and bring it to a junk shop for recycling.",

  "plastic wrapper/sachet":
    "This is a plastic wrapper or sachet. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because sachets are made of multiple fused layers — plastic, aluminum, and paper bonded together — " +
    "making them nearly impossible to recycle anywhere in the world. " +
    "Instead of buying single-serve sachets, visit a refill station or buy in larger containers. " +
    "If you already have sachets, you can stuff them into eco-bricks, but prevention is always better than cure.",

  "styrofoam":
    "This is styrofoam, also called polystyrene. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because almost no recycling facility in the Philippines accepts styrofoam. " +
    "It crumbles into tiny beads that pollute rivers and oceans, and animals mistake it for food. " +
    "The solution is to bring your own food containers when buying takeout. " +
    "If a restaurant offers only styrofoam, politely ask if they can use paper or let you use your own container.",

  "plastic bag":
    "This is a plastic bag. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because plastic bags are too lightweight and flimsy for most recycling machines to process. " +
    "They clog sorting equipment and often end up in waterways. " +
    "The simplest habit change: keep a foldable eco bag in your pocket or purse at all times. " +
    "If you already have this bag, reuse it as a trash liner before it goes to final disposal.",

  "diaper/sanitary":
    "This is a diaper or sanitary product. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because diapers and pads cannot be recycled or composted — " +
    "they contain mixed materials, absorbent gels, and body fluids. " +
    "Consider switching to cloth diapers for babies or menstrual cups and reusable pads for adults. " +
    "These alternatives save thousands of pesos over time. " +
    "If you must use disposable ones, wrap them properly and place in residual waste — never in recyclable bins.",

  "tetra pak/juice box":
    "This is a tetra pak or juice box. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because tetra paks have three bonded layers — paper, plastic, and aluminum — " +
    "that require specialized equipment to separate. Very few facilities in the Philippines can do this. " +
    "Make fresh juice at home or use a reusable tumbler. It's cheaper and produces zero packaging waste. " +
    "Clean tetra paks can be turned into small crafts like wallets or pencil holders.",

  "batteries":
    "These are batteries. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because dead batteries leak toxic chemicals like zinc, manganese, and cadmium " +
    "that contaminate soil and groundwater. " +
    "Switch to rechargeable batteries — they last for hundreds of charge cycles and cost less over time. " +
    "Never throw batteries in regular trash or burn them. " +
    "Collect them in a jar and bring them to an e-waste collection point or designated battery bin.",

  "light bulbs":
    "This is a light bulb. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because switching to LED bulbs means you rarely need to replace them — " +
    "LEDs last 15 to 25 years under normal use, dramatically cutting the number of bulbs you throw away. " +
    "Fluorescent and CFL bulbs contain mercury vapor, so never break them open. " +
    "Bring old bulbs to a hardware store or e-waste collection event for safe handling.",

  "medicine/chemicals":
    "This is medicine or a chemical product. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because expired medicines and chemicals are classified as hazardous waste. " +
    "They cannot be recycled or composted and contaminate water if flushed. " +
    "Buy only the amount of medicine you need and always check expiry dates before purchasing. " +
    "Return expired medicines to a pharmacy and bring chemical containers to your LGU's hazardous waste collection day.",

  "cigarette butts":
    "These are cigarette butts. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because cigarette filters are made of cellulose acetate plastic that takes up to 12 years to decompose, " +
    "leaking over 7,000 chemicals into soil and water. They are among the top ocean pollutants worldwide. " +
    "The best solution is to quit smoking entirely. " +
    "If that's not yet possible, always use a portable ashtray and dispose of butts properly — never on the ground or in drains.",

  "straw/stirrer":
    "This is a plastic straw or stirrer. For this item, the best of the 5 Rs is: Reduce. " +
    "Why reduce? Because straws and stirrers are too small and lightweight for recycling machines to sort. " +
    "They slip through screens and end up in landfills or oceans. " +
    "The easiest habit to build: just say 'no straw please' when ordering drinks. " +
    "If you prefer using a straw, carry a reusable metal or bamboo one — they last for years.",

  // ─── REUSE-focused items ────────────────────────────────────────────
  "glass":
    "This is a glass item. For this item, the best of the 5 Rs is: Reuse. " +
    "Why reuse? Because glass is incredibly durable and doesn't absorb flavors or chemicals. " +
    "A single glass jar can serve as food storage, a drinking glass, a candle holder, a vase, or a terrarium — " +
    "it just needs washing. Glass lasts practically forever when handled with care. " +
    "If it's broken, glass is still infinitely recyclable — bring clean pieces to a junk shop.",

  "clothing/tela":
    "This is clothing or fabric. For this item, the best of the 5 Rs is: Reuse. " +
    "Why reuse? Because textiles take years of resources to produce — water, energy, dyes, and labor. " +
    "Donating or passing on clothes extends their life and helps others. " +
    "Old t-shirts make excellent cleaning rags. Torn fabric can become quilts, bags, or pet beds. " +
    "If a garment just needs a small fix, bring it to a seamstress — it's affordable and reduces waste.",

  "construction debris":
    "This is construction debris. For this item, the best of the 5 Rs is: Reuse. " +
    "Why reuse? Because wood planks, metal sheets, and bricks retain their structural strength and can serve in future projects. " +
    "Sell leftover materials or donate them to community builds. " +
    "Crushed concrete works as road base or fill material. Metal rebar has high scrap value at junk shops. " +
    "Plan projects carefully and order precise quantities to minimize waste from the start.",

  "ceramic/porcelain":
    "This is ceramic or porcelain. For this item, the best of the 5 Rs is: Reuse. " +
    "Why reuse? Because ceramics cannot be melted down and recycled like glass — they fire at different temperatures. " +
    "But broken pieces have a beautiful second life: mosaic art, garden stepping stones, or drainage layers in plant pots. " +
    "If the break is clean, you can repair it with epoxy or try the Japanese kintsugi technique with gold. " +
    "Get creative and give ceramics a new purpose instead of sending them to landfill.",

  // ─── RECYCLE-focused items ──────────────────────────────────────────
  "paper/cardboard":
    "This is paper or cardboard. For this item, the best of the 5 Rs is: Recycle. " +
    "Why recycle? Because paper is one of the easiest and most successful materials to recycle — " +
    "it can be processed into new paper up to 7 times. " +
    "Keep it clean and dry, flatten any boxes to save space, and bring them to a junk shop or barangay MRF. " +
    "You can also reuse the blank side for notes, drawing, or scratch paper before recycling.",

  "metal/can":
    "This is a metal or tin can. For this item, the best of the 5 Rs is: Recycle. " +
    "Why recycle? Because metals are infinitely recyclable without losing quality, and they have real cash value. " +
    "Aluminum cans can earn you 40 to 80 pesos per kilo at junk shops. " +
    "Rinse the can to remove food residue, flatten it to save space, and collect them over time. " +
    "You can also creatively reuse clean cans as planters, pencil holders, or lanterns.",

  // ─── REPAIR-focused items ──────────────────────────────────────────
  "e-waste":
    "This is electronic waste. For this item, the best of the 5 Rs is: Repair. " +
    "Why repair? Because most electronics — phones, laptops, chargers, fans — have modular parts " +
    "that a local technician can replace affordably: a new screen, battery, or charging port. " +
    "Repairing is almost always cheaper than buying new and keeps toxic components out of landfills. " +
    "Never burn e-waste — the fumes release lead, mercury, and cadmium. " +
    "If it truly cannot be fixed, bring it to a DENR-accredited e-waste collector.",

  "rubber/tsinelas":
    "This is rubber, like slippers or shoes. For this item, the best of the 5 Rs is: Repair. " +
    "Why repair? Because a local cobbler or zapatero can resole, re-glue, or patch footwear " +
    "for a fraction of the cost of buying new. Most slippers and shoes break at the strap or sole — easy fixes. " +
    "Old rubber tires can be upcycled into playground equipment, flower pots, or swings. " +
    "When buying next time, choose durable footwear so it lasts longer and creates less waste.",

  "furniture/appliance":
    "This is furniture or an appliance. For this item, the best of the 5 Rs is: Repair. " +
    "Why repair? Because furniture and appliances are large items made of valuable materials — " +
    "fixing them is usually cheaper than replacement and keeps tons of waste out of landfills. " +
    "A wobbly chair needs a screw, a fan might just need a new capacitor. " +
    "If it still works but you no longer need it, sell or donate it on secondhand platforms. " +
    "When truly beyond repair, disassemble it — separate the metal, wood, and plastic for proper recycling.",

  // ─── RECOVER-focused items ─────────────────────────────────────────
  "organic/food waste":
    "This is organic or food waste. For this item, the best of the 5 Rs is: Recover — specifically, composting. " +
    "Why recover? Because food scraps, fruit peels, and vegetable trimmings naturally decompose " +
    "and transform into rich, nutrient-dense soil in just 4 to 8 weeks. " +
    "Even a small bin on your balcony works. Layer green waste with dry leaves for best results. " +
    "Composting keeps organic waste out of landfills where it would produce methane — " +
    "a greenhouse gas 80 times more potent than carbon dioxide.",

  "cooking oil/grease":
    "This is used cooking oil. For this item, the best of the 5 Rs is: Recover. " +
    "Why recover? Because used cooking oil can be converted into biodiesel fuel or handmade soap — " +
    "giving it real economic value instead of becoming pollution. " +
    "Some collectors actively buy used oil. Never pour it down the drain — it solidifies in pipes " +
    "and creates fatbergs that block entire sewage systems. " +
    "Store used oil in a sealed bottle and bring it to a collection point or local soap-maker.",

  "garden/yard waste":
    "This is garden or yard waste — leaves, branches, or grass clippings. For this item, the best of the 5 Rs is: Recover. " +
    "Why recover? Because garden waste is nature's best compost ingredient. " +
    "Fallen leaves and grass clippings become rich, free fertilizer in just a few weeks. " +
    "No need to buy commercial soil — your garden produces its own. " +
    "Larger branches can be reused as plant stakes, trellises, or garden bed borders. " +
    "Never burn yard waste — composting returns nutrients to the soil instead of releasing carbon into the air.",

  "pet waste":
    "This is pet waste. For this item, the best of the 5 Rs is: Recover. " +
    "Why recover? Because dog and cat waste can be composted in a dedicated separate bin — " +
    "but only use the resulting compost for non-food plants like flowers, shrubs, or trees. " +
    "Never mix pet waste compost with your vegetable garden. " +
    "Always bag pet waste before collection and never throw it into drainage canals or waterways — " +
    "it carries harmful bacteria that contaminate water supplies.",

  // ─── FALLBACK ──────────────────────────────────────────────────────
  "other":
    "Item detected. When you're unsure about a trash item, apply the 5 Rs in order. " +
    "First, ask: can I Reduce by avoiding this item next time? " +
    "Second: can I Reuse it for a different purpose? " +
    "Third: can I Recover value from it through composting or energy? " +
    "Fourth: can I Recycle it at a junk shop or MRF? " +
    "Fifth: can I Repair it before throwing it away? " +
    "Check with your local barangay MRF or junk shop — they often accept more than you think.",
};

export function getSpeechText(category: TrashCategory): string {
  const specific = CATEGORY_SPEECH[category];
  if (specific) {
    return specific;
  }

  // Fallback for any unknown category — dynamically build from FIVE_R_DATA
  const data = FIVE_R_DATA[category];
  if (!data) {
    return "Item detected. Please check the recommendations on screen for proper disposal guidance.";
  }

  const actionExplanations: Record<string, string> = {
    reduce: "Reduce — avoid creating this waste in the first place. Think before you buy and find alternatives.",
    reuse: "Reuse — find a new purpose for this item instead of throwing it away.",
    recover: "Recover — turn this waste into something useful, like compost or energy.",
    recycle: "Recycle — bring it to a junk shop or recycling center where it can become a new product.",
    repair: "Repair — fix it instead of replacing it. Local repair shops can often help.",
  };

  const actionDesc = actionExplanations[data.bestAction] || "Check the screen for recommendations.";
  return `The item detected is: ${category}. For this item, the best of the 5 Rs is: ${actionDesc}`;
}

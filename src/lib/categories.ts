export type TrashCategory = string;

export interface FiveRRecommendation {
  reduce: string;
  reuse: string;
  recover: string;
  recycle: string;
  repair: string | null;
  bestAction: "reduce" | "reuse" | "recover" | "recycle" | "repair";
  bestActionSummary: string;
}

export interface CategoryInfo {
  name: string;
  emoji: string;
  tags: string[]; // searchable keywords
  fiveR: FiveRRecommendation;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: "plastic bottle",
    emoji: "🧴",
    tags: ["bote", "pet", "mineral water", "softdrinks", "tubig", "plastic bottle"],
    fiveR: {
      reduce: "Magdala ng reusable na bote o tumbler. Isang reusable bottle ang pumapalit sa daan-daang single-use plastic bottles bawat taon.",
      reuse: "Linisin at gamitin bilang paso, lalagyan ng lapis, o lagyan ulit ng tubig.",
      recover: "Ang PET bottles ay may halaga — kolektahin at dalhin sa junk shop. Natutunaw ito para gawing polyester fiber.",
      recycle: "I-flatten at takpan, dalhin sa barangay MRF o junk shop.",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Gumamit ng reusable na bote para mawala ang basura na ito sa simula pa lang.",
    },
  },
  {
    name: "plastic wrapper/sachet",
    emoji: "🍬",
    tags: ["sachet", "wrapper", "shampoo", "coffee", "junk food", "candy", "chichiria", "plastic"],
    fiveR: {
      reduce: "Bumili ng refill o sa tingi refill stations kaysa single-serve sachets.",
      reuse: "Malilinis na sachet ay pwedeng gawing bag o banig sa mga eco-brick programs.",
      recover: "May mga cement kilns na tumatanggap ng sachet waste bilang fuel.",
      recycle: "Karamihan ng MRF ay hindi ma-recycle ang multilayer sachets. I-segregate nang hiwalay.",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Ang sachets ay halos imposibleng i-recycle. Iwasan — bumili ng refill na lang.",
    },
  },
  {
    name: "paper/cardboard",
    emoji: "📦",
    tags: ["papel", "karton", "box", "notebook", "newspaper", "dyaryo", "tissue", "cardboard"],
    fiveR: {
      reduce: "Mag-digital na para sa resibo at notes. I-reuse ang paper bags.",
      reuse: "Gamitin ang blangkong side para sa notes o drawing. Cardboard boxes ay nagiging storage o craft.",
      recover: "I-compost ang uncoated paper — nababreak down ito sa 2-6 na linggo.",
      recycle: "Panatilihing tuyo at i-flatten. Dalhin sa junk shop o MRF.",
      repair: null,
      bestAction: "recycle",
      bestActionSummary: "Madaling i-recycle ang papel — panatilihing tuyo at dalhin sa junk shop.",
    },
  },
  {
    name: "glass",
    emoji: "🫙",
    tags: ["baso", "garapon", "bote", "salamin", "jar", "wine", "beer bottle", "glass"],
    fiveR: {
      reduce: "Pumili ng refillable glass containers o bumili mula sa tindahan na tumatanggap ng bottle returns.",
      reuse: "Glass jars ay perpekto para sa food storage, baso, candle holder, o terrarium.",
      recover: "Ang dinurog na glass (cullet) ay pwedeng gamitin sa construction bilang aggregate.",
      recycle: "Ang glass ay infinitely recyclable. Dalhin ang malinis na bottles sa junk shop o MRF.",
      repair: null,
      bestAction: "reuse",
      bestActionSummary: "Ang glass ay tumatagal nang forever — hugasan at gamitin ulit.",
    },
  },
  {
    name: "metal/can",
    emoji: "🥫",
    tags: ["lata", "tin can", "aluminum", "metal", "sardinas", "beer can", "soda can", "kawali"],
    fiveR: {
      reduce: "Gumamit ng reusable na lunch box kaysa canned goods kung pwede.",
      reuse: "Tin cans ay nagiging planters, pen holders, lanterns, o storage containers.",
      recover: "Metals ay mataas ang scrap value. Aluminum cans ay ₱40-80 per kilo sa junk shops.",
      recycle: "Banlawan, i-flatten, at dalhin sa junk shop. Aluminum at tin ay endlessly recyclable.",
      repair: "Ang dented na metal items (kaldero, tools) ay kaya pang i-hammer o i-weld sa repair shop.",
      bestAction: "recycle",
      bestActionSummary: "Ang metals ay may value at infinitely recyclable — ibenta sa junk shop.",
    },
  },
  {
    name: "e-waste",
    emoji: "🔌",
    tags: ["cellphone", "charger", "battery", "computer", "laptop", "tv", "remote", "cable", "electronic", "gadget"],
    fiveR: {
      reduce: "Alagaan ang electronics para mas tumagal — gumamit ng cases at surge protectors.",
      reuse: "Kung gumagana pa, i-donate o ibenta. Lumang phones ay nagiging security camera o learning tool.",
      recover: "E-waste ay may precious metals (gold, copper, palladium). Certified recyclers ang nag-extract nito.",
      recycle: "HUWAG sunugin — nakakalason ang usok. Dalhin sa DENR-accredited e-waste collector.",
      repair: "Karamihan ng electronics ay kaya pang ayusin — screen, battery, charging port. Tanungin ang technician.",
      bestAction: "repair",
      bestActionSummary: "Subukan munang i-repair — karamihan ng electronics ay kaya pang ayusin ng local technician.",
    },
  },
  {
    name: "organic/food waste",
    emoji: "🍌",
    tags: ["pagkain", "prutas", "gulay", "tira", "bulok", "balat", "dahon", "damo", "food waste", "saging"],
    fiveR: {
      reduce: "Mag-plano ng meals, i-store nang maayos ang pagkain, at unahin kainin ang mga tira.",
      reuse: "Vegetable scraps ay nagiging sabaw. Overripe na saging ay pwedeng gawing kakanin.",
      recover: "I-compost ito! Nagiging mayamang lupa sa 4-8 linggo. Kahit maliit na bin sa balcony ay pwede.",
      recycle: "Hindi recyclable sa traditional na paraan, pero community composting programs ay ginagawa itong garden soil.",
      repair: null,
      bestAction: "recover",
      bestActionSummary: "I-compost ito — ang organic waste ay nagiging mayamang lupa sa ilang linggo lang.",
    },
  },
  {
    name: "styrofoam",
    emoji: "🥡",
    tags: ["foam", "polystyrene", "takeout", "container", "styro", "food container"],
    fiveR: {
      reduce: "Magdala ng sariling containers (BYOC) para sa takeout. Tanggihan ang styrofoam.",
      reuse: "Malinis na styrofoam ay pwedeng gamitin para sa seedling trays o paint palettes.",
      recover: "Kakaunti pa ang facilities na nag-d-densify ng styrofoam sa Pilipinas.",
      recycle: "Halos walang facility sa Pilipinas ang tumatanggap nito. I-segregate at ipaglaban ang ban.",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Ang styrofoam ay hindi talaga mare-recycle dito — iwasan ito, magdala ng sariling container.",
    },
  },
  {
    name: "plastic bag",
    emoji: "🛍️",
    tags: ["supot", "plastic bag", "sando bag", "grocery bag", "shopping bag"],
    fiveR: {
      reduce: "Magdala ng eco bag sa palengke o grocery. Tanggihan ang plastic bag.",
      reuse: "Gamitin ulit bilang basurahan liner o lalagyan ng mga gamit.",
      recover: "Ilang recycling programs ang tumatanggap ng malambot na plastic — alamin sa LGU.",
      recycle: "Karamihan ng MRF ay hindi tumatanggap ng plastic bags. I-segregate na lang.",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Magdala ng eco bag — isa sa pinakamadaling paraan na mabawasan ang plastic waste.",
    },
  },
  {
    name: "diaper/sanitary",
    emoji: "🧷",
    tags: ["diaper", "napkin", "sanitary pad", "pampers", "lampin", "panty liner"],
    fiveR: {
      reduce: "Subukan ang cloth diapers o reusable menstrual cups/cloth pads bilang alternatibo.",
      reuse: "Hindi pwedeng i-reuse dahil sa hygiene. Siguruhing naka-wrap bago itapon.",
      recover: "Walang practical na recovery method para dito sa kasalukuyan.",
      recycle: "Hindi recyclable. Itapon sa residual waste (hindi sa recyclable bin).",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Subukan ang reusable alternatives tulad ng cloth diapers o menstrual cups.",
    },
  },
  {
    name: "rubber/tsinelas",
    emoji: "🩴",
    tags: ["tsinelas", "goma", "rubber", "sapatos", "shoes", "slippers", "tire", "gulong"],
    fiveR: {
      reduce: "Bumili ng matibay na tsinelas/sapatos para mas tumagal at mabawasan ang waste.",
      reuse: "Lumang tsinelas ay ginagawang doormat, plant hangers, o art materials ng mga bata.",
      recover: "Ang lumang tires ay ginagamit sa construction, playground, o flower pots.",
      recycle: "May ilang recycler na tumatanggap ng rubber para gawing flooring o sports surfaces.",
      repair: "Ang mga sapatos at tsinelas ay kaya pang patapalan o ayusin sa zapatero.",
      bestAction: "repair",
      bestActionSummary: "Dalhin sa zapatero — karamihan ng sapatos at tsinelas ay kaya pang ayusin.",
    },
  },
  {
    name: "clothing/tela",
    emoji: "👕",
    tags: ["damit", "tela", "cloth", "t-shirt", "pants", "shorts", "towel", "blanket", "kumot", "tuwalya"],
    fiveR: {
      reduce: "Bumili lang ng kailangan. Subukan ang ukay-ukay para mabawasan ang demand sa fast fashion.",
      reuse: "I-donate ang mga hindi na kasya. Lumang damit ay nagiging basahan, quilts, o pet beds.",
      recover: "Ang natural fibers (cotton, linen) ay pwedeng i-compost kapag wala nang ibang gamit.",
      recycle: "May textile recyclers na tumatanggap ng lumang tela. Alamin sa LGU o online groups.",
      repair: "Ang sira-sirang damit ay kaya pang tahiin o patchwork-in. Dalhin sa mananahi.",
      bestAction: "reuse",
      bestActionSummary: "I-donate o gawing basahan — ang lumang damit ay may maraming second life pa.",
    },
  },
  {
    name: "tetra pak/juice box",
    emoji: "🧃",
    tags: ["juice box", "tetra pak", "milk carton", "gatas", "juice", "c2", "zest-o"],
    fiveR: {
      reduce: "Gumamit ng reusable na tumbler at gumawa ng sariling juice sa bahay.",
      reuse: "Ang malinis na tetra pak ay pwedeng gawing wallet, pencil case, o small planter.",
      recover: "Ang tetra pak ay may aluminum at paper layer na pwedeng i-process ng specialized recycler.",
      recycle: "Hirap i-recycle locally dahil multilayer. May ilang programs sa Manila na tumatanggap.",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Gumamit ng tumbler at gumawa ng sariling juice — mas tipid at walang basura.",
    },
  },
  {
    name: "cooking oil/grease",
    emoji: "🫗",
    tags: ["mantika", "oil", "cooking oil", "grease", "taba", "used oil"],
    fiveR: {
      reduce: "Gumamit ng tamang dami lang ng mantika sa pagluluto. Air fry kung pwede.",
      reuse: "Used cooking oil ay pwedeng gamitin 2-3 beses bago palitan (i-strain sa coffee filter).",
      recover: "Ang used cooking oil ay pwedeng gawing biodiesel o soap. May mga collectors nito.",
      recycle: "HUWAG itapon sa lababo o drainage — nakakapinsala sa tubig. Ilagay sa bote at itapon nang maayos.",
      repair: null,
      bestAction: "recover",
      bestActionSummary: "Ang used cooking oil ay pwedeng gawing sabon o biodiesel — huwag itapon sa lababo.",
    },
  },
  {
    name: "batteries",
    emoji: "🔋",
    tags: ["battery", "baterya", "alkaline", "rechargeable", "aa", "aaa", "lithium"],
    fiveR: {
      reduce: "Gumamit ng rechargeable batteries kaysa disposable. Mas matipid at less waste.",
      reuse: "Ang 'patay' na batteries sa remote ay pwede pang gumana sa wall clock na low-drain.",
      recover: "Ang batteries ay may zinc, manganese, at iba pang metals na pwedeng i-recover ng specialized facilities.",
      recycle: "HUWAG itapon kasama ng regular na basura — nakakalason. Dalhin sa e-waste collection o designated bins.",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Gumamit ng rechargeable batteries — mas mura sa matagalan at mas kaunti ang basura.",
    },
  },
  {
    name: "light bulbs",
    emoji: "💡",
    tags: ["bombilya", "ilaw", "bulb", "fluorescent", "led", "cfl", "lamp"],
    fiveR: {
      reduce: "Gumamit ng LED bulbs — tumatagal ng 10-25 taon at mas matipid sa kuryente.",
      reuse: "Ang burned-out bulbs ay pwedeng gawing terrarium, ornament, o art piece (ingat sa pagputol).",
      recover: "Ang fluorescent/CFL ay may mercury — kailangan ng special handling para ma-recover.",
      recycle: "HUWAG basagin — especially CFL/fluorescent. Dalhin sa hardware store o e-waste collection.",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Lumipat sa LED — tumatagal ng maraming taon at hindi kailangang palitan nang palitan.",
    },
  },
  {
    name: "medicine/chemicals",
    emoji: "💊",
    tags: ["gamot", "medicine", "chemical", "bleach", "pesticide", "paint", "thinner", "expired"],
    fiveR: {
      reduce: "Bumili lang ng kailangan na gamot. Check expiry dates bago bumili.",
      reuse: "HUWAG i-reuse ang lalagyan ng chemicals para sa pagkain o tubig — delikado.",
      recover: "Ang ilang pharmacies ay may take-back programs para sa expired medicines.",
      recycle: "Hindi pwedeng i-recycle kasama ng regular waste. Dalhin sa pharmacy o LGU hazardous waste collection.",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Bumili lang ng kailangan at dalhin ang expired medicines sa pharmacy para sa tamang disposal.",
    },
  },
  {
    name: "construction debris",
    emoji: "🧱",
    tags: ["semento", "bato", "brick", "tile", "kahoy", "wood", "yero", "construction", "hollow block"],
    fiveR: {
      reduce: "Mag-plano nang maayos ang construction para mabawasan ang scrap materials.",
      reuse: "Lumang kahoy at yero ay pwedeng gamitin ulit sa susunod na project o ibenta.",
      recover: "Ang crushed concrete ay pwedeng gamitin bilang road base o fill material.",
      recycle: "Ang metal (yero, rebar) ay may mataas na scrap value. Dalhin sa junk shop.",
      repair: "Ayusin ang mga sira kaysa palitan — minsan kaya pa ang patching o reinforcing.",
      bestAction: "reuse",
      bestActionSummary: "Lumang construction materials ay pwede pang gamitin — ibenta o i-donate sa kapwa.",
    },
  },
  {
    name: "cigarette butts",
    emoji: "🚬",
    tags: ["sigarilyo", "yosi", "cigarette", "butt", "filter", "tobacco"],
    fiveR: {
      reduce: "Ang pinakamainam? Huminto sa paninigarilyo — para sa kalusugan at kalikasan.",
      reuse: "Hindi pwedeng i-reuse. Ang filters ay may toxins na nakakapinsala sa lupa at tubig.",
      recover: "May ilang specialized programs na kumolekta ng butts para i-recycle ang plastic filter.",
      recycle: "Hindi pwedeng itapon sa regular recycling. HUWAG ibato kahit saan — 10-12 taon bago mabulok.",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Ang cigarette butts ay isa sa pinakamalaking ocean pollutant — huminto o mag-dispose nang maayos.",
    },
  },
  {
    name: "straw/stirrer",
    emoji: "🥤",
    tags: ["straw", "stirrer", "stir stick", "plastic straw", "paper straw"],
    fiveR: {
      reduce: "Tanggihan ang straw — 'no straw please!' Magdala ng reusable metal/bamboo straw.",
      reuse: "Ang reusable straws (metal, bamboo, silicone) ay tumatagal ng maraming taon.",
      recover: "Masyadong maliit para i-process ng karamihan ng recycling facilities.",
      recycle: "Hindi karaniwang tinatanggap sa MRF dahil sa laki. I-segregate kasama ng plastic waste.",
      repair: null,
      bestAction: "reduce",
      bestActionSummary: "Tanggihan na lang ang straw o gumamit ng reusable — madaling habit na palitan.",
    },
  },
  {
    name: "furniture/appliance",
    emoji: "🪑",
    tags: ["upuan", "mesa", "furniture", "appliance", "electric fan", "ref", "washing machine", "cabinet"],
    fiveR: {
      reduce: "Bumili ng quality na furniture/appliance na tatagal — mas matipid sa matagalan.",
      reuse: "I-donate o ibenta ang gumagana pa sa secondhand shops o online marketplaces.",
      recover: "Ang metal at wood components ay may scrap value — i-disassemble at ibenta ang parts.",
      recycle: "I-separate ang materials (metal, wood, plastic) at dalhin sa tamang recycler.",
      repair: "Karamihan ng sirang furniture at appliance ay kaya pang ayusin — subukan muna bago itapon.",
      bestAction: "repair",
      bestActionSummary: "Subukan munang ipaayos — mas mura kaysa bumili ng bago at mabawasan ang waste.",
    },
  },
  {
    name: "garden/yard waste",
    emoji: "🌿",
    tags: ["dahon", "sanga", "damo", "halaman", "garden", "yard", "leaves", "grass", "branches"],
    fiveR: {
      reduce: "Gumamit ng mulch para mabawasan ang need mag-trim. Plant native species na low-maintenance.",
      reuse: "Ang mga sanga ay pwedeng gawing stakes para sa halaman o border sa garden.",
      recover: "I-compost ang lahat ng dahon at damo — naging excellent na pataba sa 4-8 linggo.",
      recycle: "Ang dry leaves ay pwedeng gamitin bilang brown material sa compost bin.",
      repair: null,
      bestAction: "recover",
      bestActionSummary: "I-compost ang garden waste — libre at napakagandang pataba para sa mga halaman mo.",
    },
  },
  {
    name: "pet waste",
    emoji: "🐕",
    tags: ["tae", "dumi", "aso", "pusa", "pet", "dog", "cat", "animal waste"],
    fiveR: {
      reduce: "Train ang pet para mag-poop sa designated area para mas madaling linisin.",
      reuse: "Hindi pwedeng i-reuse. Siguruhing naka-bag bago itapon.",
      recover: "Ang dog waste ay pwedeng i-compost sa SEPARATE na compost bin (huwag ihalo sa food plants).",
      recycle: "Hindi recyclable. Itapon sa residual waste nang naka-bag.",
      repair: null,
      bestAction: "recover",
      bestActionSummary: "I-compost sa hiwalay na bin para sa non-food plants — huwag itapon sa drainage.",
    },
  },
  {
    name: "ceramic/porcelain",
    emoji: "🍽️",
    tags: ["pinggan", "tasa", "mug", "ceramic", "porcelain", "plate", "cup", "vase"],
    fiveR: {
      reduce: "Mag-ingat sa paghawak para hindi mabasag. Bumili ng matibay na brands.",
      reuse: "Ang basag na ceramic ay pwedeng gawing mosaic art, garden path, o drainage layer sa pots.",
      recover: "Ang crushed ceramics ay pwedeng gamitin bilang drainage material sa mga paso.",
      recycle: "Hindi pwedeng i-recycle kasama ng glass. I-wrap at itapon nang maayos o gamitin sa crafts.",
      repair: "Ang basag na pinggan/mug ay pwedeng idikit gamit ang epoxy o kintsugi technique.",
      bestAction: "reuse",
      bestActionSummary: "Gawing mosaic art o garden decor ang mga basag na ceramic — creative at zero waste.",
    },
  },
  {
    name: "other",
    emoji: "❓",
    tags: ["iba pa", "hindi alam", "unknown", "misc", "other"],
    fiveR: {
      reduce: "Mag-isip muna bago bumili: kailangan mo ba talaga?",
      reuse: "Maging malikhain — maraming items ang may second life bilang craft o donation.",
      recover: "Tingnan kung may material value na tatanggapin ng junk shop o repair shop.",
      recycle: "Kung hindi sigurado, tanungin ang barangay MRF o local junk shop.",
      repair: "Kung sira pero pwede pang ayusin, subukan muna sa local repair shop bago itapon.",
      bestAction: "reduce",
      bestActionSummary: "Kapag hindi sigurado, ang pinakamainam na gawin ay mag-reduce.",
    },
  },
];

// Helper functions for backward compatibility
export const VALID_CATEGORIES: TrashCategory[] = CATEGORIES.map((c) => c.name);

export const CATEGORY_EMOJI: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.emoji])
);

export const FIVE_R_DATA: Record<string, FiveRRecommendation> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.fiveR])
);

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

// Search function for categories
export function searchCategories(query: string): CategoryInfo[] {
  if (!query.trim()) return CATEGORIES;

  const q = query.toLowerCase().trim();
  return CATEGORIES.filter(
    (cat) =>
      cat.name.toLowerCase().includes(q) ||
      cat.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

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
      "Magdala ng reusable na bote o tumbler. Isang reusable bottle ang pumapalit sa daan-daang single-use plastic bottles bawat taon.",
    reuse:
      "Linisin at gamitin bilang paso, lalagyan ng lapis, o lagyan ulit ng tubig mula sa purified source bago itapon.",
    recover:
      "Ang PET bottles ay may halaga — kolektahin at dalhin sa junk shop. Natutunaw ito para gawing polyester fiber para sa damit at bag.",
    recycle:
      "I-flatten at takpan, tapos dalhin sa barangay MRF o pinakamalapit na junk shop. [I-update: Lagyan ng Liliw drop-off location]",
    repair: null,
    bestAction: "reduce",
    bestActionSummary: "Gumamit ng reusable na bote para mawala ang basura na ito sa simula pa lang.",
  },
  "plastic wrapper/sachet": {
    reduce:
      "Bumili ng refill o sa tingi refill stations kaysa single-serve sachets. Isang refill ang pumapalit sa 30+ sachets bawat buwan.",
    reuse:
      "Mahirap i-reuse ang food-grade sachets — pero ang malilinis na sachet ay pwedeng gawing bag o banig sa mga eco-brick programs.",
    recover:
      "May mga cement kilns na tumatanggap ng sachet waste bilang fuel (co-processing). Alamin kung may collection program ang LGU mo.",
    recycle:
      "Karamihan ng MRF ay hindi ma-recycle ang multilayer sachets. I-segregate nang hiwalay. [I-update: Lagyan ng Liliw sachet collection partner]",
    repair: null,
    bestAction: "reduce",
    bestActionSummary: "Ang sachets ay halos imposibleng i-recycle. Iwasan — bumili ng refill na lang.",
  },
  "paper/cardboard": {
    reduce:
      "Mag-digital na para sa resibo at notes. I-reuse ang paper bags. Tanggihan ang hindi kailangan na flyers at packaging.",
    reuse:
      "Gamitin ang blangkong side para sa notes o drawing ng mga bata. Ang cardboard boxes ay nagiging storage o craft projects.",
    recover:
      "I-compost ang uncoated paper — nababreak down ito sa 2-6 na linggo at nagpapayaman ng lupa.",
    recycle:
      "Panatilihing tuyo at i-flatten. Paper/cardboard ang isa sa pinakamadaling i-recycle. Dalhin sa junk shop o MRF. [I-update: Lagyan ng Liliw junk shop address]",
    repair: null,
    bestAction: "recycle",
    bestActionSummary: "Madaling i-recycle ang papel — panatilihing tuyo at dalhin sa junk shop.",
  },
  glass: {
    reduce:
      "Pumili ng mga produktong nasa refillable glass containers o bumili mula sa tindahan na tumatanggap ng bottle returns.",
    reuse:
      "Ang glass jars ay perpekto para sa food storage, baso, candle holder, o terrarium. Hugasan at gamitin nang paulit-ulit.",
    recover:
      "Ang dinurog na glass (cullet) ay pwedeng gamitin sa construction bilang aggregate. May mga LGU na kumolekta nito.",
    recycle:
      "Ang glass ay infinitely recyclable. Dalhin ang malinis na bottles sa junk shop o MRF. I-separate ayon sa kulay kung kailangan. [I-update: Lagyan ng Liliw glass collection point]",
    repair: null,
    bestAction: "reuse",
    bestActionSummary: "Ang glass ay tumatagal nang forever — hugasan at gamitin ulit bilang storage o dekorasyon.",
  },
  "metal/can": {
    reduce:
      "Gumamit ng reusable na lunch box kaysa canned goods kung pwede. Magluto ng fresh kung kaya.",
    reuse:
      "Ang tin cans ay nagiging planters, pen holders, lanterns, o storage containers. Pakinisin ang edges para safe.",
    recover:
      "Ang metals ay mataas ang scrap value. Ang aluminum cans ay sobrang valuable — isang kilo ng cans ay ₱40-80 sa junk shops.",
    recycle:
      "Banlawan, i-flatten, at dalhin sa junk shop. Ang aluminum at tin ay endlessly recyclable. [I-update: Lagyan ng pinakamalapit na Liliw junk shop]",
    repair: "Ang mga dented na metal items (kaldero, tools, kutsara) ay kadalasang kaya pang i-hammer back o i-weld sa local repair shop.",
    bestAction: "recycle",
    bestActionSummary: "Ang metals ay may value at infinitely recyclable — ibenta sa junk shop.",
  },
  "e-waste": {
    reduce:
      "Alagaan ang electronics para mas tumagal — gumamit ng cases, surge protectors, at i-update ang firmware.",
    reuse:
      "Kung gumagana pa, i-donate o ibenta sa pwedeng gumamit. Ang lumang phones ay nagiging security camera, music player, o learning tool ng mga bata.",
    recover:
      "Ang e-waste ay may precious metals (gold, copper, palladium). Ang certified recyclers ang nagbubunot nito nang ligtas.",
    recycle:
      "HUWAG sunugin ang e-waste — nakakalason ang usok. Dalhin sa DENR-accredited e-waste collector o LGU collection drive. [I-update: Lagyan ng Liliw/Laguna e-waste events]",
    repair: "Karamihan ng electronics ay kaya pang ayusin — screen replacement, battery swap, charging port fix. Tanungin muna ang local technician bago itapon.",
    bestAction: "repair",
    bestActionSummary: "Subukan munang i-repair — karamihan ng electronics ay kaya pang ayusin ng local technician.",
  },
  "organic/food waste": {
    reduce:
      "Mag-plano ng meals, i-store nang maayos ang pagkain, at unahin kainin ang mga tira. Ang pinakamainam na food waste ay yung hindi nangyari.",
    reuse:
      "Ang vegetable scraps ay nagiging sabaw. Ang stale bread ay nagiging breadcrumbs. Ang overripe na saging ay pwedeng gawing kakanin o banana bread.",
    recover:
      "I-compost ito! Ang organic waste ay nababreak down at nagiging mayamang lupa sa 4-8 linggo. Kahit maliit na bin sa balcony ay pwede.",
    recycle:
      "Hindi ito recyclable sa traditional na paraan, pero ang community composting programs ay ginagawa itong garden soil. [I-update: Lagyan ng Liliw composting program contact]",
    repair: null,
    bestAction: "recover",
    bestActionSummary: "I-compost ito — ang organic waste ay nagiging mayamang lupa sa ilang linggo lang.",
  },
  styrofoam: {
    reduce:
      "Magdala ng sariling containers (BYOC) para sa takeout. Tanggihan ang styrofoam packaging kung may alternatibo.",
    reuse:
      "Ang malinis na styrofoam containers ay pwedeng gamitin para sa seedling trays o paint palettes, pero mabilis masira.",
    recover:
      "May ilang specialized facilities na nag-d-densify ng styrofoam para i-reuse. Kakaunti pa sa Pilipinas.",
    recycle:
      "Ang styrofoam ay technically recyclable pero halos walang facility sa Pilipinas ang tumatanggap nito. I-segregate at ipaglaban ang ban. [I-update: Check kung may Liliw styrofoam ban ordinance]",
    repair: null,
    bestAction: "reduce",
    bestActionSummary: "Ang styrofoam ay hindi talaga mare-recycle dito — iwasan ito sa pamamagitan ng pagdadala ng sariling container.",
  },
  other: {
    reduce:
      "Mag-isip muna bago bumili: kailangan mo ba talaga? Ang pagpili ng produktong may kaunting packaging ay nakakabawas ng basura.",
    reuse:
      "Maging malikhain — maraming items ang may second life bilang craft materials, organizers, o donation items.",
    recover:
      "Tingnan kung may material value ang item (metal parts, usable components) na tatanggapin ng junk shop o repair shop.",
    recycle:
      "Kung hindi sigurado, tanungin ang barangay MRF o local junk shop kung ano ang tinatanggap nila. [I-update: Lagyan ng Liliw MRF contact number]",
    repair: "Kung sira pero pwede pang ayusin, subukan muna sa local repair shop bago itapon.",
    bestAction: "reduce",
    bestActionSummary: "Kapag hindi sigurado, ang pinakamainam na gawin ay mag-reduce — iwasan ang paggawa ng ganitong basura sa susunod.",
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

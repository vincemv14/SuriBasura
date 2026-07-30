import { TrashCategory } from "./categories";

/**
 * Filipino speech content for the 5R results.
 * Written in conversational, kid-friendly Tagalog.
 */

export const SPEECH_INTRO: Record<TrashCategory, string> = {
  "plastic bottle":
    "Ang na-detect ay isang plastic bottle! Ito ang mga pwede mong gawin:",
  "plastic wrapper/sachet":
    "Ang na-detect ay isang plastic wrapper o sachet! Ito ang mga pwede mong gawin:",
  "paper/cardboard":
    "Ang na-detect ay papel o cardboard! Ito ang mga pwede mong gawin:",
  glass:
    "Ang na-detect ay isang baso o garapon! Ito ang mga pwede mong gawin:",
  "metal/can":
    "Ang na-detect ay metal o lata! Ito ang mga pwede mong gawin:",
  "e-waste":
    "Ang na-detect ay e-waste o sirang electronic! Ito ang mga pwede mong gawin:",
  "organic/food waste":
    "Ang na-detect ay organic o food waste! Ito ang mga pwede mong gawin:",
  styrofoam:
    "Ang na-detect ay styrofoam! Ito ang mga pwede mong gawin:",
  other:
    "Hindi masyadong malinaw ang item na ito. Ito ang mga general na pwede mong gawin:",
};

export const SPEECH_BEST_ACTION: Record<TrashCategory, string> = {
  "plastic bottle":
    "Ang pinakamainam na gawin ay mag-Reduce. Gumamit ng reusable na bote para hindi na kailangan ang single-use plastic.",
  "plastic wrapper/sachet":
    "Ang pinakamainam na gawin ay mag-Reduce. Bumili ng refill o bulk para mabawasan ang sachet na ginagamit.",
  "paper/cardboard":
    "Ang pinakamainam na gawin ay mag-Recycle. Panatilihing tuyo at dalhin sa junk shop o MRF.",
  glass:
    "Ang pinakamainam na gawin ay mag-Reuse. Hugasan at gamitin ulit bilang storage o dekorasyon.",
  "metal/can":
    "Ang pinakamainam na gawin ay mag-Recycle. Ang metal ay may value pa. Dalhin sa junk shop.",
  "e-waste":
    "Ang pinakamainam na gawin ay mag-Repair. Karamihan ng electronics ay kaya pang ayusin ng technician.",
  "organic/food waste":
    "Ang pinakamainam na gawin ay mag-Recover. I-compost ito para maging pataba ng lupa.",
  styrofoam:
    "Ang pinakamainam na gawin ay mag-Reduce. Ang styrofoam ay halos hindi mare-recycle dito sa Pilipinas. Iwasan ito, magdala ng sariling container.",
  other:
    "Ang pinakamainam na gawin ay mag-Reduce. Isipin muna bago bumili kung talagang kailangan.",
};

// Список тем генерации. Чтобы добавить тему:
// 1) добавьте объект в массив ниже;
// 2) положите картинку-пример в public/themes/;
// 3) добавьте название и описание в messages/*.json -> "themes".
//
// prompt — описание для AI на английском (модели лучше понимают английский).

export type ThemeVariant = {
  id: string;
  prompt: string;
};

export type Theme = {
  id: string;
  image: string;
  prompt: string;
  variants?: ThemeVariant[];
  // Тема, где пользователь сам пишет описание.
  custom?: boolean;
};

const keepFace =
  "Keep the person's face, identity, skin tone, hairstyle and body proportions exactly as in the reference photos. Photorealistic, natural lighting, high detail.";

export const themes: Theme[] = [
  {
    id: "family",
    image: "/themes/family.svg",
    prompt: `A warm professional family photoshoot in a cozy setting. ${keepFace}`,
  },
  {
    id: "travel",
    image: "/themes/travel.svg",
    prompt: `A vacation travel photo. ${keepFace}`,
    variants: [
      { id: "beach", prompt: "On a sunny tropical beach with turquoise water." },
      { id: "mountains", prompt: "In the mountains with a scenic valley view." },
      { id: "city", prompt: "On a charming European city street." },
    ],
  },
  {
    id: "business",
    image: "/themes/business.svg",
    prompt: `A professional business photo. ${keepFace}`,
    variants: [
      { id: "portrait", prompt: "Business portrait in a modern office, smart clothing." },
      { id: "resume", prompt: "Clean headshot for a resume or LinkedIn, neutral background, business attire." },
    ],
  },
  {
    id: "holidays",
    image: "/themes/holidays.svg",
    prompt: `A festive holiday photo. ${keepFace}`,
    variants: [
      { id: "newyear", prompt: "New Year celebration with a decorated tree and warm lights." },
      { id: "birthday", prompt: "Birthday party with balloons and a cake." },
      { id: "wedding", prompt: "Elegant wedding photoshoot, formal attire, soft light." },
    ],
  },
  {
    id: "studio",
    image: "/themes/studio.svg",
    prompt: `A studio portrait with professional lighting and a seamless backdrop. ${keepFace}`,
  },
  {
    id: "custom",
    image: "/themes/custom.svg",
    prompt: keepFace,
    custom: true,
  },
];

// Рисует временные картинки (SVG) для тем и блока «до/после» и иконки PWA (PNG).
// Запуск: node scripts/make-placeholders.mjs
// Позже их заменят настоящие фото (см. public/library/).
import { writeFileSync } from "node:fs";
import sharp from "sharp";

// Силуэт человека — одинаковый на всех картинках.
const person = (x, y, s, color) => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="${color}">
    <circle cx="0" cy="-70" r="34"/>
    <path d="M-62 40 C-62 -10 -34 -28 0 -28 C34 -28 62 -10 62 40 L62 70 L-62 70 Z"/>
  </g>`;

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const scenes = {
  family: svg(400, 300, `
    <rect width="400" height="300" fill="#f3e8dc"/>
    <rect y="210" width="400" height="90" fill="#e2d2bf"/>
    <rect x="40" y="60" width="90" height="110" rx="6" fill="#ead9c6"/>
    ${person(150, 205, 0.9, "#b98b6a")}${person(250, 205, 0.9, "#9c7358")}${person(200, 235, 0.55, "#c99a78")}`),
  travel: svg(400, 300, `
    <rect width="400" height="300" fill="#cfe8f3"/>
    <circle cx="320" cy="70" r="30" fill="#f7d488"/>
    <rect y="170" width="400" height="50" fill="#6fb7cf"/>
    <rect y="220" width="400" height="80" fill="#efdcb3"/>
    ${person(200, 225, 0.9, "#8d6a54")}`),
  business: svg(400, 300, `
    <rect width="400" height="300" fill="#e3e6ec"/>
    <rect x="30" y="40" width="140" height="160" fill="#d2d7e0"/>
    <rect x="230" y="40" width="140" height="160" fill="#d2d7e0"/>
    ${person(200, 240, 1, "#39414f")}`),
  holidays: svg(400, 300, `
    <rect width="400" height="300" fill="#f1e4e6"/>
    <path d="M320 60 L360 200 L280 200 Z" fill="#6f9a7c"/>
    <circle cx="70" cy="80" r="22" fill="#e6a5ad"/><circle cx="110" cy="60" r="18" fill="#c9b6e4"/>
    <circle cx="300" cy="120" r="5" fill="#f0c56a"/><circle cx="335" cy="160" r="5" fill="#f0c56a"/>
    ${person(190, 235, 0.9, "#9a6b62")}`),
  studio: svg(400, 300, `
    <rect width="400" height="300" fill="#dedbd6"/>
    <ellipse cx="200" cy="150" rx="150" ry="130" fill="#e9e6e1"/>
    ${person(200, 240, 1, "#5b5550")}`),
  custom: svg(400, 300, `
    <rect width="400" height="300" fill="#e7e6f5"/>
    <rect x="70" y="70" width="260" height="160" rx="14" fill="none" stroke="#8e8ad6" stroke-width="3" stroke-dasharray="10 8"/>
    <path d="M200 115 l9 26 26 9 -26 9 -9 26 -9 -26 -26 -9 26 -9Z" fill="#8e8ad6"/>`),
};
for (const [id, s] of Object.entries(scenes)) writeFileSync(`public/themes/${id}.svg`, s);

// «До»: обычное фото на сером фоне. «После»: тот же человек на пляже.
writeFileSync("public/examples/before-1.svg", svg(400, 500, `
  <rect width="400" height="500" fill="#d9d9dc"/>
  <rect x="0" y="360" width="400" height="140" fill="#cacacf"/>
  ${person(200, 400, 1.6, "#77737a")}`));
writeFileSync("public/examples/after-1.svg", svg(400, 500, `
  <rect width="400" height="500" fill="#bfe2f1"/>
  <circle cx="310" cy="110" r="42" fill="#f7d488"/>
  <rect y="270" width="400" height="80" fill="#5eaecb"/>
  <rect y="350" width="400" height="150" fill="#efdcb3"/>
  ${person(200, 400, 1.6, "#8d6a54")}`));

// Иконки приложения: буква L в круге акцентного цвета.
const icon = (size, pad) => svg(size, size, `
  <rect width="${size}" height="${size}" rx="${pad ? 0 : size * 0.22}" fill="#4f46e5"/>
  <text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-weight="700" font-size="${size * (pad ? 0.42 : 0.56)}" fill="#ffffff">L</text>`);
const png = (s, size, out) => sharp(Buffer.from(s)).resize(size, size).png().toFile(out);
await png(icon(512, false), 192, "public/icons/icon-192.png");
await png(icon(512, false), 512, "public/icons/icon-512.png");
await png(icon(512, true), 512, "public/icons/icon-maskable-512.png");
await png(icon(512, true), 180, "public/icons/apple-touch-icon.png");
console.log("done");

// Скачивает бесплатные фото (лицензии CC0 и Public Domain) через Openverse
// для примеров, фонов и карточек тем. Уже скачанные фото пропускает.
//
// Запуск: NODE_USE_ENV_PROXY=1 node scripts/fetch-free-photos.mjs [сколько-на-категорию]
//
// Результат: public/library/<категория>/<id>.webp и public/library/manifest.json
// (там автор, лицензия и ссылка на источник для каждого фото).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const PER_CATEGORY = Number(process.argv[2] ?? 3);
const LIBRARY = "public/library";
const MANIFEST = `${LIBRARY}/manifest.json`;
const API = "https://api.openverse.org/v1/images/";
const UA = "Lumina-photo-app/1.0 (free photo library for examples)";

// Категория -> поисковые запросы. Совпадают с темами в config/themes.ts.
const categories = {
  family: ["family portrait outdoors", "family picnic"],
  beach: ["tropical beach", "sea coast sunny"],
  mountains: ["mountain landscape", "mountain valley"],
  city: ["european old town street", "city street"],
  business: ["modern office interior", "business portrait"],
  newyear: ["christmas tree lights", "new year celebration"],
  birthday: ["birthday party balloons", "birthday cake"],
  wedding: ["wedding ceremony", "wedding flowers"],
  studio: ["studio portrait backdrop", "photo studio"],
};

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { photos: [] };
const known = new Set(manifest.photos.map((p) => p.id));

async function search(q) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    q,
    license: "cc0,pdm",
    mature: "false",
    page_size: "20",
    aspect_ratio: "wide,square,tall",
    size: "large,medium",
  });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Openverse ${res.status} for "${q}"`);
  return (await res.json()).results ?? [];
}

let added = 0;
for (const [category, queries] of Object.entries(categories)) {
  let count = 0;
  for (const q of queries) {
    if (count >= PER_CATEGORY) break;
    let results = [];
    try {
      results = await search(q);
    } catch (e) {
      console.warn(`! ${e.message}`);
      continue;
    }
    for (const r of results) {
      if (count >= PER_CATEGORY) break;
      if (known.has(r.id)) continue;
      if (!["cc0", "pdm"].includes(r.license)) continue;
      if ((r.width ?? 0) < 1000 && (r.height ?? 0) < 1000) continue;
      try {
        const img = await fetch(r.url, { headers: { "User-Agent": UA } });
        if (!img.ok) continue;
        const buf = Buffer.from(await img.arrayBuffer());
        mkdirSync(`${LIBRARY}/${category}`, { recursive: true });
        const file = `${LIBRARY}/${category}/${r.id}.webp`;
        await sharp(buf).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 }).toFile(file);
        manifest.photos.push({
          id: r.id,
          category,
          file: file.replace(/^public/, ""),
          title: r.title ?? "",
          creator: r.creator ?? "",
          license: r.license,
          sourceUrl: r.foreign_landing_url ?? r.url,
          provider: r.source ?? "",
          fetchedAt: new Date().toISOString().slice(0, 10),
          // Агент или человек помечает здесь, подходит ли фото (true/false).
          approved: null,
        });
        known.add(r.id);
        count++;
        added++;
        console.log(`+ ${category}: ${r.title} (${r.license})`);
      } catch (e) {
        console.warn(`! skip ${r.id}: ${e.message}`);
      }
    }
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Added ${added} photos. Total: ${manifest.photos.length}.`);

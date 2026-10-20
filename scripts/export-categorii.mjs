// Scrie public/gestiune-ip98mac08m/categorii.json (grupe, categorii, mărci) din catalog, pentru formularul din admin.
import { readFileSync, writeFileSync } from "node:fs";

const cat = JSON.parse(readFileSync(new URL("../src/data/catalog.json", import.meta.url), "utf8"));
const brands = [...new Set(cat.products.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ro"));
writeFileSync(new URL("../public/gestiune-ip98mac08m/categorii.json", import.meta.url), JSON.stringify({ groups: cat.groups, categories: cat.categories, brands }, null, 1));
console.log("categorii.json scris:", Object.keys(cat.categories).length, "categorii,", brands.length, "mărci");

#!/usr/bin/env node
// The link-preview card is the one image that can't ship as SVG: the theme
// re-encodes `socialImage` to JPEG for scrapers, and Astro refuses to process
// an SVG source unless `image.dangerouslyProcessSVG` is set in astro.config.ts
// --- which is platform, and stays as it arrived. So card.svg is the artwork
// and card.png is generated from it. Re-run after editing the SVG:
//
//   node scripts/render-card.ts
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const src = resolve("src/assets/images/card.svg");
const out = resolve("src/assets/images/card.png");

const png = await sharp(readFileSync(src), { density: 144 })
  .resize(1200, 630, { fit: "fill" })
  .png()
  .toBuffer();
writeFileSync(out, png);
console.log(`rendered ${out} (${png.length} bytes) from card.svg`);

/**
 * Image compression script using sharp
 * Compresses all oversized images in src/assets to improve PageSpeed score
 * Placed locally inside project directory.
 */
import sharp from 'sharp';
import { statSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const ASSETS_DIR = './src/assets';

const configs = [
  // Hero images — LCP, keep quality but resize to max 1200px wide
  { file: 'zinger-hero.webp',        maxWidth: 1200, quality: 72, maxKB: 350 },
  { file: 'hero-mobile.webp',        maxWidth: 640,  quality: 70, maxKB: 200 },
  // Logo — should be tiny
  { file: 'br-logo-optimized.webp',  maxWidth: 400,  quality: 85, maxKB: 40 },
  // About page photo
  { file: 'brother-sister-duo.jpg',  maxWidth: 700,  quality: 75, maxKB: 150 },
  // Food gallery / carousel
  { file: 'full-meal-sm.webp',       maxWidth: 600,  quality: 72, maxKB: 150 },
  { file: 'potato-wedges-sm.webp',   maxWidth: 600,  quality: 72, maxKB: 150 },
  { file: 'lava-cake-sm.webp',       maxWidth: 600,  quality: 72, maxKB: 150 },
  { file: 'veg-crispy-sm.webp',      maxWidth: 600,  quality: 72, maxKB: 150 },
  { file: 'variety-sm.webp',         maxWidth: 600,  quality: 72, maxKB: 150 },
  { file: 'blaze-combo-sm.webp',     maxWidth: 600,  quality: 72, maxKB: 150 },
  { file: 'zinger-combo-sm.webp',    maxWidth: 600,  quality: 72, maxKB: 150 },
  { file: 'chicken-popcorn-sm.webp', maxWidth: 600,  quality: 72, maxKB: 150 },
  { file: 'double-blaze-chicken-sm.webp', maxWidth: 600, quality: 72, maxKB: 150 },
  { file: 'potato-wedges-menu.webp', maxWidth: 300,  quality: 75, maxKB: 80 },
];

async function compress() {
  console.log('🗜️  Starting image compression...\n');
  let totalSavedKB = 0;

  for (const cfg of configs) {
    const filePath = join(ASSETS_DIR, cfg.file);
    try {
      const statBefore = statSync(filePath);
      const beforeKB = Math.round(statBefore.size / 1024);

      if (beforeKB <= cfg.maxKB) {
        console.log(`✅ ${cfg.file}: ${beforeKB}KB — already within target (≤${cfg.maxKB}KB), skipping`);
        continue;
      }

      const ext = extname(cfg.file).toLowerCase();
      let sharpInstance = sharp(filePath).resize({ width: cfg.maxWidth, withoutEnlargement: true });

      if (ext === '.webp') {
        sharpInstance = sharpInstance.webp({ quality: cfg.quality, effort: 5 });
      } else if (ext === '.jpg' || ext === '.jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality: cfg.quality, mozjpeg: true });
      }

      const compressed = await sharpInstance.toBuffer();
      const afterKB = Math.round(compressed.length / 1024);

      if (compressed.length < statBefore.size) {
        writeFileSync(filePath, compressed);
        const savedKB = beforeKB - afterKB;
        totalSavedKB += savedKB;
        console.log(`✅ ${cfg.file}: ${beforeKB}KB → ${afterKB}KB (saved ${savedKB}KB)`);
      } else {
        console.log(`⚠️  ${cfg.file}: compressed (${afterKB}KB) larger than original (${beforeKB}KB) — kept original`);
      }
    } catch (err) {
      console.error(`❌ ${cfg.file}: ${err.message}`);
    }
  }

  console.log(`\n🎉 Done! Total saved: ~${totalSavedKB}KB (${Math.round(totalSavedKB/1024 * 10) / 10}MB)`);
}

compress();

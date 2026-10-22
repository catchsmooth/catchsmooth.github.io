import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('public/images', { recursive: true });
for (const file of ['love1', 'love2', 'love3', '3', 'bg', '海贼王']) {
  await sharp(`public/img/${file}.jpg`)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`public/images/${file}.webp`);
}

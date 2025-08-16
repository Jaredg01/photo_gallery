import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    const files = await fs.readdir(uploadsDir);
    // Only return image files
    const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
    return new Response(JSON.stringify(imageFiles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}



import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse multipart form data (simple, single file only)
async function parseMultipartFormData(request) {
  const contentType = request.headers.get('content-type') || '';
  const boundaryMatch = contentType.match(/boundary=(.*)$/);
  if (!boundaryMatch) throw new Error('No boundary');
  const boundary = boundaryMatch[1];
  const body = Buffer.from(await request.arrayBuffer());
  const parts = body.toString('latin1').split(`--${boundary}`);
  for (const part of parts) {
    if (part.includes('Content-Disposition: form-data;') && part.includes('filename="')) {
      // Extract filename
      const filenameMatch = part.match(/filename="(.+?)"/);
      if (!filenameMatch) continue;
      const filename = filenameMatch[1];
      // Find start of file data
      const fileStart = part.indexOf('\r\n\r\n');
      if (fileStart === -1) continue;
      // File data is after double CRLF, up to the last CRLF
      const fileData = part.substring(fileStart + 4, part.lastIndexOf('\r\n'));
      // Convert back to Buffer (latin1 preserves binary data)
      const fileBuffer = Buffer.from(fileData, 'latin1');
      return { filename, fileBuffer };
    }
  }
  throw new Error('No file found');
}

export async function POST(request) {
  try {
    const { filename, fileBuffer } = await parseMultipartFormData(request);
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
    await fs.writeFile(uploadPath, fileBuffer);
    return new Response(JSON.stringify({ url: `/uploads/${encodeURIComponent(filename)}` }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Upload failed' }), { status: 400 });
  }
}

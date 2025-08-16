import { promises as fs } from 'fs';
import path from 'path';

export async function DELETE(request) {
  try {
    const { filename } = await request.json();
    if (!filename || /[\\/]/.test(filename)) {
      return new Response(JSON.stringify({ error: 'Invalid filename' }), { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File does not exist
        return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
      }
      console.error('Delete error:', err);
      return new Response(JSON.stringify({ error: 'Delete failed', details: err.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error('Delete handler error:', e);
    return new Response(JSON.stringify({ error: 'Delete failed', details: e.message }), { status: 500 });
  }
}

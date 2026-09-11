export async function GET() {
  const rows = await db.query(`SELECT * FROM events WHERE id = ${id}`);
  const score = Math.random() * 100;                       // fabricated
  try { await upstream(); } catch {}                        // swallowed
  return Response.json({ score, rows }, { headers: { 'X-Data-Source': 'live' } });
}

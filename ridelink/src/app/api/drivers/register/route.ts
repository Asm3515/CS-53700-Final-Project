// export async function POST(req) {
//     const { name, email, licenseNumber, phone, password } = await req.json();
//     return new Response(JSON.stringify({ success: true, message: 'Driver registered' }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
  const data = await request.json();
 
  const success = true; 
 
  return NextResponse.json({ success });
}
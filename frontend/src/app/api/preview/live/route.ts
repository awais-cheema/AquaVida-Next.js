import { NextResponse } from 'next/server';
import { draftMode, cookies } from 'next/headers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const draftId = searchParams.get('draftId');
  const to = searchParams.get('to') || '/';

  if (!draftId) {
    return new Response('No draft ID provided', { status: 400 });
  }

  // Enable Next.js Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Set a session cookie for our Shadow Preview system
  const cookieStore = await cookies();
  cookieStore.set('shadow_draft_id', draftId, { 
    maxAge: 3600, // 1 hour
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  // Redirect to the target page
  // The page will now see the cookie and fetch the draft
  return NextResponse.redirect(new URL(to + (to.includes('?') ? '&' : '?') + 'draftId=' + draftId, req.url));
}

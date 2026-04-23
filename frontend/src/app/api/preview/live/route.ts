import { NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const draftId = searchParams.get('draftId');

  if (!draftId) {
    return new Response('No draft ID provided', { status: 400 });
  }

  // Enable Next.js Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the homepage with the draftId
  // The pages will need to be updated to check for this draftId if they want to show cached data.
  // For now, we redirect to a special preview landing or the main site.
  
  // To make this truly work "instantly", we would ideally redirect back to the page 
  // where the user was, but with the draft info.
  
  // Since we don't know the exact "to" path here easily (unless we pass it),
  // we'll try to guess or use a default.
  
  return NextResponse.redirect(new URL(`/?draftId=${draftId}`, req.url));
}

import { NextResponse } from 'next/server';

// In-memory cache for draft content
const draftCache = new Map<string, any>();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const draftId = Math.random().toString(36).substring(2, 15);
        draftCache.set(draftId, body);
        
        // Auto-cleanup after 10 minutes
        setTimeout(() => {
            draftCache.delete(draftId);
        }, 10 * 60 * 1000);

        return NextResponse.json({ draftId });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get('draftId');

    if (!draftId || !draftCache.has(draftId)) {
        return NextResponse.json({ error: 'Draft not found or expired' }, { status: 404 });
    }

    return NextResponse.json(draftCache.get(draftId));
}

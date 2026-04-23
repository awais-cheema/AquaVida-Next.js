import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const to = url.searchParams.get('to') || '/'
    const branch = url.searchParams.get('branch') || 'main'

    const draft = await draftMode()
    draft.enable()

    // Store branch info in a cookie for the reader
    const response = redirect(to)
    return response
}

import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

import { reader } from '@/lib/keystatic-reader'

export async function GET() {
    const results: any = {
        cwd: process.cwd(),
        files: {},
        env: process.env.NODE_ENV,
        reader_test: {},
    }

    // Log what path the reader resolved to
    const contentCheck = path.join(process.cwd(), 'content')
    results.content_exists = fs.existsSync(contentCheck)
    results.content_blogs_files = fs.existsSync(path.join(contentCheck, 'blogs'))
      ? fs.readdirSync(path.join(contentCheck, 'blogs'), { recursive: true })
      : 'NOT_FOUND'

    try {
        results.reader_test.posts = await reader.collections.posts.list()
        results.reader_test.portfolio = await reader.collections.portfolioProjects.list()
    } catch (e: any) {
        results.reader_test.error = e.message + '\n' + e.stack
    }

    const pathsToCheck = [
        '.',
        'content',
        'content/blogs',
        'frontend/content',
        'frontend/content/blogs',
    ]

    for (const p of pathsToCheck) {
        try {
            const absPath = path.resolve(process.cwd(), p)
            if (fs.existsSync(absPath)) {
                results.files[p] = fs.readdirSync(absPath)
            } else {
                results.files[p] = 'NOT_FOUND'
            }
        } catch (e: any) {
            results.files[p] = `ERROR: ${e.message}`
        }
    }

    return NextResponse.json(results)
}

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
        const postSlugs = await reader.collections.posts.list()
        results.reader_test.posts = postSlugs
        results.reader_test.portfolio = await reader.collections.portfolioProjects.list()
        
        // Try reading the first post to check for read errors
        if (postSlugs.length > 0) {
            try {
                const post = await reader.collections.posts.read(postSlugs[0])
                if (post) {
                    results.reader_test.first_post = {
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        category: post.category,
                        has_content: typeof post.content === 'function',
                        featured_image: post.featured_image,
                        is_featured: post.is_featured,
                    }
                } else {
                    results.reader_test.first_post = 'READ_RETURNED_NULL'
                }
            } catch (readErr: any) {
                results.reader_test.read_error = readErr.message + '\n' + readErr.stack
            }
        }
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

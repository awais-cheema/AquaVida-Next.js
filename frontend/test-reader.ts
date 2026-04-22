import { reader } from './src/lib/keystatic-reader'
import path from 'path'
import fs from 'fs'

async function test() {
  console.log('Current CWD:', process.cwd())
  const blogsPath = path.join(process.cwd(), 'content/blogs')
  if (fs.existsSync(blogsPath)) {
    console.log('Files in content/blogs:', fs.readdirSync(blogsPath))
  } else {
    console.log('content/blogs path does NOT exist at:', blogsPath)
  }

  try {
    const data = await reader.singletons.homePage.read()
    console.log('Home Page Settings:', data)
    const blogSlugs = await reader.collections.posts.list()
    console.log('Blog Slugs found:', blogSlugs)
    const portfolioSlugs = await reader.collections.portfolioProjects.list()
    console.log('Portfolio Slugs found:', portfolioSlugs)
  } catch (e) {
    console.error('Error reading from reader:', e)
  }
}

test()

import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

import path from 'path'
import fs from 'fs'

// Determine the correct base directory for content files.
// On Vercel: CWD is /var/task/frontend, content is at /var/task/frontend/content
// Locally:  CWD is the frontend folder, content is at ./content
const cwd = process.cwd()
const contentBaseDir = fs.existsSync(path.join(cwd, 'content'))
  ? cwd
  : fs.existsSync(path.join(cwd, 'frontend', 'content'))
    ? path.join(cwd, 'frontend')
    : cwd

export const reader = createReader(contentBaseDir, keystaticConfig)

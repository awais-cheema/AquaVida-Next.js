import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

import path from 'path'
import fs from 'fs'

// Determine if we are running in the frontend directory or the repo root
const repoRoot = process.cwd()
const isInsideFrontend = fs.existsSync(path.join(repoRoot, 'keystatic.config.ts'))
const contentBaseDir = isInsideFrontend ? repoRoot : path.join(repoRoot, 'frontend')

export const reader = createReader(contentBaseDir, keystaticConfig)

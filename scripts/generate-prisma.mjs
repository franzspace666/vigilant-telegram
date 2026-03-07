#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const child = spawn('npx', ['prisma', 'generate'], {
  cwd: dirname(__dirname),
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code);
});

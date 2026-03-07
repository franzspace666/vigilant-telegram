#!/usr/bin/env python3
import subprocess
import os
import sys

# Change to project root
os.chdir('/vercel/share/v0-project')

print("[v0] Running: npx prisma generate")
result = subprocess.run(['npx', 'prisma', 'generate'], cwd='/vercel/share/v0-project')
sys.exit(result.returncode)

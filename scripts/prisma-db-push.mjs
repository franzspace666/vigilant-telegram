import { execSync } from 'child_process';

try {
  console.log('Running prisma db push to create tables...');
  execSync('npx prisma db push', { 
    stdio: 'inherit',
    cwd: '/vercel/share/v0-project'
  });
  console.log('Database schema pushed successfully!');
} catch (error) {
  console.error('Failed to push database schema:', error.message);
  process.exit(1);
}

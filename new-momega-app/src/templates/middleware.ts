import { AppConfig } from '../types';

export function generateMiddleware(config: AppConfig): string {
  if (!config.features.clerk) {
    return '';
  }

  return `import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/api/webhooks(.*)',
    '/api/og(.*)',
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};`;
}

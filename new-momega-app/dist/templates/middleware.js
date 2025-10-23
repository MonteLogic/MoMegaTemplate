"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMiddleware = generateMiddleware;
function generateMiddleware(config) {
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
//# sourceMappingURL=middleware.js.map
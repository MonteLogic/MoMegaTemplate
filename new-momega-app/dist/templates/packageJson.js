"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePackageJson = generatePackageJson;
function generatePackageJson(config) {
    const dependencies = {
        'next': '^14.0.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'typescript': '^5.3.0',
        '@types/node': '^20.10.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
    };
    const devDependencies = {
        'eslint': '^8.55.0',
        'eslint-config-next': '^14.0.0',
        'prettier': '^3.1.0',
        'prettier-plugin-tailwindcss': '^0.5.0',
        'tailwindcss': '^3.3.0',
        'autoprefixer': '^10.4.0',
        'postcss': '^8.4.0',
    };
    // Add Clerk dependencies
    if (config.features.clerk) {
        dependencies['@clerk/nextjs'] = '^4.29.0';
        dependencies['@clerk/clerk-js'] = '^5.6.0';
    }
    // Add database dependencies
    if (config.features.database) {
        dependencies['drizzle-orm'] = '^0.33.0';
        dependencies['drizzle-kit'] = '^0.23.0';
        dependencies['better-sqlite3'] = '^11.6.0';
        dependencies['@types/better-sqlite3'] = '^7.6.0';
        devDependencies['drizzle-kit'] = '^0.23.0';
    }
    // Add PWA dependencies
    if (config.features.pwa) {
        dependencies['next-pwa'] = '^5.6.0';
    }
    // Add Stripe dependencies
    if (config.features.stripe) {
        dependencies['stripe'] = '^17.5.0';
        dependencies['@stripe/stripe-js'] = '^5.3.0';
    }
    // Add blog dependencies
    if (config.features.blog) {
        dependencies['gray-matter'] = '^4.0.0';
        dependencies['remark'] = '^15.0.0';
        dependencies['remark-html'] = '^15.0.0';
        dependencies['remark-frontmatter'] = '^5.0.0';
        dependencies['remark-gfm'] = '^4.0.0';
    }
    // Add testing dependencies
    if (config.features.testing) {
        devDependencies['vitest'] = '^1.0.0';
        devDependencies['@vitejs/plugin-react'] = '^4.2.0';
        devDependencies['jsdom'] = '^24.0.0';
        devDependencies['@playwright/test'] = '^1.44.0';
    }
    // Add shadcn/ui dependencies
    if (config.styling.shadcn) {
        dependencies['class-variance-authority'] = '^0.7.0';
        dependencies['clsx'] = '^2.1.0';
        dependencies['tailwind-merge'] = '^2.2.0';
        dependencies['lucide-react'] = '^0.344.0';
    }
    const scripts = {
        'dev': 'next dev',
        'build': 'next build',
        'start': 'next start',
        'lint': 'next lint',
        'prettier': 'prettier --write .',
        'prettier:check': 'prettier --check .',
    };
    if (config.features.database) {
        scripts['db:generate'] = 'drizzle-kit generate';
        scripts['db:migrate'] = 'drizzle-kit migrate';
        scripts['db:studio'] = 'drizzle-kit studio';
    }
    if (config.features.testing) {
        scripts['test'] = 'vitest';
        scripts['test:ui'] = 'vitest --ui';
        scripts['test:e2e'] = 'playwright test';
    }
    return {
        name: config.projectName,
        version: '0.1.0',
        private: true,
        scripts,
        dependencies,
        devDependencies,
        packageManager: 'pnpm@9.x',
    };
}
//# sourceMappingURL=packageJson.js.map
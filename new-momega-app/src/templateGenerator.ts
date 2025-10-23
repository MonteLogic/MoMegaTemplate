import fs from 'fs-extra';
import path from 'path';
import { AppConfig } from './types';
import { generatePackageJson } from './templates/packageJson';
import { generateNextConfig } from './templates/nextConfig';
import { generateTailwindConfig } from './templates/tailwindConfig';
import { generateAppLayout } from './templates/appLayout';
import { generateMiddleware } from './templates/middleware';
import { generateEnvironmentFiles } from './templates/environment';
import { generateDatabaseFiles } from './templates/database';
import { generatePWAFiles } from './templates/pwa';
import { generateBlogFiles } from './templates/blog';
import { generateStripeFiles } from './templates/stripe';
import { generateTestingFiles } from './templates/testing';
import { generateAuthPages } from './templates/authPages';

export async function generateTemplate(config: AppConfig) {
  const { projectPath } = config;

  // Create project directory
  await fs.ensureDir(projectPath);

  // Generate package.json
  const packageJson = generatePackageJson(config);
  await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

  // Generate Next.js config
  const nextConfig = generateNextConfig(config);
  await fs.writeFile(path.join(projectPath, 'next.config.js'), nextConfig);

  // Generate TypeScript config
  const tsConfig = {
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'es6'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [
        {
          name: 'next',
        },
      ],
      baseUrl: '.',
      paths: {
        '@/*': ['./*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  };
  await fs.writeJson(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // Generate Tailwind config
  if (config.styling.tailwind) {
    const tailwindConfig = generateTailwindConfig(config);
    await fs.writeFile(path.join(projectPath, 'tailwind.config.ts'), tailwindConfig);
  }

  // Generate PostCSS config
  if (config.styling.tailwind) {
    const postcssConfig = {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    };
    await fs.writeJson(path.join(projectPath, 'postcss.config.js'), postcssConfig, { spaces: 2 });
  }

  // Generate app directory structure
  await fs.ensureDir(path.join(projectPath, 'app'));
  await fs.ensureDir(path.join(projectPath, 'app', 'api'));
  await fs.ensureDir(path.join(projectPath, 'app', 'api', 'webhooks'));
  await fs.ensureDir(path.join(projectPath, 'app', 'api', 'clerk'));
  await fs.ensureDir(path.join(projectPath, 'app', 'sign-in'));
  await fs.ensureDir(path.join(projectPath, 'app', 'sign-up'));
  await fs.ensureDir(path.join(projectPath, 'app', 'dashboard'));
  await fs.ensureDir(path.join(projectPath, 'app', 'settings'));
  await fs.ensureDir(path.join(projectPath, 'components'));
  await fs.ensureDir(path.join(projectPath, 'lib'));
  await fs.ensureDir(path.join(projectPath, 'public'));
  await fs.ensureDir(path.join(projectPath, 'styles'));

  // Generate app layout
  const appLayout = generateAppLayout(config);
  await fs.writeFile(path.join(projectPath, 'app', 'layout.tsx'), appLayout);

  // Generate root page
  const rootPage = generateRootPage(config);
  await fs.writeFile(path.join(projectPath, 'app', 'page.tsx'), rootPage);

  // Generate middleware
  if (config.features.clerk) {
    const middleware = generateMiddleware(config);
    await fs.writeFile(path.join(projectPath, 'middleware.ts'), middleware);
  }

  // Generate environment files
  const envFiles = generateEnvironmentFiles(config);
  for (const [filename, content] of Object.entries(envFiles)) {
    await fs.writeFile(path.join(projectPath, filename), content);
  }

  // Generate global styles
  const globalStyles = generateGlobalStyles(config);
  await fs.writeFile(path.join(projectPath, 'styles', 'globals.css'), globalStyles);

  // Generate database files
  if (config.features.database) {
    await generateDatabaseFiles(config);
  }

  // Generate PWA files
  if (config.features.pwa) {
    await generatePWAFiles(config);
  }

  // Generate blog files
  if (config.features.blog) {
    await generateBlogFiles(config);
  }

  // Generate Stripe files
  if (config.features.stripe) {
    await generateStripeFiles(config);
  }

  // Generate testing files
  if (config.features.testing) {
    await generateTestingFiles(config);
  }

  // Generate auth pages
  if (config.features.clerk) {
    await generateAuthPages(config);
  }

  // Generate README
  const readme = generateReadme(config);
  await fs.writeFile(path.join(projectPath, 'README.md'), readme);

  // Generate .gitignore
  const gitignore = generateGitignore(config);
  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
}

function generateRootPage(config: AppConfig): string {
  return `import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to ${config.projectName}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your opinionated Next.js app is ready to go.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Features Included:
            </h2>
            <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
              ${config.features.clerk ? '<li>✅ Clerk Authentication</li>' : ''}
              ${config.features.database ? '<li>✅ Database (Drizzle + SQLite)</li>' : ''}
              ${config.features.pwa ? '<li>✅ PWA Support</li>' : ''}
              ${config.features.stripe ? '<li>✅ Stripe Payments</li>' : ''}
              ${config.features.blog ? '<li>✅ Blog System</li>' : ''}
              ${config.features.testing ? '<li>✅ Testing Setup</li>' : ''}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}`;
}

function generateGlobalStyles(config: AppConfig): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
}

function generateReadme(config: AppConfig): string {
  return `# ${config.projectName}

A modern, opinionated Next.js application built with the MonteLogic template.

## 🚀 Features

${config.features.clerk ? '- **Clerk Authentication**: Complete authentication system with user management\n' : ''}${config.features.database ? '- **Database**: Drizzle ORM with SQLite for type-safe database operations\n' : ''}${config.features.pwa ? '- **PWA Support**: Progressive Web App capabilities with service worker\n' : ''}${config.features.stripe ? '- **Stripe Payments**: Complete payment processing setup\n' : ''}${config.features.blog ? '- **Blog System**: Markdown-based blog with frontmatter support\n' : ''}${config.features.testing ? '- **Testing**: Vitest and Playwright testing setup\n' : ''}

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS${config.styling.shadcn ? ' + shadcn/ui' : ''}
- **Authentication**: Clerk${config.features.database ? '\n- **Database**: Drizzle ORM + SQLite' : ''}
- **Deployment**: ${config.deployment.platform === 'vercel' ? 'Vercel' : config.deployment.platform}

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0+ 
- pnpm (recommended) or npm

### Installation

1. **Install dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

2. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   ${config.features.clerk ? 'Configure your Clerk environment variables:\n   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`\n   - `CLERK_SECRET_KEY`\n' : ''}${config.features.stripe ? '   - `STRIPE_SECRET_KEY`\n   - `STRIPE_WEBHOOK_SECRET`\n' : ''}

3. **Start the development server**
   \`\`\`bash
   pnpm dev
   \`\`\`

Visit \`http://localhost:3000\` to see your application!

## 📦 Available Scripts

- \`pnpm dev\` - Start development server
- \`pnpm build\` - Build for production
- \`pnpm start\` - Start production server
- \`pnpm lint\` - Run ESLint
- \`pnpm prettier\` - Format code with Prettier${config.features.testing ? '\n- \`pnpm test\` - Run unit tests\n- \`pnpm test:e2e\` - Run E2E tests' : ''}${config.features.database ? '\n- \`pnpm db:migrate\` - Run database migrations' : ''}

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
`;
}

function generateGitignore(config: AppConfig): string {
  return `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# database
*.db
*.db-journal

# pwa
/sw.js
/workbox-*.js
`;
}

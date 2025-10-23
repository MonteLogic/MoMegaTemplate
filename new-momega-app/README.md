# new-momega

Interactive CLI to start a full-stack, opinionated Next.js app with Clerk auth and optional database.

## 🚀 Features

### 🎯 **Opinionated by Default**
- **Clerk Authentication**: Complete authentication system with user management (default)
- **No Database by Default**: Uses Clerk for user data, optional Drizzle + SQLite when needed
- **Modern UI**: Tailwind CSS + shadcn/ui components
- **TypeScript**: Full type safety throughout
- **Testing Ready**: Vitest and Playwright setup

### 🔧 **Optional Features**
- **Database**: Drizzle ORM with SQLite when you need local data
- **PWA Support**: Progressive Web App capabilities
- **Stripe Payments**: Complete payment processing setup
- **Blog System**: Markdown-based blog with frontmatter support
- **Testing**: Comprehensive testing setup

## 🚀 Quick Start

### Installation

```bash
# Using npm
npx new-momega@latest

# Using pnpm
pnpm create new-momega@latest

# Using yarn
yarn create new-momega@latest

# Using bun
bun create new-momega@latest
```

### Usage

```bash
# Interactive setup
npx new-momega@latest my-app

# Skip prompts with defaults
npx new-momega@latest my-app --yes

# Skip package installation
npx new-momega@latest my-app --no-install

# Skip git initialization
npx new-momega@latest my-app --no-git
```

## 🎯 **Opinionated Philosophy**

This CLI is built with strong opinions about modern web development:

### 1. **Authentication First**
- Clerk is the default authentication solution
- No database needed for user management
- Built-in user profiles and organization support

### 2. **Database Optional**
- Start without a database for simple apps
- Add Drizzle + SQLite only when you need local data
- Clerk handles user data, your database handles app data

### 3. **Modern Stack**
- Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for components

### 4. **Developer Experience**
- Comprehensive testing setup
- ESLint and Prettier configured
- Git initialized by default
- Clear project structure

## 📁 **Generated Project Structure**

```
my-app/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard
│   ├── sign-in/           # Authentication pages
│   ├── sign-up/
│   └── settings/          # User settings
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── db/                    # Database schema (if enabled)
├── content/               # Blog posts (if enabled)
├── public/                # Static assets
└── styles/                # Global styles
```

## 🛠️ **Tech Stack**

### Core (Always Included)
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk (default)
- **Components**: shadcn/ui (optional)

### Optional Features
- **Database**: Drizzle ORM + SQLite
- **PWA**: Service worker + manifest
- **Payments**: Stripe integration
- **Blog**: Markdown-based content
- **Testing**: Vitest + Playwright

## 🚀 **Getting Started**

After creating your project:

1. **Install dependencies**
   ```bash
   cd my-app
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your Clerk keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Visit your app**
   ```
   http://localhost:3000
   ```

## 📦 **Available Scripts**

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prettier` - Format code with Prettier
- `pnpm test` - Run unit tests (if enabled)
- `pnpm test:e2e` - Run E2E tests (if enabled)
- `pnpm db:migrate` - Run database migrations (if enabled)

## 🎨 **Customization**

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update `styles/globals.css` for global styles
- Customize components in the `components/` directory

### Authentication
- Configure Clerk in your dashboard
- Customize auth pages in `app/sign-in/` and `app/sign-up/`
- Add protected routes with Clerk middleware

### Database
- Modify `db/schema.ts` for data structure changes
- Run migrations with `pnpm db:migrate`
- Add new API routes in `app/api/`

## 🚀 **Deployment**

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
- Configure your preferred hosting platform
- Set up environment variables
- Run `pnpm build` and serve the output

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details

## 🙏 **Acknowledgments**

- Inspired by [create-t3-app](https://github.com/t3-oss/create-t3-app)
- Built with the MoMegaTemplate philosophy
- Powered by the modern web development stack

import { AppConfig } from '../types';

export function generateEnvironmentFiles(config: AppConfig): Record<string, string> {
  const files: Record<string, string> = {};

  // Generate .env.example
  let envExample = `# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

`;

  if (config.features.clerk) {
    envExample += `# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

`;
  }

  if (config.features.database) {
    envExample += `# Database
DATABASE_URL=file:./dev.db

`;
  }

  if (config.features.stripe) {
    envExample += `# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

`;
  }

  files['.env.example'] = envExample;

  // Generate .env.local (empty for user to fill)
  files['.env.local'] = '# Copy from .env.example and fill in your values';

  return files;
}

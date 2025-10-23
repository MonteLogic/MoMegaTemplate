import fs from 'fs-extra';
import path from 'path';
import { AppConfig } from '../types';

export async function generateTestingFiles(config: AppConfig) {
  if (!config.features.testing) return;

  const { projectPath } = config;

  // Generate Vitest config
  const vitestConfig = `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
});`;

  await fs.writeFile(path.join(projectPath, 'vitest.config.ts'), vitestConfig);

  // Generate test setup
  await fs.ensureDir(path.join(projectPath, 'test'));
  const testSetupContent = `import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));`;

  await fs.writeFile(path.join(projectPath, 'test', 'setup.ts'), testSetupContent);

  // Generate Playwright config
  const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});`;

  await fs.writeFile(path.join(projectPath, 'playwright.config.ts'), playwrightConfig);

  // Generate example test files
  await fs.ensureDir(path.join(projectPath, 'tests', 'e2e'));
  
  const e2eTestContent = `import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveTitle(/.*${config.projectName}.*/);
  
  // Check if the main heading is visible
  await expect(page.locator('h1')).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  
  // Test navigation to different pages
  if (await page.locator('a[href="/blog"]').isVisible()) {
    await page.click('a[href="/blog"]');
    await expect(page).toHaveURL(/.*blog.*/);
  }
});`;

  await fs.writeFile(path.join(projectPath, 'tests', 'e2e', 'homepage.spec.ts'), e2eTestContent);

  // Generate unit test example
  await fs.ensureDir(path.join(projectPath, 'components', '__tests__'));
  
  const unitTestContent = `import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Example component test
describe('Example Component', () => {
  it('renders correctly', () => {
    // This is a placeholder test
    // Replace with your actual component tests
    expect(true).toBe(true);
  });
});`;

  await fs.writeFile(path.join(projectPath, 'components', '__tests__', 'example.test.tsx'), unitTestContent);

  // Generate test utilities
  const testUtilsContent = `import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };`;

  await fs.writeFile(path.join(projectPath, 'test', 'utils.tsx'), testUtilsContent);
}

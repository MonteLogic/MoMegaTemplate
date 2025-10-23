import fs from 'fs-extra';
import path from 'path';
import { AppConfig } from '../types';

export async function generateAuthPages(config: AppConfig) {
  if (!config.features.clerk) return;

  const { projectPath } = config;

  // Generate sign-in page
  const signInPageContent = `import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <SignIn />
      </div>
    </div>
  );
}`;

  await fs.writeFile(path.join(projectPath, 'app', 'sign-in', 'page.tsx'), signInPageContent);

  // Generate sign-up page
  const signUpPageContent = `import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>
        <SignUp />
      </div>
    </div>
  );
}`;

  await fs.writeFile(path.join(projectPath, 'app', 'sign-up', 'page.tsx'), signUpPageContent);

  // Generate dashboard page
  const dashboardPageContent = `import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
            <p className="text-gray-600 dark:text-gray-300">
              You're successfully signed in to your account.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create New Project
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                View Settings
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-600 dark:text-gray-300">
              No recent activity to show.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}`;

  await fs.writeFile(path.join(projectPath, 'app', 'dashboard', 'page.tsx'), dashboardPageContent);

  // Generate settings page
  const settingsPageContent = `import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Settings
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Manage your account settings and preferences.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your display name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
              />
            </div>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;

  await fs.writeFile(path.join(projectPath, 'app', 'settings', 'page.tsx'), settingsPageContent);
}

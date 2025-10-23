import inquirer from 'inquirer';
import chalk from 'chalk';
import { AppConfig } from './types';

export async function getProjectName(): Promise<string> {
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project named?',
      default: 'my-momega-app',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Project name is required';
        }
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return 'Project name can only contain letters, numbers, hyphens, and underscores';
        }
        return true;
      },
    },
  ]);
  return projectName;
}

export async function getAppConfig(skipPrompts: boolean = false): Promise<AppConfig> {
  if (skipPrompts) {
    return {
      projectName: 'my-momega-app',
      projectPath: './my-momega-app',
      features: {
        clerk: true,
        database: false,
        pwa: false,
        stripe: false,
        blog: false,
        testing: true,
      },
      styling: {
        tailwind: true,
        shadcn: true,
      },
      database: {
        type: null,
        orm: null,
      },
      deployment: {
        platform: 'vercel',
      },
    };
  }

  console.log(chalk.blue('\n🚀 Let\'s create your MoMegaTemplate Next.js app!\n'));

  const { features } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'features',
      message: 'Which features would you like to include?',
      choices: [
        {
          name: '🔐 Clerk Authentication (Recommended)',
          value: 'clerk',
          checked: true,
        },
        {
          name: '🗄️ Database (Drizzle + SQLite)',
          value: 'database',
        },
        {
          name: '📱 PWA Support',
          value: 'pwa',
        },
        {
          name: '💳 Stripe Payments',
          value: 'stripe',
        },
        {
          name: '📝 Blog System',
          value: 'blog',
        },
        {
          name: '🧪 Testing Setup',
          value: 'testing',
          checked: true,
        },
      ],
    },
  ]);

  const { styling } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'styling',
      message: 'Which styling options would you like?',
      choices: [
        {
          name: '🎨 Tailwind CSS (Recommended)',
          value: 'tailwind',
          checked: true,
        },
        {
          name: '🧩 shadcn/ui Components',
          value: 'shadcn',
          checked: true,
        },
      ],
    },
  ]);

  let databaseConfig = { type: null as any, orm: null as any };
  
  if (features.includes('database')) {
    const { databaseType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'databaseType',
        message: 'Which database would you like to use?',
        choices: [
          { name: 'SQLite (Recommended for development)', value: 'sqlite' },
          { name: 'PostgreSQL', value: 'postgresql' },
          { name: 'MySQL', value: 'mysql' },
        ],
        default: 'sqlite',
      },
    ]);

    databaseConfig = {
      type: databaseType,
      orm: 'drizzle',
    };
  }

  const { deployment } = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Which deployment platform are you targeting?',
      choices: [
        { name: 'Vercel (Recommended)', value: 'vercel' },
        { name: 'Netlify', value: 'netlify' },
        { name: 'Other', value: 'other' },
      ],
      default: 'vercel',
    },
  ]);

  return {
    projectName: 'my-momega-app', // Will be set by getProjectName
    projectPath: './my-momega-app', // Will be set by getProjectName
    features: {
      clerk: features.includes('clerk'),
      database: features.includes('database'),
      pwa: features.includes('pwa'),
      stripe: features.includes('stripe'),
      blog: features.includes('blog'),
      testing: features.includes('testing'),
    },
    styling: {
      tailwind: styling.includes('tailwind'),
      shadcn: styling.includes('shadcn'),
    },
    database: databaseConfig,
    deployment,
  };
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectName = getProjectName;
exports.getAppConfig = getAppConfig;
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
async function getProjectName() {
    const { projectName } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'What is your project named?',
            default: 'my-momega-app',
            validate: (input) => {
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
async function getAppConfig(skipPrompts = false) {
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
    console.log(chalk_1.default.blue('\n🚀 Let\'s create your MoMegaTemplate Next.js app!\n'));
    const { features } = await inquirer_1.default.prompt([
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
    const { styling } = await inquirer_1.default.prompt([
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
    let databaseConfig = { type: null, orm: null };
    if (features.includes('database')) {
        const { databaseType } = await inquirer_1.default.prompt([
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
    const { deployment } = await inquirer_1.default.prompt([
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
//# sourceMappingURL=prompts.js.map
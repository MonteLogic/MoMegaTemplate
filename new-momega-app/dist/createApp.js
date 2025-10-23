"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const execa_1 = require("execa");
const prompts_1 = require("./prompts");
const templateGenerator_1 = require("./templateGenerator");
async function createApp(options) {
    const spinner = (0, ora_1.default)('Initializing project...').start();
    try {
        // Get project name
        const projectName = options.projectName || await (0, prompts_1.getProjectName)();
        const projectPath = path_1.default.resolve(process.cwd(), projectName);
        // Check if directory already exists
        if (await fs_extra_1.default.pathExists(projectPath)) {
            spinner.fail(`Directory ${projectName} already exists`);
            process.exit(1);
        }
        // Get app configuration
        const config = await (0, prompts_1.getAppConfig)(options.skipPrompts);
        config.projectName = projectName;
        config.projectPath = projectPath;
        spinner.succeed('Project configuration complete');
        // Generate template
        spinner.start('Generating template files...');
        await (0, templateGenerator_1.generateTemplate)(config);
        spinner.succeed('Template files generated');
        // Install dependencies
        if (!options.skipInstall) {
            spinner.start('Installing dependencies...');
            await (0, execa_1.execa)('pnpm', ['install'], { cwd: projectPath });
            spinner.succeed('Dependencies installed');
        }
        // Initialize git
        if (!options.skipGit) {
            spinner.start('Initializing git repository...');
            await (0, execa_1.execa)('git', ['init'], { cwd: projectPath });
            await (0, execa_1.execa)('git', ['add', '.'], { cwd: projectPath });
            await (0, execa_1.execa)('git', ['commit', '-m', 'Initial commit'], { cwd: projectPath });
            spinner.succeed('Git repository initialized');
        }
        // Success message
        console.log(chalk_1.default.green('\n✅ Project created successfully!\n'));
        console.log(chalk_1.default.blue('Next steps:'));
        console.log(chalk_1.default.gray(`  cd ${projectName}`));
        if (config.features.clerk) {
            console.log(chalk_1.default.gray('  # Set up your Clerk environment variables in .env.local'));
        }
        if (config.features.database) {
            console.log(chalk_1.default.gray('  # Run database migrations: pnpm db:migrate'));
        }
        console.log(chalk_1.default.gray('  pnpm dev'));
    }
    catch (error) {
        spinner.fail('Failed to create project');
        console.error(chalk_1.default.red('Error:'), error);
        process.exit(1);
    }
}
//# sourceMappingURL=createApp.js.map
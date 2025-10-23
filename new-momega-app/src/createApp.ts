import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import { getProjectName, getAppConfig } from './prompts';
import { generateTemplate } from './templateGenerator';
import { CreateAppOptions } from './types';

export async function createApp(options: CreateAppOptions) {
  const spinner = ora('Initializing project...').start();

  try {
    // Get project name
    const projectName = options.projectName || await getProjectName();
    const projectPath = path.resolve(process.cwd(), projectName);

    // Check if directory already exists
    if (await fs.pathExists(projectPath)) {
      spinner.fail(`Directory ${projectName} already exists`);
      process.exit(1);
    }

    // Get app configuration
    const config = await getAppConfig(options.skipPrompts);
    config.projectName = projectName;
    config.projectPath = projectPath;

    spinner.succeed('Project configuration complete');

    // Generate template
    spinner.start('Generating template files...');
    await generateTemplate(config);
    spinner.succeed('Template files generated');

    // Install dependencies
    if (!options.skipInstall) {
      spinner.start('Installing dependencies...');
      await execa('pnpm', ['install'], { cwd: projectPath });
      spinner.succeed('Dependencies installed');
    }

    // Initialize git
    if (!options.skipGit) {
      spinner.start('Initializing git repository...');
      await execa('git', ['init'], { cwd: projectPath });
      await execa('git', ['add', '.'], { cwd: projectPath });
      await execa('git', ['commit', '-m', 'Initial commit'], { cwd: projectPath });
      spinner.succeed('Git repository initialized');
    }

    // Success message
    console.log(chalk.green('\n✅ Project created successfully!\n'));
    console.log(chalk.blue('Next steps:'));
    console.log(chalk.gray(`  cd ${projectName}`));
    
    if (config.features.clerk) {
      console.log(chalk.gray('  # Set up your Clerk environment variables in .env.local'));
    }
    
    if (config.features.database) {
      console.log(chalk.gray('  # Run database migrations: pnpm db:migrate'));
    }
    
    console.log(chalk.gray('  pnpm dev'));

  } catch (error) {
    spinner.fail('Failed to create project');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

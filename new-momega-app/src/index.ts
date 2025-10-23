#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createApp } from './createApp';
import { version } from '../package.json';

const program = new Command();

program
  .name('new-momega')
  .description('Interactive CLI to start a full-stack, opinionated Next.js app')
  .version(version)
  .argument('[project-name]', 'Name of the project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--no-install', 'Skip package installation')
  .option('--no-git', 'Skip git initialization')
  .action(async (projectName, options) => {
    try {
      await createApp({
        projectName,
        skipPrompts: options.yes,
        skipInstall: options.install === false,
        skipGit: options.git === false,
      });
    } catch (error) {
      console.error(chalk.red('Error creating app:'), error);
      process.exit(1);
    }
  });

program.parse();

#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const createApp_1 = require("./createApp");
const package_json_1 = require("../package.json");
const program = new commander_1.Command();
program
    .name('new-momega')
    .description('Interactive CLI to start a full-stack, opinionated Next.js app')
    .version(package_json_1.version)
    .argument('[project-name]', 'Name of the project')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .option('--no-install', 'Skip package installation')
    .option('--no-git', 'Skip git initialization')
    .action(async (projectName, options) => {
    try {
        await (0, createApp_1.createApp)({
            projectName,
            skipPrompts: options.yes,
            skipInstall: options.install === false,
            skipGit: options.git === false,
        });
    }
    catch (error) {
        console.error(chalk_1.default.red('Error creating app:'), error);
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=index.js.map
#!/usr/bin/env node

const prompts = require('prompts');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log(chalk.blue.bold('🚀 Full-Stack AI Boilerplate Setup\n'));

function createEnvFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
    console.log(chalk.green(`✅ Created ${path.relative(process.cwd(), filePath)}`));
  } catch (error) {
    console.error(chalk.red(`❌ Failed to create ${filePath}:`), error.message);
  }
}

function runCommand(command, description) {
  try {
    console.log(chalk.yellow(`📦 ${description}...`));
    execSync(command, { stdio: 'inherit' });
    console.log(chalk.green(`✅ ${description} completed`));
  } catch (error) {
    console.error(chalk.red(`❌ ${description} failed:`), error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log(chalk.gray('This setup will configure your development environment with AI-powered features.\n'));

    // Project configuration prompts
    const config = await prompts([
      {
        type: 'text',
        name: 'projectName',
        message: 'What\'s your project name?',
        initial: 'my-fullstack-app'
      },
      {
        type: 'password',
        name: 'openaiKey',
        message: 'Enter your OpenAI API key (optional, for AI features):',
        validate: value => !value || value.startsWith('sk-') || 'OpenAI API keys start with "sk-"'
      },
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies now?',
        initial: true
      }
    ]);

    // Handle cancellation
    if (!config.projectName) {
      console.log(chalk.yellow('\n👋 Setup cancelled'));
      process.exit(0);
    }

    console.log(chalk.blue('\n📝 Creating environment files...\n'));

    // Create backend .env
    const backendEnvContent = `# Backend Configuration
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@db:5432/${config.projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}
NODE_ENV=development

# OpenAI API Configuration
OPENAI_API_KEY=${config.openaiKey || 'your_openai_api_key_here'}

# Project Configuration
PROJECT_NAME=${config.projectName}`;

    createEnvFile(path.join(__dirname, '../backend/.env'), backendEnvContent);

    // Create frontend .env.local
    const frontendEnvContent = `# Frontend Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_PROJECT_NAME=${config.projectName}`;

    createEnvFile(path.join(__dirname, '../frontend/.env.local'), frontendEnvContent);

    // Install dependencies if requested
    if (config.installDeps) {
      console.log(chalk.blue('\n📦 Installing dependencies...\n'));

      runCommand('npm install', 'Installing root dependencies');
      runCommand('cd frontend && npm install', 'Installing frontend dependencies');
      runCommand('cd backend && npm install', 'Installing backend dependencies');
      runCommand('cd db && npm install', 'Installing database dependencies');
    }

    // Success message
    console.log(chalk.green.bold('\n🎉 Setup complete!\n'));

    console.log(chalk.blue('📋 Next steps:'));
    if (!config.openaiKey) {
      console.log(chalk.yellow('   1. Add your OpenAI API key to backend/.env for AI features'));
      console.log(chalk.cyan('   2. Run: npm run start'));
    } else {
      console.log(chalk.cyan('   1. Run: npm run start'));
    }
    console.log(chalk.cyan('   2. Visit: http://localhost:3000\n'));

    console.log(chalk.blue('🔧 Available commands:'));
    console.log('   ' + chalk.cyan('npm run start') + '    - Start the full application');
    console.log('   ' + chalk.cyan('npm run stop') + '     - Stop Docker services');
    console.log('   ' + chalk.cyan('npm run clean') + '    - Reset everything');
    console.log('   ' + chalk.cyan('npm run reset') + '    - Full reset and re-init\n');

    if (config.openaiKey) {
      console.log(chalk.green('✨ AI thumbnail generation is ready!'));
    } else {
      console.log(chalk.yellow('⚠️  For AI features, add your OpenAI API key'));
      console.log(chalk.gray('   Get one at: https://platform.openai.com/api-keys'));
    }

    console.log(chalk.magenta('\n🚀 Happy coding!\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Setup failed:'), error.message);

    console.log(chalk.blue('\n🛠️  Manual setup:'));
    console.log('   1. Copy backend/.env.example to backend/.env');
    console.log('   2. Copy frontend/.env.local.example to frontend/.env.local');
    console.log('   3. Add your configuration to the .env files');
    console.log('   4. Run: npm run install:all');

    process.exit(1);
  }
}

// Handle CTRL+C gracefully
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Setup cancelled'));
  process.exit(0);
});

main();
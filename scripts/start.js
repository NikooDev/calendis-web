#!/usr/bin/env node
import inquirer from 'inquirer';
import { execSync, exec } from 'child_process';

const run = async () => {
	const { environments } = await inquirer.prompt([
		{
			type: 'list',
			name: 'environments',
			message: 'Choisir l\'environnement :',
			choices: [
				{ name: 'development', value: 'development' },
				{ name: 'testing', value: 'testing' },
				{ name: 'production', value: 'production' }
			],
			default: 'development'
		},
	]);

	const ENVIRONMENT = environments[0];
	console.log(`✔ Compilation en cours...`);
	console.log('');

	process.env.NODE_ENV = 'production';
	process.env.NEXT_PUBLIC_ENVIRONMENT = ENVIRONMENT;

	// noinspection JSCheckFunctionSignatures
	execSync('npx next start', { stdio: 'inherit', env: process.env });
};

run().catch((err) => {
	console.error('❌ Erreur :', err);
	process.exit(1);
});
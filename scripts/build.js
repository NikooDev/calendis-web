#!/usr/bin/env node
import { execSync } from 'child_process';
import inquirer from 'inquirer';

const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

// Build Vercel
if (process.env.VERCEL_ENV) {
	execSync('next build', { stdio: 'inherit' });
	process.exit(0);
}

// Build local
const run = async () => {
	const { environment } = await inquirer.prompt([
		{
			type: 'list',
			name: 'environment',
			message: 'Choisir l\'environnement :',
			choices: [
				{ name: 'development', value: 'development' },
				{ name: 'testing', value: 'testing' }
			],
			default: 'development'
		},
	]);

	console.log('');
	console.log(`🚀 Build en cours pour l’environnement ${YELLOW}${environment}${RESET}...`);
	console.log('');

	process.env.NODE_ENV = 'production';
	process.env.NEXT_PUBLIC_ENVIRONMENT = environment;

	try {
		execSync('npx next build', { stdio: 'inherit', env: process.env });
		console.log('');
		console.log(`${GREEN}✅ Build terminé avec succès pour ${environment}!${RESET}`);
	} catch {
		console.log('');
		console.error('❌ Échec du build.');
		process.exit(1);
	}
};

run().catch((err) => {
	console.error('❌ Erreur :', err);
	process.exit(1);
});

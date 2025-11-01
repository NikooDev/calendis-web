const env = process.env.NEXT_PUBLIC_ENVIRONMENT;
const vercelEnv = process.env.VERCEL_ENV;

console.log('🔍 Vérification des environnements :');
console.log(`➡️ NEXT_PUBLIC_ENVIRONMENT = ${env}`);
console.log(`➡️ VERCEL_ENV = ${vercelEnv}`);
console.log('-----------------------------------');

const validEnv = {
	production: 'production',
	testing: 'preview',
	development: 'development'
};

const expectedVercelEnv = validEnv[env];

if (!expectedVercelEnv) {
	console.error(`🚨 Erreur : NEXT_PUBLIC_ENVIRONMENT="${env}" n’est pas reconnu (production, testing, development attendus).`);
	process.exit(1);
}

if (vercelEnv !== expectedVercelEnv) {
	console.error(
		`🚨 Incohérence détectée :\n` +
		`NEXT_PUBLIC_ENVIRONMENT=${env} → attendait VERCEL_ENV=${expectedVercelEnv}, mais a reçu ${vercelEnv}.`
	);
	process.exit(1);
}
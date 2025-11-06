import fs from 'fs';
import path from 'path';

const typesDir = path.resolve('functions/src/types');

export const convertDates = (dir) => {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stats = fs.statSync(fullPath);

		if (stats.isDirectory()) {
			convertDates(fullPath);
			continue;
		}

		if (!file.endsWith('.ts')) continue;

		let content = fs.readFileSync(fullPath, 'utf8');

		if (!/\bDate\b/.test(content)) continue;

		if (!content.includes('firebase-admin/firestore')) {
			content = `import type { Timestamp } from 'firebase-admin/firestore';\n` + content;
		}

		content = content.replace(/\bDate\b/g, 'Timestamp');

		fs.writeFileSync(fullPath, content, 'utf8');
		console.log(`✅ Converted: ${path.relative(process.cwd(), fullPath)}`);
	}
}

convertDates(typesDir);
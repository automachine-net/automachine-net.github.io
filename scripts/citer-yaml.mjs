// Petit utilitaire de maintenance : met entre guillemets simples les valeurs de frontmatter
// qui contiennent un deux-points, lequel casse l'analyse YAML.
// Usage : node scripts/citer-yaml.mjs
import fs from 'node:fs';

const dossiers = ['content/pages', 'content/machines'];
const champs = /^(description|titre|nom|secteur|resume):[ ]+(?!['"|>])(.+)$/gm;

for (const dossier of dossiers) {
	for (const nom of fs.readdirSync(dossier)) {
		const chemin = `${dossier}/${nom}`;
		const avant = fs.readFileSync(chemin, 'utf8');
		const apres = avant.replace(champs, (_m, cle, valeur) => {
			if (!valeur.includes(':')) return `${cle}: ${valeur}`;
			return `${cle}: '${valeur.replaceAll("'", "''")}'`;
		});
		if (apres !== avant) {
			fs.writeFileSync(chemin, apres);
			console.log('corrigé', chemin);
		}
	}
}

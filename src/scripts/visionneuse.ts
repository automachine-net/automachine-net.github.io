// Chargement de la visionneuse glTF (<model-viewer>) là où une page en contient une.
//
// La bibliothèque est lourde : elle n'est demandée que si la page a au moins un modèle, et
// une seule fois. Les décodeurs des modèles compressés (Draco) sont servis depuis notre
// domaine, jamais depuis le CDN de Google que la bibliothèque utilise par défaut.
//
// Un modèle exporté de la CAO arrive souvent tout blanc, sans matière : sur fond clair, on ne
// distingue plus les formes. À l'ouverture, les matières quasi blanches reçoivent une teinte
// gris-bleu de la charte et une rugosité mate, pour que les ombres dessinent le volume.

let promesse: Promise<void> | null = null;

/** Teinte donnée aux matières blanches : un gris-bleu, proche du bleu clair de la charte. */
const TEINTE: [number, number, number, number] = [0.62, 0.7, 0.78, 1];

function teinter(visionneuse: Element & { model?: { materials: unknown[] } }): void {
	const materiaux = (visionneuse.model?.materials ?? []) as {
		pbrMetallicRoughness: {
			baseColorFactor: number[];
			setBaseColorFactor(c: number[]): void;
			setMetallicFactor(v: number): void;
			setRoughnessFactor(v: number): void;
		};
	}[];
	for (const m of materiaux) {
		const [r, g, b] = m.pbrMetallicRoughness.baseColorFactor;
		if (r > 0.85 && g > 0.85 && b > 0.85) {
			m.pbrMetallicRoughness.setBaseColorFactor(TEINTE);
			m.pbrMetallicRoughness.setMetallicFactor(0.1);
			m.pbrMetallicRoughness.setRoughnessFactor(0.65);
		}
	}
}

export function chargerVisionneuse(): void {
	if (promesse || !document.querySelector('model-viewer')) return;
	promesse = import('@google/model-viewer').then(({ ModelViewerElement }) => {
		ModelViewerElement.dracoDecoderLocation = '/decodeurs/draco/';
		document.querySelectorAll('model-viewer').forEach((v) => {
			v.addEventListener('load', () => teinter(v as Element & { model?: { materials: unknown[] } }));
		});
	});
}

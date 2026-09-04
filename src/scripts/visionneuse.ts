// Chargement de la visionneuse glTF (<model-viewer>) là où une page en contient une.
//
// La bibliothèque est lourde : elle n'est demandée que si la page a au moins un modèle, et
// une seule fois. Les décodeurs des modèles compressés (Draco) sont servis depuis notre
// domaine, jamais depuis le CDN de Google que la bibliothèque utilise par défaut.

let promesse: Promise<void> | null = null;

export function chargerVisionneuse(): void {
	if (promesse || !document.querySelector('model-viewer')) return;
	promesse = import('@google/model-viewer').then(({ ModelViewerElement }) => {
		ModelViewerElement.dracoDecoderLocation = '/decodeurs/draco/';
	});
}

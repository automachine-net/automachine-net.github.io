// Utilitaires communs aux blocs de page.

export type Fond = 'blanc' | 'clair' | 'sombre' | undefined;

/**
 * Renvoie la classe de fond d'un bloc. Chaque bloc en porte toujours une, y compris le blanc :
 * c'est ce qui permet à deux blocs de même fond qui se suivent de ne pas cumuler leurs marges
 * et de former une seule section à l'écran (voir `src/styles/base.css`).
 */
export function classeFond(fond: Fond): string {
	if (fond === 'clair') return 'bloc--clair';
	if (fond === 'sombre') return 'bloc--sombre';
	return 'bloc--blanc';
}

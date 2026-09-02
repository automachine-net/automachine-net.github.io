// Volumes filaires manipulables dessinés au canvas, sans bibliothèque.
// Ils tiennent lieu de modèles 3D en attendant les vrais fichiers glTF (lot 3).
// Chaque « modèle » est une liste de volumes simples (boîtes, prismes) avec une couleur.

export type Point = [number, number, number];
export interface Volume {
	points: Point[];
	aretes: [number, number][];
	couleur: string;
}
export interface Modele {
	slug: string;
	nom: string;
	volumes: Volume[];
}

const BLEU = '#53769a';
const NUIT = '#2e4560';
const CLAIR = '#7aabd6';
const ORANGE = '#f79f22';

const ARETES_BOITE: [number, number][] = [
	[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7],
];

/** Boîte alignée sur les axes. y vers le bas à l'écran ; le sol est en y positif. */
export function boite(x: number, y: number, z: number, w: number, h: number, d: number, couleur = BLEU): Volume {
	return {
		points: [
			[x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z],
			[x, y, z + d], [x + w, y, z + d], [x + w, y + h, z + d], [x, y + h, z + d],
		],
		aretes: ARETES_BOITE,
		couleur,
	};
}

/** Prisme à n côtés (cylindre approché), axe selon x, y ou z. */
export function prisme(
	cx: number, cy: number, cz: number, rayon: number, longueur: number, axe: 'x' | 'y' | 'z', n = 10, couleur = BLEU
): Volume {
	const points: Point[] = [];
	const aretes: [number, number][] = [];
	for (let k = 0; k < 2; k++) {
		const t = (k - 0.5) * longueur;
		for (let i = 0; i < n; i++) {
			const a = (i / n) * Math.PI * 2;
			const u = Math.cos(a) * rayon, v = Math.sin(a) * rayon;
			points.push(axe === 'x' ? [cx + t, cy + u, cz + v] : axe === 'y' ? [cx + u, cy + t, cz + v] : [cx + u, cy + v, cz + t]);
			aretes.push([k * n + i, k * n + ((i + 1) % n)]);
			if (k === 1) aretes.push([i, n + i]);
		}
	}
	return { points, aretes, couleur };
}

// Six volumes neutres, un par machine. Proportions génériques, aucun détail réel.
export const modeles: Modele[] = [
	{
		slug: 'bobineuse', nom: 'Bobineuse',
		volumes: [
			boite(-1.5, 0.8, -0.8, 3, 0.2, 1.6, NUIT),
			boite(-1.4, -0.6, -0.5, 0.15, 1.4, 1, BLEU), boite(1.25, -0.6, -0.5, 0.15, 1.4, 1, BLEU),
			prisme(0, 0, 0, 0.55, 2.4, 'x', 12, CLAIR), prisme(0, 0, 0, 0.12, 2.9, 'x', 6, ORANGE),
		],
	},
	{
		slug: 'banc-de-test-hydraulique', nom: 'Banc de test hydraulique',
		volumes: [
			boite(-1.6, 0.2, -0.9, 3.2, 0.15, 1.8, NUIT),
			boite(-1.5, 0.35, -0.8, 0.12, 0.7, 0.12, BLEU), boite(1.38, 0.35, -0.8, 0.12, 0.7, 0.12, BLEU),
			boite(-1.5, 0.35, 0.68, 0.12, 0.7, 0.12, BLEU), boite(1.38, 0.35, 0.68, 0.12, 0.7, 0.12, BLEU),
			prisme(-0.7, -0.15, 0, 0.22, 1.2, 'x', 10, CLAIR), prisme(0.7, -0.15, 0, 0.22, 1.2, 'x', 10, CLAIR),
			boite(-0.5, -0.9, -0.4, 1, 0.9, 0.8, ORANGE),
		],
	},
	{
		slug: 'machine-a-plisser', nom: 'Machine à plisser',
		volumes: [
			boite(-1.7, 0.6, -0.7, 3.4, 0.5, 1.4, NUIT),
			prisme(-0.9, 0, 0, 0.35, 1.3, 'z', 12, CLAIR), prisme(0, -0.1, 0, 0.35, 1.3, 'z', 12, CLAIR), prisme(0.9, 0, 0, 0.35, 1.3, 'z', 12, CLAIR),
			boite(-1.6, -0.9, -0.6, 3.2, 0.12, 1.2, BLEU), boite(1.2, -0.5, -0.5, 0.5, 1.1, 1, ORANGE),
		],
	},
	{
		slug: 'cabine-robotisee', nom: 'Cabine robotisée',
		volumes: [
			boite(-1.5, -1.1, -1, 3, 2.1, 2, BLEU),
			boite(-0.3, 0.4, -0.3, 0.6, 0.6, 0.6, NUIT),
			boite(-0.15, -0.5, -0.15, 0.3, 0.9, 0.3, ORANGE), boite(-0.15, -0.6, -0.15, 1.1, 0.25, 0.3, ORANGE),
			boite(0.8, -0.6, -0.1, 0.2, 0.7, 0.2, CLAIR),
		],
	},
	{
		slug: 'depacking', nom: 'Ligne de dépacking',
		volumes: [
			boite(-2, 0.5, -0.35, 4, 0.12, 0.7, NUIT),
			boite(-1.8, 0.62, -0.3, 0.1, 0.5, 0.1, BLEU), boite(1.7, 0.62, -0.3, 0.1, 0.5, 0.1, BLEU),
			boite(-1.8, 0.62, 0.2, 0.1, 0.5, 0.1, BLEU), boite(1.7, 0.62, 0.2, 0.1, 0.5, 0.1, BLEU),
			boite(-0.6, -0.9, -0.6, 1.2, 1.4, 1.2, ORANGE), prisme(0, -0.4, 0, 0.3, 1.1, 'y', 8, CLAIR),
		],
	},
	{
		slug: 'sableuse', nom: 'Sableuse',
		volumes: [
			boite(-1, -0.2, -0.8, 2, 1.2, 1.6, NUIT), boite(-0.9, -1.1, -0.7, 1.8, 0.9, 1.4, BLEU),
			prisme(0, -0.65, 0.05, 0.3, 0.6, 'z', 8, ORANGE),
			boite(-0.3, 1, -0.3, 0.6, 0.35, 0.6, CLAIR),
		],
	},
];

export interface Options {
	/** Rotation lente au repos (désactivée si l'utilisateur préfère moins d'animation). */
	autoRotation?: boolean;
	/** Échelle relative au plus petit côté du canvas. */
	echelle?: number;
	/** Épaisseur du trait. */
	trait?: number;
}

/** Monte une scène sur un canvas et renvoie une fonction pour changer de modèle. */
export function monterScene(canvas: HTMLCanvasElement, modele: Modele, options: Options = {}) {
	const ctx = canvas.getContext('2d');
	if (!ctx) return { changer: () => {} };
	const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const auto = options.autoRotation !== false && !reduit;
	let volumes = modele.volumes;
	let cible = modele.volumes;
	let transition = 1; // 0 → 1 pendant un changement de modèle (fondu)
	let ax = -0.35, ay = 0.7, vx = 0, vy = 0, drag = false, lx = 0, ly = 0;

	const rendu = () => {
		const W = canvas.width, H = canvas.height, s = Math.min(W, H) * (options.echelle ?? 0.22);
		ctx.clearRect(0, 0, W, H);
		const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
		const proj = ([x, y, z]: Point) => {
			const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
			const y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
			const k = 3.2 / (3.2 + z2 * 0.35);
			return [W / 2 + x1 * s * k, H / 2 + y1 * s * k];
		};
		ctx.lineWidth = options.trait ?? 2;
		ctx.lineJoin = 'round';
		ctx.globalAlpha = transition < 1 ? Math.abs(transition * 2 - 1) : 1;
		for (const v of volumes) {
			const pts = v.points.map(proj);
			ctx.strokeStyle = v.couleur;
			ctx.beginPath();
			for (const [a, b] of v.aretes) {
				ctx.moveTo(pts[a][0], pts[a][1]);
				ctx.lineTo(pts[b][0], pts[b][1]);
			}
			ctx.stroke();
		}
		ctx.globalAlpha = 1;
	};

	let visible = true;
	const boucle = () => {
		if (visible) {
			if (!drag) {
				ay += vy + (auto ? 0.003 : 0);
				ax = Math.max(-1.2, Math.min(1.2, ax + vx));
				vx *= 0.92;
				vy *= 0.92;
			}
			if (transition < 1) {
				transition = Math.min(1, transition + 0.08);
				if (transition >= 0.5) volumes = cible;
			}
			rendu();
		}
		requestAnimationFrame(boucle);
	};
	// Pas de rendu hors écran.
	new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(canvas);

	const debut = (x: number, y: number) => { drag = true; lx = x; ly = y; canvas.classList.add('actif'); };
	const mouvement = (x: number, y: number) => {
		if (!drag) return;
		vy = (x - lx) * 0.008;
		vx = (y - ly) * 0.008;
		ay += vy;
		ax = Math.max(-1.2, Math.min(1.2, ax + vx));
		lx = x; ly = y;
	};
	const fin = () => { drag = false; canvas.classList.remove('actif'); };
	canvas.addEventListener('pointerdown', (e) => { canvas.setPointerCapture(e.pointerId); debut(e.clientX, e.clientY); });
	canvas.addEventListener('pointermove', (e) => mouvement(e.clientX, e.clientY));
	canvas.addEventListener('pointerup', fin);
	canvas.addEventListener('pointercancel', fin);
	// Clavier : flèches pour tourner.
	canvas.addEventListener('keydown', (e) => {
		const pas = 0.08;
		if (e.key === 'ArrowLeft') ay -= pas; else if (e.key === 'ArrowRight') ay += pas;
		else if (e.key === 'ArrowUp') ax = Math.max(-1.2, ax - pas); else if (e.key === 'ArrowDown') ax = Math.min(1.2, ax + pas);
		else return;
		e.preventDefault();
	});
	boucle();

	return {
		changer(m: Modele) {
			if (m.volumes === cible) return;
			cible = m.volumes;
			transition = 0;
		},
	};
}

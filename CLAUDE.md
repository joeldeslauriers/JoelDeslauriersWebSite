# Laurier Web — Guide de développement

Site vitrine one-page pour l'agence **Laurier Web**.  
Stack : HTML5 · CSS3 · JavaScript Vanilla — aucune dépendance, pas de build tool.

---

## Identité de marque

### Nom
**Laurier Web** — partout dans le code, dans les titres, les balises meta, le footer et les commentaires.  
Ne jamais utiliser l'ancien nom "Webyx".

### Palette de couleurs
| Rôle | Valeur | Variable CSS |
|---|---|---|
| Fond principal | `#0A1128` | `--bg` |
| Fond secondaire | `#0D1535` | `--bg-2` |
| Fond tertiaire | `#0F1840` | `--bg-3` |
| Surface (cards) | `#132042` | `--surface` |
| Accent principal (vert laurier) | `#4CAF50` | `--red` (nom legacy, ne pas renommer) |
| Accent hover / bordures | `#2E7D32` | `--red-hover` |
| Vert clair secondaire | `#81C784` | `--yellow` (nom legacy) |
| Vert très clair (delays, badges) | `#A5D6A7` | `--cyan` (nom legacy) |
| Texte principal | `#F0F0F0` | `--text` |
| Texte atténué | `#888888` | `--text-muted` |

> Les variables CSS gardent leurs noms legacy (`--red`, `--yellow`, `--cyan`) pour éviter des cassures. Seules leurs valeurs sont vertes.

### Ton et positionnement
- Sobre, crédible, professionnel — pas agressif.
- Clientèle cible : notaires, PME, professionnels établis.
- Le laurier évoque la confiance, le prestige, l'excellence.
- Tagline footer : *Présence web professionnelle — crédible et mémorable.*

### Logos
Fichiers dans `assets/images/` :
- `LogoTransparent.png` — logo sans fond (utilisé dans navbar et footer sur fond sombre)
- `LogoBackground.png` — logo avec fond (pour usage sur fond clair ou exports marketing)

Utilisation dans le HTML :
```html
<img src="assets/images/LogoTransparent.png" alt="Laurier Web" class="logo-image" />
```
CSS associé :
```css
.logo { flex-shrink: 0; display: flex; align-items: center; }
.logo-image { height: 44px; width: auto; display: block; }
```

---

## Structure des fichiers

```
/
├── index.html          — structure HTML de la page
├── style.css           — tout le CSS (variables, composants, responsive)
├── script.js           — tout le JS (navbar, reveal, formulaire, budget)
├── version.json        — version courante du site
├── CLAUDE.md           — ce guide
├── README.md           — guide humain / déploiement
└── assets/
    └── images/
        ├── LogoTransparent.png
        └── LogoBackground.png
```

---

## Conventions de développement

- **Pas de framework, pas de build** — HTML/CSS/JS pur.
- Toutes les couleurs passent par les variables CSS `:root` — ne jamais coder des hex directement sauf pour les rgba de box-shadow (les mettre à jour manuellement si la palette change).
- Les classes `.btn-red`, `.badge-pop`, `.feat-red` gardent leurs noms même si la couleur est maintenant verte — ne pas renommer pour ne pas casser le CSS en cascade.
- Les sections suivent l'ordre : hero → marquee → modèles → services → réalisations → contact → footer.
- Scroll reveal via `IntersectionObserver` — ajouter la classe `.reveal` à tout nouvel élément animé.

---

## Versioning

Format : `MAJOR.MINOR.PATCH`  
- Mettre à jour `version.json` et le footer dans `index.html` à chaque release.
- Version courante : **2.0.0** (rebrand Webyx → Laurier Web, 2026-04-14)

---

## Connexion du formulaire (Formspree)

Le formulaire est en mode simulation. Pour activer :  
1. Créer un compte [formspree.io](https://formspree.io) et obtenir un endpoint.
2. Dans `script.js`, remplacer le bloc `// Simulation envoi` par un vrai `fetch()` vers l'endpoint.
3. Voir le `README.md` pour le code complet.

---

## Déploiement

Site statique — aucun serveur requis.

| Hébergeur | Méthode |
|---|---|
| GitHub Pages | Push sur master → Settings → Pages → Deploy from branch |
| Netlify | Drag & drop sur netlify.com/drop |
| Vercel | `npx vercel` dans le dossier |

---

## Réalisations affichées

1. **Joël Laurier Production** — joelaurierproduction.com — production vidéo
2. **Scellants Cellco** — scellantscellco.ca — construction / scellement
3. **MTech Website** — joeldeslauriers.github.io/mtechWebsite — tech
4. **FN Website** — joeldeslauriers.github.io/FNWebSite — communauté

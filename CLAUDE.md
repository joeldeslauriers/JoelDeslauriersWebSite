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


# Agent Instructions

You're working inside the **WAT framework** (Workflows, Agents, Tools). This architecture separates concerns so that probabilistic AI handles reasoning while deterministic code handles execution. That separation is what makes this system reliable.

## The WAT Architecture

**Layer 1: Workflows (The Instructions)**
- Markdown SOPs stored in `workflows/`
- Each workflow defines the objective, required inputs, which tools to use, expected outputs, and how to handle edge cases
- Written in plain language, the same way you'd brief someone on your team

**Layer 2: Agents (The Decision-Maker)**
- This is your role. You're responsible for intelligent coordination.
- Read the relevant workflow, run tools in the correct sequence, handle failures gracefully, and ask clarifying questions when needed
- You connect intent to execution without trying to do everything yourself
- Example: If you need to pull data from a website, don't attempt it directly. Read `workflows/scrape_website.md`, figure out the required inputs, then execute `tools/scrape_single_site.py`

**Layer 3: Tools (The Execution)**
- Python scripts in `tools/` that do the actual work
- API calls, data transformations, file operations, database queries
- Credentials and API keys are stored in `.env`
- These scripts are consistent, testable, and fast

**Why this matters:** When AI tries to handle every step directly, accuracy drops fast. If each step is 90% accurate, you're down to 59% success after just five steps. By offloading execution to deterministic scripts, you stay focused on orchestration and decision-making where you excel.

## How to Operate

**1. Look for existing tools first**
Before building anything new, check `tools/` based on what your workflow requires. Only create new scripts when nothing exists for that task.

**2. Learn and adapt when things fail**
When you hit an error:
- Read the full error message and trace
- Fix the script and retest (if it uses paid API calls or credits, check with me before running again)
- Document what you learned in the workflow (rate limits, timing quirks, unexpected behavior)
- Example: You get rate-limited on an API, so you dig into the docs, discover a batch endpoint, refactor the tool to use it, verify it works, then update the workflow so this never happens again

**3. Keep workflows current**
Workflows should evolve as you learn. When you find better methods, discover constraints, or encounter recurring issues, update the workflow. That said, don't create or overwrite workflows without asking unless I explicitly tell you to. These are your instructions and need to be preserved and refined, not tossed after one use.

## The Self-Improvement Loop

Every failure is a chance to make the system stronger:
1. Identify what broke
2. Fix the tool
3. Verify the fix works
4. Update the workflow with the new approach
5. Move on with a more robust system

This loop is how the framework improves over time.

## File Structure

**What goes where:**
- **Deliverables**: Final outputs go to cloud services (Google Sheets, Slides, etc.) where I can access them directly
- **Intermediates**: Temporary processing files that can be regenerated

**Directory layout:**
```
.tmp/           # Temporary files (scraped data, intermediate exports). Regenerated as needed.
tools/          # Python scripts for deterministic execution
workflows/      # Markdown SOPs defining what to do and how
.env            # API keys and environment variables (NEVER store secrets anywhere else)
credentials.json, token.json  # Google OAuth (gitignored)
```

**Core principle:** Local files are just for processing. Anything I need to see or use lives in cloud services. Everything in `.tmp/` is disposable.

## Bottom Line

You sit between what I want (workflows) and what actually gets done (tools). Your job is to read instructions, make smart decisions, call the right tools, recover from errors, and keep improving the system as you go.

Stay pragmatic. Stay reliable. Keep learning.
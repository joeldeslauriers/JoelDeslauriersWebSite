# Laurier Web — Site web agence

Site one-page pour l'agence de création de sites web **Laurier Web**.  
Stack : HTML5 · CSS3 · JavaScript Vanilla — aucune dépendance, pas de build tool.

---

## Démarrage rapide

1. Ouvrez `index.html` dans votre navigateur (double-clic ou serveur local).
2. Pour un aperçu avec rechargement automatique, utilisez l'extension **Live Server** dans VS Code ou :
   ```bash
   npx serve .
   ```

---

## Structure des fichiers

```
/
├── index.html   — structure HTML de la page
├── style.css    — tout le CSS (variables, composants, responsive)
├── script.js    — tout le JS (navbar, reveal, formulaire, budget)
└── README.md    — ce fichier
```

---

## Personnalisation

### Nom et marque
- Dans `index.html`, cherchez `Laurier Web` pour changer le nom de l'agence.
- Le logo est une image PNG dans `assets/images/LogoTransparent.png`, intégrée via la classe `.logo-image`.

### Couleurs
Toutes les couleurs sont des variables CSS dans `style.css` (ligne ~10) :
```css
--red:    #4CAF50;   /* vert laurier — CTA, accents principaux */
--yellow: #81C784;   /* vert clair — badges secondaires */
--cyan:   #A5D6A7;   /* vert très clair — délais, icônes */
--bg:     #0A1128;   /* marine foncé — fond principal */
```
Modifiez uniquement ces variables pour refaire la palette entière.

### Typographie
Les polices sont chargées via Google Fonts dans `index.html` :
- Titres : **Syne** (poids 400/600/700/800)
- Corps : **DM Sans** (poids 300/400/500/600)

Pour changer de polices, remplacez le lien `<link>` dans le `<head>` et mettez à jour `--font-head` / `--font-body` dans les variables CSS.

### Modèles (cards)
Dans `index.html`, section `#modeles`. Chaque carte suit ce schéma :
```html
<article class="card reveal">
  <div class="card-thumb thumb-[couleur]">
    <span class="thumb-emoji">EMOJI</span>
    <div class="card-badge badge-[pop|new]">Label</div>
  </div>
  <div class="card-body">
    <h3>Nom du modèle</h3>
    <p>Description courte.</p>
    <div class="card-meta">
      <span class="price">À partir de <strong>XXX $</strong></span>
      <span class="delay">⏱ X jours</span>
    </div>
    <a href="#contact" class="btn btn-ghost">Voir plus →</a>
  </div>
</article>
```
Couleurs de thumbnail disponibles : `thumb-blue`, `thumb-orange`, `thumb-cyan`, `thumb-purple`.

### Statistiques Hero
Dans `index.html`, section `.hero-stats` :
```html
<span class="stat-number">40<span class="stat-plus">+</span></span>
<span class="stat-label">Sites livrés</span>
```
Remplacez les chiffres et labels directement.

### Marquee
Dupliquez ou supprimez les `.marquee-item` dans la section `.marquee-wrap`.  
La vitesse du défilement se règle dans `style.css` :
```css
animation: marqueeScroll 28s linear infinite; /* ← changer 28s */
```

### Liens sociaux
Dans le footer, cherchez `href="#"` dans les `.social-link` et remplacez par vos URLs réelles :
```html
<a href="https://linkedin.com/in/votre-profil" ...>
<a href="https://instagram.com/votre-compte" ...>
<a href="https://github.com/votre-compte" ...>
```

---

## Connecter le formulaire (Formspree)

Le formulaire est actuellement en mode **simulation** (aucun email envoyé).  
Pour activer l'envoi réel avec [Formspree](https://formspree.io) (plan gratuit disponible) :

### Étapes

1. Créez un compte sur [formspree.io](https://formspree.io) et créez un nouveau formulaire.
2. Copiez votre endpoint, ex. : `https://formspree.io/f/xabcdefg`
3. Dans `script.js`, repérez le bloc **"Simulation envoi"** (~ligne 120) :

```js
// ── Simulation envoi (remplacer par Formspree / fetch réel) ──
submitBtn.disabled = true;
submitBtn.textContent = 'Envoi en cours...';

setTimeout(() => { ... }, 800);
```

4. Remplacez ce bloc par :

```js
submitBtn.disabled = true;
submitBtn.textContent = 'Envoi en cours...';

const formData = new FormData(form);
// Ajouter le budget (champ caché)
formData.set('budget', budgetValue.value || 'Non précisé');

fetch('https://formspree.io/f/VOTRE_ID', {
  method: 'POST',
  body: formData,
  headers: { 'Accept': 'application/json' }
})
.then(res => {
  if (res.ok) {
    successMsg.hidden = false;
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    form.reset();
    budgetButtons.forEach(b => b.classList.remove('active'));
    budgetValue.value = '';
    setTimeout(() => { successMsg.hidden = true; }, 8000);
  } else {
    alert('Une erreur est survenue. Réessayez ou contactez-nous directement.');
  }
})
.catch(() => alert('Erreur réseau. Vérifiez votre connexion.'))
.finally(() => {
  submitBtn.disabled = false;
  submitBtn.innerHTML = 'Envoyer ma demande <span class="arr">→</span>';
});
```

> **Alternative :** vous pouvez aussi ajouter `action="https://formspree.io/f/VOTRE_ID" method="POST"` directement sur la balise `<form>` et retirer toute la logique JS d'envoi — mais vous perdrez le message de succès inline.

---

## Déploiement

Le site est statique — aucun serveur requis. Options recommandées :

| Hébergeur | Commande / méthode |
|---|---|
| **Netlify** | Glissez-déposez le dossier sur [netlify.com/drop](https://netlify.com/drop) |
| **Vercel** | `npx vercel` dans le dossier |
| **GitHub Pages** | Push sur un repo GitHub → Settings → Pages → Deploy from branch |
| **Cloudflare Pages** | Connectez votre repo GitHub |

---

## Favicon (optionnel)

Ajoutez dans le `<head>` de `index.html` :
```html
<link rel="icon" type="image/png" href="favicon.png" />
```

---

## Licence

Usage libre pour projets personnels et commerciaux.  
© 2026 Laurier Web — Montréal, QC

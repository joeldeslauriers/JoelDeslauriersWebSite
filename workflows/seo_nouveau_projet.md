# SEO — Nouveau projet web

## Objectif
Appliquer automatiquement toutes les bonnes pratiques SEO technique + SEO local dès la création d'un nouveau site. Ne pas attendre un audit après coup.

## Déclencheur
S'applique à **chaque nouveau projet web** livré par Laurier Web, dès la création du fichier `index.html`.

---

## Checklist à appliquer sans qu'on te le demande

### 1. `<head>` — Métadonnées de base
- [ ] `<title>` : mot-clé principal + ville(s) + nom de marque (max 60 car.)
- [ ] `<meta name="description">` : 140–160 car., local, avec CTA implicite
- [ ] `<meta name="robots" content="index, follow">`
- [ ] `<link rel="canonical" href="https://domaine.ca" />`
- [ ] `<html lang="fr">` ou `lang="fr-CA"`
- [ ] Favicon : `<link rel="icon">`, `<link rel="apple-touch-icon">`

### 2. Open Graph + Twitter Card
```html
<meta property="og:type"        content="website" />
<meta property="og:site_name"   content="Nom du client" />
<meta property="og:locale"      content="fr_CA" />
<meta property="og:title"       content="Titre optimisé" />
<meta property="og:description" content="Description courte" />
<meta property="og:url"         content="https://domaine.ca" />
<meta property="og:image"       content="https://domaine.ca/assets/images/OG.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="Titre optimisé" />
<meta name="twitter:description" content="Description courte" />
<meta name="twitter:image"       content="https://domaine.ca/assets/images/OG.png" />
```
> Image OG : demander au client une image 1200×630px ou la créer sur Canva.

### 3. Performance — Images
- [ ] `<link rel="preload" as="image" href="hero-image.png" />` pour l'image above-the-fold
- [ ] `fetchpriority="high"` sur l'image hero
- [ ] `loading="lazy"` sur toutes les images sous le fold
- [ ] Suggérer au client de compresser les images (squoosh.app ou WebP)

### 4. Schémas JSON-LD (3 blocs à inclure systématiquement)

#### LocalBusiness / ProfessionalService
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://domaine.ca/#business",
  "name": "Nom du client",
  "description": "Description courte des services + ville(s).",
  "url": "https://domaine.ca",
  "email": "email@client.com",
  "telephone": "+1-XXX-XXX-XXXX",
  "logo": {
    "@type": "ImageObject",
    "url": "https://domaine.ca/assets/images/logo.png"
  },
  "image": "https://domaine.ca/assets/images/OG.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ville principale",
    "addressRegion": "QC",
    "addressCountry": "CA"
  },
  "areaServed": [
    {"@type": "City", "name": "Ville 1"},
    {"@type": "City", "name": "Ville 2"}
  ],
  "knowsLanguage": "fr-CA",
  "priceRange": "$$",
  "sameAs": [
    "URL Google Business Profile"
  ]
}
```

#### WebSite
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://domaine.ca/#website",
  "name": "Nom du client",
  "url": "https://domaine.ca",
  "inLanguage": "fr-CA",
  "publisher": {"@id": "https://domaine.ca/#business"}
}
```

#### FAQPage (si une section FAQ existe)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question fréquente?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Réponse complète."
      }
    }
  ]
}
```

### 5. Structure HTML sémantique
- [ ] Un seul `<h1>` par page, avec le mot-clé principal et la ville si pertinent
- [ ] Hiérarchie `<h2>` / `<h3>` logique
- [ ] Balises `alt` sur toutes les images visibles (descriptives, pas juste "image")
- [ ] Sections avec `id` pour la navigation par ancres
- [ ] `<nav aria-label="Navigation principale">`

### 6. Contenu local
- [ ] Ville(s) desservies mentionnées dans le `<h1>` ou le premier paragraphe
- [ ] Section ou paragraphe listant les zones desservies (texte visible, pas juste en schema)
- [ ] Section FAQ avec au moins 3–5 questions pertinentes au secteur
- [ ] NAP cohérent (Nom, Adresse/Région, Téléphone) entre le site, le footer et le schema

### 7. Fichiers SEO obligatoires
- [ ] `sitemap.xml` — créer dès le début, avec `lastmod` = date de livraison
- [ ] `robots.txt` — `Allow: /` + pointer vers le sitemap
- [ ] Favicon (PNG, au moins 32×32)

Contenu minimal de `robots.txt` :
```
User-agent: *
Allow: /

Sitemap: https://domaine.ca/sitemap.xml
```

Contenu minimal de `sitemap.xml` :
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://domaine.ca/</loc>
    <lastmod>AAAA-MM-JJ</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 8. Checklist de remise au client
Rappeler au client après livraison :
- [ ] Créer / réclamer sa fiche **Google Business Profile** sur business.google.com
- [ ] Fournir l'URL GBP pour l'ajouter dans le `sameAs` du schema
- [ ] Soumettre le sitemap dans **Google Search Console**
- [ ] Vérifier l'affichage de l'OG image sur opengraph.xyz
- [ ] Ajouter les liens réseaux sociaux dans le `sameAs` dès qu'ils existent

---

## Informations à demander au client au démarrage

Pour appliquer ce workflow correctement, collecter ces informations avant de coder :

| Info | Exemple |
|------|---------|
| Nom de l'entreprise | Scellants Cellco |
| Domaine final | scellantscellco.ca |
| Ville principale | Mirabel, QC |
| Villes desservies | Mirabel, Blainville, Saint-Jérôme… |
| Téléphone | +1-514-000-0000 |
| Courriel | contact@client.com |
| Secteur / type de `@type` | ProfessionalService, Restaurant, MedicalBusiness… |
| URL Google Business Profile | https://maps.google.com/?cid=XXX |
| Image OG 1200×630px | OG.png |

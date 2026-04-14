#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Webyx — release.sh
# Bumpe la version, commit, tag et pousse sur GitHub.
#
# Usage :
#   ./release.sh           → patch bump  (1.0.0 → 1.0.1)
#   ./release.sh patch     → patch bump
#   ./release.sh minor     → minor bump  (1.0.0 → 1.1.0)
#   ./release.sh major     → major bump  (1.0.0 → 2.0.0)
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

BUMP="${1:-patch}"
VERSION_FILE="version.json"
HTML_FILE="index.html"

# ── 1. Lire la version actuelle ──────────────────────────────
if [ ! -f "$VERSION_FILE" ]; then
  echo "❌ Fichier $VERSION_FILE introuvable."
  exit 1
fi

CURRENT=$(grep -o '"version": *"[^"]*"' "$VERSION_FILE" | grep -o '[0-9][^"]*')

if [ -z "$CURRENT" ]; then
  echo "❌ Impossible de lire la version dans $VERSION_FILE."
  exit 1
fi

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

# ── 2. Calculer la nouvelle version ──────────────────────────
case "$BUMP" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
  *)
    echo "Usage : $0 [patch|minor|major]"
    exit 1
    ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
TODAY=$(date +%Y-%m-%d)

echo ""
echo "📦 Release : v${CURRENT} → v${NEW_VERSION}"
echo ""

# ── 3. Mettre à jour version.json ────────────────────────────
cat > "$VERSION_FILE" << JSONEOF
{
  "version": "${NEW_VERSION}",
  "date": "${TODAY}"
}
JSONEOF

echo "✅ version.json mis à jour"

# ── 4. Mettre à jour l'affichage de version dans index.html ──
# Remplace le contenu du span#siteVersion
if grep -q 'id="siteVersion"' "$HTML_FILE"; then
  # Compatible macOS (sed -i '') et Linux (sed -i)
  if sed --version 2>/dev/null | grep -q GNU; then
    sed -i "s|id=\"siteVersion\">[^<]*<|id=\"siteVersion\">V${NEW_VERSION}<|g" "$HTML_FILE"
  else
    sed -i '' "s|id=\"siteVersion\">[^<]*<|id=\"siteVersion\">V${NEW_VERSION}<|g" "$HTML_FILE"
  fi
  echo "✅ index.html mis à jour (V${NEW_VERSION})"
else
  echo "⚠️  span#siteVersion introuvable dans index.html — version.json seul mis à jour."
fi

# ── 5. Git : stage, commit, tag ──────────────────────────────
git add "$VERSION_FILE" "$HTML_FILE"

# Vérifie qu'il y a quelque chose à commiter
if git diff --cached --quiet; then
  echo "⚠️  Aucun changement stagé — commit ignoré."
else
  git commit -m "chore: release v${NEW_VERSION}"
  echo "✅ Commit créé : chore: release v${NEW_VERSION}"
fi

# Tag (écrase si existant — au cas où on relance)
git tag -f "v${NEW_VERSION}"
echo "✅ Tag créé : v${NEW_VERSION}"

# ── 6. Push ──────────────────────────────────────────────────
REMOTE="${REMOTE:-origin}"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

git push "$REMOTE" "$BRANCH"
git push "$REMOTE" "v${NEW_VERSION}" --force

echo ""
echo "🚀 v${NEW_VERSION} publiée sur GitHub (${REMOTE}/${BRANCH})"
echo ""

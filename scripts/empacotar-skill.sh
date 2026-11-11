#!/usr/bin/env bash
# Gera o .zip de uma skill para enviar ao app do Claude
# (Configurações → Capacidades → Skills → Enviar skill).
# Uso: scripts/empacotar-skill.sh <nome-da-skill>
set -euo pipefail
raiz="$(cd "$(dirname "$0")/.." && pwd)"
nome="${1:?Informe o nome da skill. Disponíveis: $(ls "$raiz/.claude/skills" | tr '\n' ' ')}"
[ -f "$raiz/.claude/skills/$nome/SKILL.md" ] || { echo "Skill não encontrada: $nome"; exit 1; }
mkdir -p "$raiz/dist"
rm -f "$raiz/dist/$nome.zip"
(cd "$raiz/.claude/skills" && zip -qr "$raiz/dist/$nome.zip" "$nome" -x '*.DS_Store')
echo "Criado: dist/$nome.zip"

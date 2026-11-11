#!/usr/bin/env bash
# Checagem de uma LP antes da entrega.
# Uso: verificar-lp.sh <pasta-da-lp>
set -u
dir="${1:-.}"
erros=0

falha() { echo "ERRO: $1"; erros=$((erros + 1)); }
aviso() { echo "AVISO: $1"; }

for f in index.html styles.css script.js; do
  [ -f "$dir/$f" ] || falha "arquivo ausente: $f"
done

# Placeholders não substituídos
if grep -rn '{{[A-Z0-9_]*}}' "$dir" --include='*.html' --include='*.css' --include='*.js' >/tmp/lp-ph.$$ 2>/dev/null; then
  falha "placeholders não substituídos:"
  sed 's/^/  /' /tmp/lp-ph.$$ | cut -c1-160
fi
rm -f /tmp/lp-ph.$$

# Arquivos locais referenciados que não existem
if [ -f "$dir/index.html" ]; then
  grep -o '\(src\|href\)="\./[^"#?]*"' "$dir/index.html" | sed 's/^[a-z]*="//; s/"$//' | sort -u |
  while read -r ref; do
    [ -e "$dir/$ref" ] || echo "ERRO: referência quebrada: $ref"
  done >/tmp/lp-ref.$$
  if [ -s /tmp/lp-ref.$$ ]; then cat /tmp/lp-ref.$$; erros=$((erros + $(wc -l </tmp/lp-ref.$$))); fi
  rm -f /tmp/lp-ref.$$

  grep -q 'GTM-' "$dir/index.html" || aviso "sem Google Tag Manager — página sem mensuração"
  grep -qi 'privacidade' "$dir/index.html" || aviso "sem link para política de privacidade"
  grep -q '<img[^>]*[^-]alt=""' "$dir/index.html" && aviso "há imagens com alt vazio"
fi

# Imagens pesadas (> 300 KB)
if [ -d "$dir/assets/img" ]; then
  find "$dir/assets/img" -type f -size +300k | while read -r img; do
    echo "AVISO: imagem pesada ($(du -k "$img" | cut -f1) KB): $img"
  done
fi

if [ "$erros" -gt 0 ]; then
  echo "Resultado: $erros erro(s). Corrija antes de entregar."
  exit 1
fi
echo "Resultado: OK."

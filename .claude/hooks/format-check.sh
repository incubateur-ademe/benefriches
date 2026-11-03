#!/bin/bash
# PostToolUse(Edit|Write): run Prettier on the files just edited.
# Shared by Claude (tool_input.file_path) and Codex (apply_patch: the patch text
# is in tool_input.command, one "*** Add/Update File: <path>" line per file).
FILES=$(node -e "
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
  const j=JSON.parse(s),t=j.tool_input||{},path=require('path');
  const out=[];
  if(t.file_path) out.push(t.file_path);
  else if(typeof t.command==='string')
    for(const m of t.command.matchAll(/^\*\*\* (?:Add|Update) File: (.+)\$/gm)) out.push(m[1].trim());
  for(const f of out) console.log(path.resolve(j.cwd||process.cwd(),f));
});")

while IFS= read -r FILE; do
  [ -z "$FILE" ] && continue

  case "$FILE" in
    *.ts|*.tsx|*.js|*.jsx|*.css|*.md|*.json) ;;
    *) continue ;;
  esac

  # Determine which workspace the file belongs to
  case "$FILE" in
    */apps/web/*)     FILTER="web" ;;
    */apps/api/*)     FILTER="api" ;;
    */apps/e2e-tests/*) FILTER="e2e-tests" ;;
    */packages/shared/*) FILTER="shared" ;;
    *) continue ;;
  esac

  [ -f "$FILE" ] || continue
  pnpm --filter "$FILTER" exec prettier --write "$FILE" > /dev/null 2>&1
done <<< "$FILES"

exit 0

import fs from 'fs';
import path from 'path';

const dir = 'src/home';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.css'));
const map = {}; // class -> Set of files (top-level .home-v2 .class{ selectors only, not nested in @media)

for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  const lines = text.split('\n');
  let braceDepth = 0;
  for (const line of lines) {
    // crude @media / nested block tracking: count braces to know top-level
    const re = /^\.home-v2 \.([a-zA-Z0-9_-]+)(?:[,.\s].*)?\{/;
    if (braceDepth === 0) {
      const m = line.match(re);
      if (m) {
        const cls = m[1];
        if (!map[cls]) map[cls] = new Set();
        map[cls].add(f);
      }
    }
    for (const ch of line) {
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
    }
  }
}

const collisions = Object.entries(map).filter(([, files]) => files.size > 1);
for (const [cls, fileset] of collisions) {
  console.log(`.${cls}  ->  ${[...fileset].join(', ')}`);
}
console.log(`\n${collisions.length} cross-file collisions found (top-level selectors only, @media overrides excluded).`);

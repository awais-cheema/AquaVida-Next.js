
const fs = require('fs');
const path = require('path');

function convertToDocument(text) {
  if (!text || typeof text !== 'string') return text;
  // This is a rough JSON representation for YAML
  return `[{ "type": "paragraph", "children": [{ "text": ${JSON.stringify(text)} }] }]`;
}

function fixImagePath(p) {
  if (!p || typeof p !== 'string') return p;
  if (p.startsWith('/')) return path.basename(p);
  return p;
}

const contentDir = 'd:/Work/CTX/AquaVida-Next.js/frontend';

// List of files and fields
const configurations = [
  {
    file: 'content/pages/services.yaml',
    conversions: [
      { key: 'expertiseDescription', type: 'doc' },
      { key: 'sub', type: 'doc' },
      { key: 'quote', type: 'doc' },
      { key: 'answer', type: 'doc' },
      { key: 'image', type: 'img' }
    ]
  },
  {
    file: 'content/pages/about.yaml',
    conversions: [
      { key: 'manifesto', type: 'doc' },
      { key: 'approachQuote', type: 'doc' },
      { key: 'approachDescription', type: 'doc' },
      { key: 'desc', type: 'doc' },
      { key: 'founderBio', type: 'doc' }
    ]
  },
  {
    file: 'content/pages/portfolio-listing.yaml',
    conversions: [
      { key: 'headerDescription', type: 'doc' },
      { key: 'description', type: 'doc' },
      { key: 'ctaDescription', type: 'doc' },
      { key: 'image', type: 'img' }
    ]
  },
  {
    file: 'content/pages/privacy-policy.yaml',
    conversions: [
      { key: 'intro', type: 'doc' },
      { key: 'body', type: 'doc' }
    ]
  },
  {
    file: 'content/pages/terms-conditions.yaml',
    conversions: [
      { key: 'body', type: 'doc' }
    ]
  }
];

configurations.forEach(config => {
  const filePath = path.join(contentDir, config.file);
  if (!fs.existsSync(filePath)) return;

  let raw = fs.readFileSync(filePath, 'utf8');
  
  config.conversions.forEach(conv => {
    // Very simple regex replacement for YAML keys
    // key: "value" or key: 'value' or key: value
    const regex = new RegExp(`^(\\s*${conv.key}:\\s*)(['"]?)(.*?)(['"]?)$`, 'gm');
    raw = raw.replace(regex, (match, prefix, q1, value, q2) => {
      if (conv.type === 'doc') {
        // If it's already a JSON array, skip
        if (value.trim().startsWith('[') && value.trim().endsWith(']')) return match;
        return `${prefix}${convertToDocument(value)}`;
      } else if (conv.type === 'img') {
        const fixed = fixImagePath(value);
        return `${prefix}'${fixed}'`;
      }
      return match;
    });
  });

  fs.writeFileSync(filePath, raw);
  console.log(`Processed ${config.file}`);
});

// Also process collection directories
const collections = [
  { dir: 'content/service-pages', keys: [{k:'heroBody', t:'doc'}, {k:'overviewBody', t:'doc'}, {k:'body', t:'doc'}, {k:'answer', t:'doc'}, {k:'heroImage', t:'img'}, {k:'overviewImage', t:'img'}, {k:'ctaImage', t:'img'}] },
  { dir: 'content/portfolio', keys: [{k:'description', t:'doc'}, {k:'philosophyBody', t:'doc'}, {k:'technicalBody', t:'doc'}, {k:'answer', t:'doc'}, {k:'heroImage', t:'img'}, {k:'philosophyImage', t:'img'}, {k:'url', t:'img'}] },
  { dir: 'content/blogs', keys: [{k:'content', t:'doc'}, {k:'featured_image', t:'img'}] },
];

collections.forEach(coll => {
    const collPath = path.join(contentDir, coll.dir);
    if (!fs.existsSync(collPath)) return;

    fs.readdirSync(collPath).forEach(file => {
        if (!file.endsWith('.yaml')) return;
        const filePath = path.join(collPath, file);
        let raw = fs.readFileSync(filePath, 'utf8');
        
        coll.keys.forEach(conv => {
            const regex = new RegExp(`^(\\s*${conv.k}:\\s*)(['"]?)(.*?)(['"]?)$`, 'gm');
            raw = raw.replace(regex, (match, prefix, q1, value, q2) => {
                if (conv.t === 'doc') {
                    if (value.trim().startsWith('[') && value.trim().endsWith(']')) return match;
                    return `${prefix}${convertToDocument(value)}`;
                } else if (conv.t === 'img') {
                    const fixed = fixImagePath(value);
                    return `${prefix}'${fixed}'`;
                }
                return match;
            });
        });
        fs.writeFileSync(filePath, raw);
        console.log(`Processed ${coll.dir}/${file}`);
    });
});

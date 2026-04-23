
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Fields in each file that should be converted to Keystatic Document format
const documentFieldsMap = {
  'content/pages/about.yaml': ['manifesto', 'approachQuote', 'approachDescription', 'founderBio'],
  'content/pages/services.yaml': ['expertiseDescription', 'sub', 'quote', 'answer'], // answer is in FAQ array
  'content/pages/portfolio-listing.yaml': ['headerDescription', 'description', 'ctaDescription'], // description is in project array
  'content/pages/privacy-policy.yaml': ['intro', 'body'], // body is in sections array
  'content/pages/terms-conditions.yaml': ['body'], // body is in sections array
};

const imageFieldsMap = {
  'content/pages/services.yaml': ['image'], // in arrays
  'content/pages/portfolio-listing.yaml': ['image'], // in arrays
};

function convertToDocument(text) {
  if (!text || typeof text !== 'string') return text;
  return [
    {
      type: 'paragraph',
      children: [{ text: text }],
    },
  ];
}

function processValue(obj, keys, processor) {
  if (!obj || typeof obj !== 'object') return;

  for (const key in obj) {
    if (keys.includes(key)) {
      obj[key] = processor(obj[key]);
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach(item => processValue(item, keys, processor));
    } else if (typeof obj[key] === 'object') {
      processValue(obj[key], keys, processor);
    }
  }
}

function fixImagePath(pathStr) {
  if (!pathStr || typeof pathStr !== 'string') return pathStr;
  // If it's a full path but we just want the filename
  if (pathStr.startsWith('/images/') || pathStr.startsWith('/blog-images/') || pathStr.startsWith('/seo-images/')) {
    return path.basename(pathStr);
  }
  return pathStr;
}

const contentDir = 'd:/Work/CTX/AquaVida-Next.js/frontend';

Object.keys(documentFieldsMap).forEach(fileRelPath => {
  const filePath = path.join(contentDir, fileRelPath);
  if (!fs.existsSync(filePath)) return;

  try {
    const content = yaml.load(fs.readFileSync(filePath, 'utf8'));
    const docFields = documentFieldsMap[fileRelPath];
    const imgFields = imageFieldsMap[fileRelPath] || [];

    processValue(content, docFields, convertToDocument);
    processValue(content, imgFields, fixImagePath);

    fs.writeFileSync(filePath, yaml.dump(content));
    console.log(`Converted ${fileRelPath}`);
  } catch (e) {
    console.error(`Error processing ${fileRelPath}:`, e);
  }
});

// Also handle collection items in content/service-pages and content/portfolio and content/blogs
const collections = [
  { dir: 'content/service-pages', docFields: ['heroBody', 'overviewBody', 'body', 'answer'], imgFields: ['heroImage', 'overviewImage', 'investmentImage', 'ctaImage'] },
  { dir: 'content/portfolio', docFields: ['description', 'philosophyBody', 'technicalBody', 'answer'], imgFields: ['heroImage', 'philosophyImage', 'url'] },
  { dir: 'content/blogs', docFields: ['content'], imgFields: ['featured_image'] },
];

collections.forEach(coll => {
  const collDir = path.join(contentDir, coll.dir);
  if (!fs.existsSync(collDir)) return;

  fs.readdirSync(collDir).forEach(file => {
    if (!file.endsWith('.yaml') && !file.endsWith('.md')) return;
    const filePath = path.join(collDir, file);
    
    // For blogs/docs that might be .md, we need to be careful. 
    // But Keystatic collection entries with fields.document often use YAML for frontmatter and separate files or inline JSON.
    // Assuming YAML for now as that's what I saw in list_dir for blogs earlier.
    
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        let content;
        if (file.endsWith('.yaml')) {
            content = yaml.load(raw);
        } else {
            // Very simple frontmatter parser for .md
            const parts = raw.split('---');
            if (parts.length >= 3) {
                content = yaml.load(parts[1]);
            } else return;
        }

        processValue(content, coll.docFields, convertToDocument);
        processValue(content, coll.imgFields, fixImagePath);

        if (file.endsWith('.yaml')) {
            fs.writeFileSync(filePath, yaml.dump(content));
        } else {
             const parts = raw.split('---');
             parts[1] = '\n' + yaml.dump(content);
             fs.writeFileSync(filePath, parts.join('---'));
        }
        console.log(`Converted collection item ${coll.dir}/${file}`);
    } catch (e) {
        console.error(`Error processing collection item ${coll.dir}/${file}:`, e);
    }
  });
});

import { config, fields, collection, singleton } from '@keystatic/core'

/* ── Reusable Rich Text Field (WordPress-Style) ────────────────── */
const richText = (label: string, options: any = {}) => fields.document({
  label,
  formatting: {
    headingLevels: [1, 2, 3, 4, 5, 6],
    inlineMarks: {
      bold: true,
      italic: true,
      underline: true,
      strikethrough: true,
      code: true,
      superscript: true,
      subscript: true,
    },
    listTypes: {
      ordered: true,
      unordered: true,
    },
    alignment: {
      center: true,
      end: true,
    },
    blockTypes: {
      blockquote: true,
      code: true,
    },
    softBreaks: true,
  },
  dividers: true,
  links: true,
  ...options,
})

/* ═══════════════════════════════════════════════════════════════════════════
   Shared SEO fields — embedded in every content type (WordPress-style).
   Priority: inline SEO > per-page SEO collection entry > fallback defaults
   ═══════════════════════════════════════════════════════════════════════════ */
const seoFieldsDef = {
  seoTitle: fields.text({
    label: 'SEO — Meta Title',
    description: '50–60 characters recommended. Leave blank to use page default.',
  }),
  seoDescription: fields.text({
    label: 'SEO — Meta Description',
    multiline: true,
    description: '150–160 characters recommended.',
  }),
  seoKeywords: fields.text({
    label: 'SEO — Focus Keywords',
    description: 'Comma-separated, e.g. "pool construction, fiberglass pools"',
  }),
  ogTitle: fields.text({
    label: 'SEO — Open Graph Title',
    description: 'Falls back to Meta Title if blank',
  }),
  ogDescription: fields.text({
    label: 'SEO — Open Graph Description',
    multiline: true,
  }),
  ogImage: fields.image({
    label: 'SEO — Open Graph Image (1200×630)',
    directory: 'public/seo-images',
    publicPath: '/seo-images/',
  }),
  seoNoIndex: fields.checkbox({ label: 'SEO — No Index', defaultValue: false }),
  seoNoFollow: fields.checkbox({ label: 'SEO — No Follow', defaultValue: false }),
  seoCanonicalUrl: fields.text({
    label: 'SEO — Canonical URL',
    description: 'Leave blank to use the automatic page URL',
  }),

  /* ── Internal Linking (interlinking between site pages) ──────────── */
  internalLinks: fields.array(
    fields.object({
      anchorText: fields.text({ label: 'Anchor Text', description: 'The clickable link text (keyword-rich)' }),
      targetUrl: fields.text({ label: 'Target Page URL', description: 'Internal path, e.g. /services/pool-construction' }),
      context: fields.text({ label: 'Context / Placement Note', description: 'Where this link should appear (e.g. "in introduction paragraph")' }),
    }),
    {
      label: 'Internal Links (SEO Interlinking)',
      itemLabel: props => `${props.fields.anchorText.value} → ${props.fields.targetUrl.value}`,
    },
  ),

  /* ── External Linking (outbound authority links) ────────────────── */
  externalLinks: fields.array(
    fields.object({
      anchorText: fields.text({ label: 'Anchor Text' }),
      url: fields.text({ label: 'External URL', description: 'Full URL, e.g. https://example.com' }),
      rel: fields.select({
        label: 'Rel Attribute',
        options: [
          { label: 'Follow (passes SEO juice)', value: 'follow' },
          { label: 'No Follow (no SEO juice)', value: 'nofollow' },
          { label: 'Sponsored', value: 'sponsored' },
          { label: 'UGC (User Generated Content)', value: 'ugc' },
        ],
        defaultValue: 'nofollow',
      }),
      newTab: fields.checkbox({ label: 'Open in New Tab', defaultValue: true }),
      context: fields.text({ label: 'Context / Placement Note' }),
    }),
    {
      label: 'External Links (Outbound)',
      itemLabel: props => `${props.fields.anchorText.value} → ${props.fields.url.value}`,
    },
  ),
}

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'aquavida/aquavida-site',
  },

  ui: {
    brand: { name: 'AquaVida Admin' },
    navigation: {
      'Blog': ['blogs', 'blogSettings'],
      'Portfolio': ['portfolioProjects', 'portfolioListingPage'],
      'Services': ['servicePages', 'servicesPage'],
      'Pages': ['homePage', 'aboutPage', 'contactPage', 'financePage', 'privacyPolicy', 'termsConditions'],
      'Footer': ['footerSettings'],
      'SEO — Global': ['globalSeo'],
      'SEO — Per Page': ['pageSeo'],
    },
  },

  /* ═══════════════════════════════════════════════════════ COLLECTIONS ═══ */

  collections: {

    /* ── Blog posts ────────────────────────────────────────────────────── */
    blogs: collection({
      label: 'Blog Posts',
      slugField: 'slug',
      path: 'content/blogs/*',
      schema: {
        slug: fields.slug({
          name: { label: 'Post Title', description: 'Generates the URL slug automatically' },
        }),
        title: fields.text({
          label: 'Display Title',
          description: 'Full title shown to readers (can differ from the slug)',
        }),
        excerpt: fields.text({
          label: 'Excerpt',
          multiline: true,
          description: '1–2 sentence summary shown in the blog listing',
        }),
        content: richText('Body Content', {
          images: {
            directory: 'public/blog-images',
            publicPath: '/blog-images/',
          },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Blog', value: 'Blog' },
          ],
          defaultValue: 'Blog',
        }),
        author_name: fields.text({ label: 'Author Name' }),
        published_at: fields.text({
          label: 'Publish Date',
          description: 'ISO 8601 format, e.g. 2025-04-20',
        }),
        read_time: fields.text({
          label: 'Read Time',
          description: 'e.g. 5 min read',
          defaultValue: '5 min read',
        }),
        featured_image: fields.image({
          label: 'Featured Image',
          description: 'Cover image shown in the blog listing and at the top of the post',
          directory: 'public/blog-images',
          publicPath: '/blog-images/',
        }),
        is_featured: fields.checkbox({
          label: 'Featured Post',
          description: 'Displays this post as the hero card on the blog listing page',
          defaultValue: false,
        }),
        ...seoFieldsDef,
      },
    }),

    /* ── Per-page SEO ──────────────────────────────────────────────────── */
    pageSeo: collection({
      label: 'Page SEO',
      slugField: 'slug',
      path: 'content/seo/pages/*',
      schema: {
        slug: fields.slug({
          name: { label: 'Page', description: 'Route path, e.g. "home", "about", "services/pavers"' },
        }),
        title: fields.text({ label: 'Meta Title', description: '50–60 characters recommended' }),
        description: fields.text({
          label: 'Meta Description',
          multiline: true,
          description: '150–160 characters recommended',
        }),
        keywords: fields.text({
          label: 'Focus Keywords',
          description: 'Comma-separated, e.g. "pool construction, fiberglass pools"',
        }),
        ogTitle: fields.text({
          label: 'Open Graph Title',
          description: 'Falls back to Meta Title if blank',
        }),
        ogDescription: fields.text({
          label: 'Open Graph Description',
          multiline: true,
          description: 'Falls back to Meta Description if blank',
        }),
        ogImage: fields.image({
          label: 'Open Graph Image',
          description: '1200×630 px — overrides the global default OG image',
          directory: 'public/seo-images',
          publicPath: '/seo-images/',
        }),
        canonicalUrl: fields.text({
          label: 'Canonical URL',
          description: 'Leave blank to use the page URL. Set only when this page duplicates another.',
        }),
        noIndex: fields.checkbox({ label: 'No Index', defaultValue: false }),
        noFollow: fields.checkbox({ label: 'No Follow', defaultValue: false }),
        structuredData: fields.text({
          label: 'Page JSON-LD',
          multiline: true,
          description: 'Custom schema.org markup for this page only',
        }),
        internalLinks: fields.array(
          fields.object({
            anchorText: fields.text({ label: 'Anchor Text', description: 'Visible link label, e.g. "Pool Construction"' }),
            href: fields.text({ label: 'URL', description: 'Internal path, e.g. /services/pool-construction' }),
            description: fields.text({ label: 'Short Description (optional)', multiline: true }),
          }),
          { label: 'Internal Links (Related Pages)', itemLabel: props => props.fields.anchorText.value }
        ),
        breadcrumbs: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'URL' }),
          }),
          { label: 'Breadcrumb Trail', description: 'Used for BreadcrumbList schema — list from Home → … → This Page', itemLabel: props => props.fields.label.value }
        ),
        lastReviewed: fields.text({
          label: 'Last SEO Review Date',
          description: 'Internal tracking, e.g. 2025-04-20',
        }),
      },
    }),

    /* ── Service sub-pages ────────────────────────────────────────────── */
    servicePages: collection({
      label: 'Service Sub-Pages',
      slugField: 'slug',
      path: 'content/service-pages/*',
      schema: {
        slug: fields.slug({
          name: { label: 'Service Slug', description: 'Matches the URL, e.g. pool-construction, pavers' },
        }),

        accentColor: fields.text({ label: 'Accent Color (hex)', description: 'e.g. #3a9fd4' }),
        accentRgb: fields.text({ label: 'Accent RGB', description: 'e.g. 58,159,212' }),

        heroLabel: fields.text({ label: 'Hero Label', description: 'Small top label, e.g. "Premier Pool Construction — Dallas, TX"' }),
        heroTitle: fields.text({ label: 'Hero Title' }),
        heroHighlight: fields.text({ label: 'Hero Highlight (accent word/phrase)' }),
        heroBody: richText('Hero Body Text'),
        heroImage: fields.image({ label: 'Hero Image Path', directory: 'public/images/services', publicPath: '/images/services/' }),

        overviewTitle: fields.text({ label: 'Overview Title' }),
        overviewBody: richText('Overview Body'),
        overviewImage: fields.image({ label: 'Overview Image Path', directory: 'public/images/services', publicPath: '/images/services/' }),

        processTitle: fields.text({ label: 'Process Section Title' }),
        processSteps: fields.array(
          fields.object({
            title: fields.text({ label: 'Step Title' }),
            body: richText('Step Description'),
          }),
          { label: 'Process Steps', itemLabel: props => props.fields.title.value }
        ),

        investmentTitle: fields.text({ label: 'Investment Section Title' }),
        investmentBody: richText('Investment Body'),
        investmentImage: fields.image({ label: 'Investment Image Path', directory: 'public/images/services', publicPath: '/images/services/' }),

        servicesTitle: fields.text({ label: 'Services Section Title' }),
        servicesItems: fields.array(
          fields.object({
            title: fields.text({ label: 'Service Item Title' }),
            body: richText('Service Item Description'),
          }),
          { label: 'Service Items', itemLabel: props => props.fields.title.value }
        ),

        featuresTitle: fields.text({ label: 'Features Section Title' }),
        features: fields.array(
          fields.object({
            title: fields.text({ label: 'Feature Title' }),
            body: richText('Feature Description'),
          }),
          { label: 'Features (icons stay in code)', itemLabel: props => props.fields.title.value }
        ),

        standardsTitle: fields.text({ label: 'Standards Section Title' }),
        standards: fields.array(
          fields.object({
            title: fields.text({ label: 'Standard Title' }),
            body: richText('Standard Description'),
          }),
          { label: 'Standards', itemLabel: props => props.fields.title.value }
        ),

        ctaTitle: fields.text({ label: 'CTA Title' }),
        ctaBody: richText('CTA Body'),
        ctaImage: fields.image({ label: 'CTA Image Path', directory: 'public/images/services', publicPath: '/images/services/' }),

        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: richText('Answer'),
          }),
          { label: 'FAQ Items', itemLabel: props => props.fields.question.value }
        ),
        ...seoFieldsDef,
      },
    }),

    /* ── Portfolio projects ───────────────────────────────────────────── */
    portfolioProjects: collection({
      label: 'Portfolio Projects',
      slugField: 'slug',
      path: 'content/portfolio/*',
      schema: {
        slug: fields.slug({
          name: { label: 'Project Slug', description: 'Matches the URL, e.g. brycewood, montalcino' },
        }),

        title: fields.text({ label: 'Project Title' }),
        description: richText('Description'),
        heroImage: fields.image({ label: 'Hero Image Path', directory: 'public/images/portfolio', publicPath: '/images/portfolio/' }),
        location: fields.text({ label: 'Location', description: 'e.g. Seattle, WA' }),
        year: fields.text({ label: 'Year', description: 'e.g. 2024' }),
        category: fields.text({ label: 'Category', description: 'e.g. Crystalline Architecture' }),

        philosophyTitle: fields.text({ label: 'Philosophy Section Title' }),
        philosophyBody: richText('Philosophy Body'),
        philosophyImage: fields.image({ label: 'Philosophy Image Path', directory: 'public/images/portfolio', publicPath: '/images/portfolio/' }),

        gallery: fields.array(
          fields.object({
            url: fields.image({ label: 'Image Path', directory: 'public/images/portfolio', publicPath: '/images/portfolio/' }),
            title: fields.text({ label: 'Image Title' }),
            spec: fields.text({ label: 'Spec/Caption' }),
            size: fields.text({ label: 'Grid Size Class', description: 'Tailwind class, e.g. col-span-2 row-span-1' }),
          }),
          { label: 'Gallery Images', itemLabel: props => props.fields.title.value }
        ),

        technicalTitle: fields.text({ label: 'Technical Section Title' }),
        technicalBody: richText('Technical Body'),
        accentColor: fields.text({ label: 'Accent Color (hex)', description: 'e.g. #D4AF37' }),

        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: richText('Answer'),
          }),
          { label: 'FAQ Items', itemLabel: props => props.fields.question.value }
        ),
        ...seoFieldsDef,
      },
    }),
  },

  /* ════════════════════════════════════════════════════════ SINGLETONS ═══ */

  singletons: {

    /* ── Global SEO ────────────────────────────────────────────────────── */
    globalSeo: singleton({
      label: 'Global SEO Settings',
      path: 'content/seo/global',
      schema: {
        siteName: fields.text({ label: 'Site Name', defaultValue: 'AquaVida Pools and Spas' }),
        defaultTitle: fields.text({ label: 'Default Title', defaultValue: 'AquaVida Pools and Spas' }),
        titleTemplate: fields.text({
          label: 'Title Template',
          defaultValue: '%s | AquaVida Pools and Spas',
          description: 'Use %s as placeholder for the page title',
        }),
        defaultDescription: fields.text({
          label: 'Default Meta Description',
          multiline: true,
          defaultValue: 'AquaVida blends cutting-edge technology with ocean-inspired design.',
          description: '150–160 characters recommended',
        }),
        siteUrl: fields.text({ label: 'Site URL', defaultValue: 'https://aquavidapools.com' }),
        defaultOgImage: fields.image({
          label: 'Default OG Image',
          description: '1200×630 px fallback image',
          directory: 'public/seo-images',
          publicPath: '/seo-images/',
        }),
        twitterHandle: fields.text({ label: 'Twitter / X Handle', description: 'e.g. @aquavidapools' }),
        googleVerification: fields.text({
          label: 'Google Search Console Verification',
          defaultValue: 'wcjVQ-27D9k6VhuenwGqKiTUwiZjb-AcF51SL3LJ_wY',
        }),
        bingVerification: fields.text({ label: 'Bing Webmaster Verification' }),
        googleAnalyticsId: fields.text({ label: 'Google Analytics ID', description: 'e.g. G-XXXXXXXXXX' }),
        googleTagManagerId: fields.text({ label: 'Google Tag Manager ID', description: 'e.g. GTM-XXXXXXX' }),
        clarityId: fields.text({ label: 'Microsoft Clarity ID', defaultValue: 'vke7bmqua4' }),
        defaultRobots: fields.select({
          label: 'Default Robots Directive',
          options: [
            { label: 'Index, Follow (recommended)', value: 'index,follow' },
            { label: 'No Index, No Follow', value: 'noindex,nofollow' },
            { label: 'Index, No Follow', value: 'index,nofollow' },
            { label: 'No Index, Follow', value: 'noindex,follow' },
          ],
          defaultValue: 'index,follow',
        }),
        schemaOrg: fields.text({
          label: 'Global JSON-LD',
          multiline: true,
          description: 'Organization / LocalBusiness schema applied site-wide',
        }),
      },
    }),

    /* ── Home page ──────────────────────────────────────────────────────── */
    homePage: singleton({
      label: 'Home Page',
      path: 'content/pages/home',
      schema: {
        ...seoFieldsDef,
      },
    }),

    /* ── About page content ────────────────────────────────────────────── */
    aboutPage: singleton({
      label: 'About Page Content',
      path: 'content/pages/about',
      schema: {
        heroTagline: fields.text({
          label: 'Hero Tagline',
          defaultValue: 'Passionately shaping backyards into timeless designs',
        }),
        manifesto: richText('Manifesto Text'),
        approachQuote: richText('Approach Section Quote'),
        approachDescription: richText('Approach Description'),
        beliefs: fields.array(
          fields.object({
            word: fields.text({ label: 'Belief Word' }),
            pill: fields.text({ label: 'Floating Pill Text' }),
          }),
          {
            label: 'Beliefs',
            itemLabel: props => props.fields.word.value,
          },
        ),
        valuesHeading: fields.text({
          label: 'Values Section Heading',
          multiline: true,
          defaultValue:
            'Everything we create is rooted in our values, we do not just build, we build with purpose',
        }),
        values: fields.array(
          fields.object({
            title: fields.text({ label: 'Value Title' }),
            desc: richText('Description'),
          }),
          {
            label: 'Values',
            itemLabel: props => props.fields.title.value,
          },
        ),
        founderBio: richText('Founder Bio'),
        founderName: fields.text({ label: 'Founder Name', defaultValue: 'Hassan Bari' }),
        founderRole: fields.text({ label: 'Founder Role', defaultValue: 'CEO & Founder' }),
        founderImage: fields.image({
          label: 'Founder Image Path',
          directory: 'public/images/founder',
          publicPath: '/images/founder/',
        }),
        ...seoFieldsDef,
      },
    }),

    /* ── Services page content ─────────────────────────────────────────── */
    servicesPage: singleton({
      label: 'Services Page Content',
      path: 'content/pages/services',
      schema: {
        /* Hero */
        heroImage: fields.text({ label: 'Hero Background Image', description: 'Path or full URL for the hero background image' }),
        heroTitle: fields.text({ label: 'Hero Title (left)', defaultValue: 'Our' }),
        heroTitleRight: fields.text({ label: 'Hero Title (right)', defaultValue: 'Services' }),

        /* Expertise heading */
        expertiseLabel: fields.text({ label: 'Expertise Label', defaultValue: 'Services' }),
        expertiseTitle: fields.text({ label: 'Expertise Heading', defaultValue: 'Our Area of Expertise Space' }),
        expertiseDescription: richText('Expertise Description'),

        /* Service cards */
        services: fields.array(
          fields.object({
            title: fields.text({ label: 'Service Name' }),
            sub: richText('Subtitle'),
            href: fields.text({ label: 'URL Path', description: 'e.g. /services/pool-construction' }),
            image: fields.image({ label: 'Image Path', directory: 'public/images/services', publicPath: '/images/services/' }),
            accent: fields.text({ label: 'Accent Color (hex)', description: 'e.g. #0d5699' }),
          }),
          {
            label: 'Service Cards',
            itemLabel: props => props.fields.title.value,
          },
        ),

        /* Core Principles */
        corePrinciplesTitle: fields.text({ label: 'Core Principles Section Title', defaultValue: 'Our Core Principles' }),
        corePrinciples: fields.array(
          fields.object({
            label: fields.text({ label: 'Number Label', description: 'e.g. 01' }),
            line1: fields.text({ label: 'Globe Text — Line 1' }),
            line2: fields.text({ label: 'Globe Text — Line 2' }),
            title: fields.text({ label: 'Full Title' }),
            sub: richText('Description'),
            image: fields.image({ label: 'Background Image Path', directory: 'public/images/services', publicPath: '/images/services/' }),
          }),
          {
            label: 'Core Principles (4 quadrants)',
            itemLabel: props => props.fields.title.value,
          },
        ),

        /* Testimonials */
        testimonials: fields.array(
          fields.object({
            client: fields.text({ label: 'Client Name' }),
            location: fields.text({ label: 'Location', description: 'e.g. Frisco, TX' }),
            type: fields.text({ label: 'Service Type', description: 'e.g. Pool Construction · Outdoor Kitchen' }),
            quote: richText('Testimonial Quote'),
            image: fields.image({ label: 'Photo Path', directory: 'public/images/testimonials', publicPath: '/images/testimonials/' }),
          }),
          {
            label: 'Testimonials',
            itemLabel: props => props.fields.client.value,
          },
        ),

        /* CTA section */
        ctaLabel: fields.text({ label: 'CTA Label', defaultValue: 'What We Do' }),
        ctaHeading: fields.text({ label: 'CTA Heading', defaultValue: 'Bring Your Vision to Life— Connect with AquaVida Today' }),
        ctaButtonText: fields.text({ label: 'CTA Button Text', defaultValue: 'Send Your Inquiry' }),
        ctaButtonHref: fields.text({ label: 'CTA Button Link', defaultValue: '/contact' }),

        /* FAQ */
        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: richText('Answer'),
          }),
          {
            label: 'FAQ Items',
            itemLabel: props => props.fields.question.value,
          },
        ),
        comparison: fields.array(
          fields.object({
            feature: fields.text({ label: 'Feature Name' }),
            vistafi: fields.text({ label: 'Vistafi Value' }),
            lyon: fields.text({ label: 'Lyon Value' }),
            hfs: fields.text({ label: 'HFS Value' }),
            viking: fields.text({ label: 'Viking Value' }),
            heloc: fields.text({ label: 'HELOC Value' }),
          }),
          {
            label: 'Comparison Table',
            itemLabel: props => props.fields.feature.value,
          },
        ),
        ...seoFieldsDef,
      },
    }),

    /* ── Contact page content ──────────────────────────────────────────── */
    contactPage: singleton({
      label: 'Contact Page Content',
      path: 'content/pages/contact',
      schema: {
        heading: fields.text({
          label: 'Page Heading',
          defaultValue: "Let's Create Spaces That Inspire",
        }),
        address: fields.text({
          label: 'Address',
          defaultValue: '2100 N Greenville Ave, Richardson, TX 75082, USA',
        }),
        phone: fields.text({
          label: 'Phone Number',
          defaultValue: '+1 469-587-6255',
        }),
        services: fields.array(
          fields.object({
            id: fields.text({ label: 'Service ID (URL slug)' }),
            label: fields.text({ label: 'Display Label' }),
          }),
          {
            label: 'Service Dropdown Options',
            itemLabel: props => props.fields.label.value,
          },
        ),
        ...seoFieldsDef,
      },
    }),

    /* ── Finance page content ──────────────────────────────────────────── */
    financePage: singleton({
      label: 'Finance Page Content',
      path: 'content/pages/finance',
      schema: {
        partners: fields.array(
          fields.object({
            key: fields.text({ label: 'Unique Key (no spaces)' }),
            name: fields.text({ label: 'Partner Name' }),
            subtitle: fields.text({ label: 'Subtitle' }),
            details: fields.text({ label: 'Details Line' }),
            insight: richText('Insight Paragraph'),
            features: fields.array(
              fields.text({ label: 'Feature' }),
              { label: 'Features', itemLabel: props => props.value }
            ),
            logo: fields.text({ label: 'Logo Path', description: 'Path from /public, e.g. /vistafi.png' }),
            href: fields.text({ label: 'Link URL' }),
            ctaLabel: fields.text({ label: 'CTA Button Label (optional)', defaultValue: '' }),
          }),
          {
            label: 'Financing Partners',
            itemLabel: props => props.fields.name.value,
          },
        ),
        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: richText('Answer'),
          }),
          {
            label: 'FAQ Items',
            itemLabel: props => props.fields.question.value,
          },
        ),
        ...seoFieldsDef,
      },
    }),

    /* ── Privacy Policy content ────────────────────────────────────────── */
    privacyPolicy: singleton({
      label: 'Privacy Policy Content',
      path: 'content/pages/privacy-policy',
      schema: {
        effectiveDate: fields.text({
          label: 'Effective Date',
          defaultValue: 'January 1, 2026',
        }),
        intro: richText('Intro Paragraph'),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Section Heading' }),
            body: richText('Main Paragraph'),
            items: fields.array(
              fields.text({ label: 'List Item' }),
              { label: 'List Items (optional)', itemLabel: props => props.value }
            ),
          }),
          {
            label: 'Policy Sections',
            itemLabel: props => props.fields.heading.value,
          },
        ),
        ...seoFieldsDef,
      },
    }),

    /* ── Terms & Conditions content ────────────────────────────────────── */
    termsConditions: singleton({
      label: 'Terms & Conditions Content',
      path: 'content/pages/terms-conditions',
      schema: {
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Section Heading' }),
            body: richText('Section Body'),
          }),
          {
            label: 'Sections',
            itemLabel: props => props.fields.heading.value,
          },
        ),
        ...seoFieldsDef,
      },
    }),

    /* ── Footer settings ───────────────────────────────────────────────── */
    footerSettings: singleton({
      label: 'Footer Settings',
      path: 'content/footer',
      schema: {
        address: fields.text({
          label: 'Address',
          defaultValue: '2100 N Greenville Ave., Richardson, TX 75082, USA',
        }),
        googleMapsUrl: fields.text({
          label: 'Google Maps URL',
          defaultValue: 'https://maps.app.goo.gl/Vv5TYqKWVKtWKj4q7',
        }),
        phone: fields.text({
          label: 'Phone (display)',
          defaultValue: '+1 469-587-6255',
        }),
        phoneHref: fields.text({
          label: 'Phone (tel: href)',
          defaultValue: 'tel:+14695876255',
        }),
        instagramUrl: fields.text({
          label: 'Instagram URL',
          defaultValue: 'https://www.instagram.com/aquavida.us?igsh=MWxxOGE1a3I3MGp5',
        }),
        facebookUrl: fields.text({
          label: 'Facebook URL',
          defaultValue: 'https://www.facebook.com/share/17zSuCHyWT/',
        }),
        copyrightText: fields.text({
          label: 'Copyright Text',
          defaultValue: '© 2026 AQUAVIDA POOLS AND SPAS. ALL RIGHTS RESERVED.',
        }),
        exploreLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'Link URL' }),
          }),
          { label: 'Explore Column Links', itemLabel: props => props.fields.label.value }
        ),
        serviceLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'Link URL' }),
          }),
          { label: 'Services Column Links', itemLabel: props => props.fields.label.value }
        ),
        informationLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'Link URL' }),
          }),
          { label: 'Information Column Links', itemLabel: props => props.fields.label.value }
        ),
      },
    }),

    /* ── Portfolio listing page ─────────────────────────────────────────── */
    portfolioListingPage: singleton({
      label: 'Portfolio Listing Page',
      path: 'content/pages/portfolio-listing',
      schema: {
        /* Header */
        headerLabel: fields.text({ label: 'Header Label', defaultValue: 'ARCHITECTURAL ARCHIVE' }),
        headerTitle: fields.text({ label: 'Header Title', defaultValue: 'The Liquid Portfolio' }),
        headerDescription: richText('Header Description'),
        curationLabel: fields.text({ label: 'Stat 1 Label', defaultValue: 'Curation' }),
        curationValue: fields.text({ label: 'Stat 1 Value', defaultValue: 'Volume III' }),
        focusLabel: fields.text({ label: 'Stat 2 Label', defaultValue: 'Focus' }),
        focusValue: fields.text({ label: 'Stat 2 Value', defaultValue: 'Infinite Edge' }),

        /* Project cards */
        projects: fields.array(
          fields.object({
            slug: fields.text({ label: 'URL Slug', description: 'e.g. brycewood — must match portfolio route' }),
            name: fields.text({ label: 'Project Name' }),
            category: fields.text({ label: 'Category' }),
            year: fields.text({ label: 'Year' }),
            location: fields.text({ label: 'Location' }),
            description: richText('Card Description'),
            image: fields.image({ label: 'Card Image Path', directory: 'public/images/portfolio', publicPath: '/images/portfolio/' }),
            gridSize: fields.text({ label: 'Grid Size Classes', description: 'e.g. col-span-2 row-span-2' }),
            color: fields.text({ label: 'Accent Color (hex)', description: 'e.g. #91792C' }),
          }),
          {
            label: 'Portfolio Grid Cards',
            itemLabel: props => props.fields.name.value,
          },
        ),

        /* CTA section */
        ctaTitle: fields.text({ label: 'CTA Title', defaultValue: 'Next Generation Pool Design' }),
        ctaDescription: richText('CTA Description'),
        ctaButtonText: fields.text({ label: 'CTA Button Text', defaultValue: 'Begin Your Project' }),
        ctaButtonHref: fields.text({ label: 'CTA Button Link', defaultValue: '/contact' }),

        /* FAQ */
        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: richText('Answer'),
          }),
          {
            label: 'FAQ Items',
            itemLabel: props => props.fields.question.value,
          },
        ),
        ...seoFieldsDef,
      },
    }),

    /* ── Blog listing page FAQ ─────────────────────────────────────────── */
    blogSettings: singleton({
      label: 'Blog Page Settings',
      path: 'content/pages/blog',
      schema: {
        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: richText('Answer'),
          }),
          {
            label: 'FAQ Items',
            itemLabel: props => props.fields.question.value,
          },
        ),
        categories: fields.array(
          fields.text({ label: 'Category Name' }),
          {
            label: 'Filter Categories',
            itemLabel: props => props.value,
          }
        ),
        ...seoFieldsDef,
      },
    }),
  },
})

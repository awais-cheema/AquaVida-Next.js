import { config, fields, collection, singleton } from '@keystatic/core'
import { richText, shadowPreviewField, seoFieldsDef } from '@/lib/cms-fields'
import SimplePreview from '@/components/cms/previews/SimplePreview'
import BlogPostPreview from '@/components/cms/previews/BlogPostPreview'

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'awais-cheema',
      name: 'AquaVida-Next.js',
    },
  },

  ui: {
    brand: { name: 'AquaVida' },
    navigation: {
      'Blog': ['posts', 'blogSettings'],
      'Portfolio': ['portfolioProjects', 'portfolioListingPage'],
      'Services': ['servicePages', 'servicesPage'],
      'Pages': ['homePage', 'aboutPage', 'contactPage', 'financePage', 'privacyPolicy', 'termsConditions'],
      'Footer': ['footerSettings'],
      'SEO — Global': ['globalSeo'],
      'SEO — Per Page': ['pageSeo'],
    },
  },

  collections: {
    /* ── Posts ────────────────────────────────────────────────────────── */
    posts: collection({
      label: 'Blog Posts',
      slugField: 'slug',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      // @ts-ignore
      preview: props => <BlogPostPreview fields={props.fields} />,
      schema: {
        shadowPreview: shadowPreviewField,
        slug: fields.slug({ name: { label: 'Slug' } }),
        title: fields.text({ label: 'Title' }),
        category: fields.text({ label: 'Category', defaultValue: 'Design' }),
        author_name: fields.text({ label: 'Author Name', defaultValue: 'Hassan Bari' }),
        read_time: fields.text({ label: 'Read Time', defaultValue: '5 min read' }),
        is_featured: fields.checkbox({ label: 'Is Featured Post?', defaultValue: false }),
        featured_image: fields.image({
          label: 'Featured Image',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        content: richText('Article Content'),
        published_at: fields.date({ label: 'Publish Date', defaultValue: { kind: 'today' } }),
        ...seoFieldsDef,
      },
    }),

    /* ── Per-page SEO ──────────────────────────────────────────────────── */
    pageSeo: collection({
      label: 'Page SEO',
      slugField: 'slug',
      path: 'content/seo/pages/*',
      // @ts-ignore
      preview: SimplePreview,
      schema: {
        shadowPreview: shadowPreviewField,
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
          description: 'Full URL, e.g. https://aquavidapools.com/about',
        }),
        noIndex: fields.checkbox({ label: 'No Index (Hide from search engines)' }),
        noFollow: fields.checkbox({ label: 'No Follow (Tell engines not to follow links)' }),
      },
    }),

    /* ── Service sub-pages ────────────────────────────────────────────── */
    servicePages: collection({
      label: 'Service Sub-Pages',
      slugField: 'slug',
      path: 'content/service-pages/*',
      previewUrl: '/api/preview/start?branch=main&to=/services/{slug}',
      // @ts-ignore
      preview: props => <SimplePreview {...props} to="/services" type="services" />,
      schema: {
        shadowPreview: shadowPreviewField,
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
      previewUrl: '/api/preview/start?branch=main&to=/portfolio/{slug}',
      // @ts-ignore
      preview: props => <SimplePreview {...props} to="/portfolio" type="portfolio" />,
      schema: {
        shadowPreview: shadowPreviewField,
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
      // @ts-ignore
      preview: SimplePreview,
      schema: {
        shadowPreview: shadowPreviewField,
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

    /* ── Home page content ─────────────────────────────────────────────── */
    homePage: singleton({
      label: 'Home Page Content',
      path: 'content/pages/home',
      previewUrl: '/api/preview/start?branch=main&to=/',
      // @ts-ignore
      preview: SimplePreview,
      schema: {
        shadowPreview: shadowPreviewField,
        title: fields.text({ label: 'Page Title' }),
        ...seoFieldsDef,
      },
    }),

    /* ── About page content ────────────────────────────────────────────── */
    aboutPage: singleton({
      label: 'About Page Content',
      path: 'content/pages/about',
      previewUrl: '/api/preview/start?branch=main&to=/about',
      // @ts-ignore
      preview: props => <SimplePreview {...props} to="/about" type="about" />,
      schema: {
        shadowPreview: shadowPreviewField,
        heroTagline: fields.text({ label: 'Hero Tagline' }),
        manifesto: richText('Manifesto Text'),
        approachQuote: richText('Approach Big Quote'),
        approachDescription: richText('Approach Description'),

        beliefs: fields.array(
          fields.object({
            word: fields.text({ label: 'Core Word' }),
            pill: fields.text({ label: 'Pill Label' }),
          }),
          { label: 'Beliefs', itemLabel: props => props.fields.word.value }
        ),

        valuesHeading: fields.text({ label: 'Values Section Heading' }),
        values: fields.array(
          fields.object({
            title: fields.text({ label: 'Value Title' }),
            desc: richText('Description'),
          }),
          { label: 'Our Values', itemLabel: props => props.fields.title.value }
        ),

        founderBio: richText('Founder Bio'),
        founderName: fields.text({ label: 'Founder Name', defaultValue: 'Hassan Bari' }),
        founderRole: fields.text({ label: 'Founder Role', defaultValue: 'CEO & Founder' }),
        founderImage: fields.image({
          label: 'Founder Photo',
          directory: 'public/images/about',
          publicPath: '/images/about/',
        }),
        ...seoFieldsDef,
      },
    }),

    /* ── Services page content ─────────────────────────────────────────── */
    servicesPage: singleton({
      label: 'Services Page Content',
      path: 'content/pages/services',
      previewUrl: '/api/preview/start?branch=main&to=/services',
      // @ts-ignore
      preview: props => <SimplePreview {...props} to="/services" type="services" />,
      schema: {
        shadowPreview: shadowPreviewField,
        /* Hero */
        heroImage: fields.image({ label: 'Hero Image Path', directory: 'public/images/services', publicPath: '/images/services/' }),
        heroTitle: fields.text({ label: 'Hero Title (Left)', defaultValue: 'Defining' }),
        heroTitleRight: fields.text({ label: 'Hero Title (Right)', defaultValue: 'Silhouettes' }),

        /* Expertise */
        expertiseLabel: fields.text({ label: 'Expertise Label', defaultValue: 'Architectural Domain' }),
        expertiseTitle: fields.text({ label: 'Expertise Title', defaultValue: 'Ocean-Inspired Modernism' }),
        expertiseDescription: richText('Expertise Introduction'),
        services: fields.array(
          fields.object({
            slug: fields.text({ label: 'Link Slug', description: 'URL part, e.g. "pool-construction"' }),
            title: fields.text({ label: 'Service Name' }),
            description: richText('Brief Description'),
            image: fields.image({ label: 'Card Image Path', directory: 'public/images/services', publicPath: '/images/services/' }),
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
            line1: fields.text({ label: 'Globe Text \u2014 Line 1' }),
            line2: fields.text({ label: 'Globe Text \u2014 Line 2' }),
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
            type: fields.text({ label: 'Service Type', description: 'e.g. Pool Construction \u00B7 Outdoor Kitchen' }),
            quote: richText('Testimonial Quote'),
            image: fields.image({ label: 'Photo Path', directory: 'public/images/testimonials', publicPath: '/images/testimonials/' }),
          }),
          { label: 'Client Testimonials', itemLabel: props => props.fields.client.value }
        ),

        /* FAQ */
        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: richText('Answer'),
          }),
          { label: 'FAQ Items', itemLabel: props => props.fields.question.value }
        ),

        /* CTA */
        ctaLabel: fields.text({ label: 'CTA Sub-label', defaultValue: 'COMMENCE PROJECT' }),
        ctaHeading: fields.text({ label: 'CTA Heading', defaultValue: 'Defining the Horizon of Luxury' }),
        ctaButtonText: fields.text({ label: 'CTA Button Text', defaultValue: 'Consult Advisor' }),
        ctaButtonHref: fields.text({ label: 'CTA Button Link', defaultValue: '/contact' }),
        ...seoFieldsDef,
      },
    }),

    /* ── Contact page content ──────────────────────────────────────────── */
    contactPage: singleton({
      label: 'Contact Page Content',
      path: 'content/pages/contact',
      previewUrl: '/api/preview/start?branch=main&to=/contact',
      // @ts-ignore
      preview: props => <SimplePreview {...props} to="/contact" type="contact" />,
      schema: {
        shadowPreview: shadowPreviewField,
        heading: fields.text({
          label: 'Page Heading',
          defaultValue: "Let's Create Spaces That Inspire",
        }),
        address: fields.text({
          label: 'Address',
          defaultValue: '2100 N Greenville Ave, Richardson, TX 75082, USA',
        }),
        phone: fields.text({
          label: 'Phone',
          defaultValue: '+1 469-587-6255',
        }),
        services: fields.array(
          fields.object({
            id: fields.text({ label: 'ID (slug)', description: 'e.g. pool-construction' }),
            label: fields.text({ label: 'Label' }),
          }),
          { label: 'Service Dropdown Options', itemLabel: props => props.fields.label.value }
        ),
        ...seoFieldsDef,
      },
    }),

    /* ── Finance page content ──────────────────────────────────────────── */
    financePage: singleton({
      label: 'Finance Page Content',
      path: 'content/pages/finance',
      previewUrl: '/api/preview/start?branch=main&to=/finance',
      // @ts-ignore
      preview: props => <SimplePreview {...props} to="/finance" type="finance" />,
      schema: {
        shadowPreview: shadowPreviewField,
        /* Hero */
        heroLabel: fields.text({ label: 'Hero Label', defaultValue: 'Investment Architecture' }),
        heroTitle: fields.text({ label: 'Hero Title', defaultValue: 'Intelligent Investment' }),
        heroDescription: fields.text({ label: 'Hero Description', multiline: true }),
        heroImage: fields.image({ label: 'Hero Image', directory: 'public/images/finance', publicPath: '/images/finance/' }),

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

        /* Comparison Table */
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
      previewUrl: '/api/preview/start?branch=main&to=/privacy-policy',
      // @ts-ignore
      preview: props => <SimplePreview {...props} to="/privacy-policy" type="privacy" />,
      schema: {
        shadowPreview: shadowPreviewField,
        effectiveDate: fields.text({
          label: 'Effective Date',
          defaultValue: 'January 1, 2026',
        }),
        intro: richText('Introductory Paragraph'),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Section Heading' }),
            body: richText('Section Content'),
            items: fields.array(fields.text({ label: 'List Item' }), { label: 'Bullet Points' }),
          }),
          { label: 'Policy Sections', itemLabel: props => props.fields.heading.value }
        ),
        ...seoFieldsDef,
      },
    }),

    /* ── Terms & Conditions content ────────────────────────────────────── */
    termsConditions: singleton({
      label: 'Terms & Conditions Content',
      path: 'content/pages/terms-conditions',
      previewUrl: '/api/preview/start?branch=main&to=/terms-conditions',
      // @ts-ignore
      preview: props => <SimplePreview {...props} to="/terms-conditions" type="terms" />,
      schema: {
        shadowPreview: shadowPreviewField,
        effectiveDate: fields.text({
          label: 'Effective Date',
          defaultValue: 'January 1, 2026',
        }),
        intro: richText('Introductory Paragraph'),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Section Heading' }),
            body: richText('Section Content'),
            items: fields.array(fields.text({ label: 'List Item' }), { label: 'Bullet Points' }),
          }),
          { label: 'Terms Sections', itemLabel: props => props.fields.heading.value }
        ),
        ...seoFieldsDef,
      },
    }),

    /* ── Footer settings ────────────────────────────────────────────────── */
    footerSettings: singleton({
      label: 'Footer Settings',
      path: 'content/footer/settings',
      // @ts-ignore
      preview: SimplePreview,
      schema: {
        shadowPreview: shadowPreviewField,
        tagline: fields.text({ label: 'Footer Tagline', defaultValue: 'Designing the Horizon of Luxury' }),
        copyright: fields.text({ label: 'Copyright Text', defaultValue: '\u00A9 2024 AquaVida Pools and Spas' }),
        socialLinks: fields.array(
          fields.object({
            platform: fields.text({ label: 'Platform Name' }),
            url: fields.text({ label: 'Profile URL' }),
          }),
          { label: 'Social Media Links', itemLabel: props => props.fields.platform.value }
        ),
        infoLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Link Label' }),
            url: fields.text({ label: 'Link URL' }),
          }),
          { label: 'Information Column Links', itemLabel: props => props.fields.label.value }
        ),
      },
    }),

    /* ── Portfolio listing page ─────────────────────────────────────────── */
    portfolioListingPage: singleton({
      label: 'Portfolio Listing Page',
      path: 'content/pages/portfolio-listing',
      previewUrl: '/api/preview/start?branch=main&to=/portfolio',
      // @ts-ignore
      preview: props => <SimplePreview {...props} to="/portfolio" type="portfolio" />,
      schema: {
        shadowPreview: shadowPreviewField,
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
            slug: fields.text({ label: 'URL Slug', description: 'e.g. brycewood \u2014 must match portfolio route' }),
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

    /* ── Blog listing page ─────────────────────────────────────────── */
    blogSettings: singleton({
      label: 'Blog Page Settings',
      path: 'content/pages/blog',
      previewUrl: '/api/preview/start?branch=main&to=/blog',
      // @ts-ignore
      preview: props => <SimplePreview {...props} to="/blog" type="blog" />,
      schema: {
        shadowPreview: shadowPreviewField,
        /* Header */
        headerLabel: fields.text({ label: 'Header Label', defaultValue: 'THE LIQUID MANIFESTO' }),
        headerTitle: fields.text({ label: 'Header Title', defaultValue: 'Subscribe to Design Intelligence' }),
        headerDescription: fields.text({ label: 'Header Description', multiline: true }),
        
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

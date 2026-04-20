import { config, fields, collection, singleton } from '@keystatic/core'

export default config({
  storage: {
    kind: 'local',
  },

  ui: {
    brand: { name: 'AquaVida Admin' },
    navigation: {
      'Blog': ['blogs'],
      'Page Content': ['aboutPage', 'servicesPage', 'servicePages', 'portfolioProjects', 'portfolioListingPage', 'blogSettings', 'contactPage', 'financePage', 'privacyPolicy', 'termsConditions'],
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
        content: fields.document({
          label: 'Body Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/blog-images',
            publicPath: '/blog-images/',
          },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Design', value: 'Design' },
            { label: 'Engineering', value: 'Engineering' },
            { label: 'Lighting', value: 'Lighting' },
            { label: 'Sustainability', value: 'Sustainability' },
          ],
          defaultValue: 'Design',
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
        heroBody: fields.text({ label: 'Hero Body Text', multiline: true }),
        heroImage: fields.text({ label: 'Hero Image Path', description: 'Path from /public, e.g. /images/services/pool_construction_hero.avif' }),

        overviewTitle: fields.text({ label: 'Overview Title' }),
        overviewBody: fields.text({ label: 'Overview Body', multiline: true }),
        overviewImage: fields.text({ label: 'Overview Image Path' }),

        processTitle: fields.text({ label: 'Process Section Title' }),
        processSteps: fields.array(
          fields.object({
            title: fields.text({ label: 'Step Title' }),
            body: fields.text({ label: 'Step Description', multiline: true }),
          }),
          { label: 'Process Steps', itemLabel: props => props.fields.title.value }
        ),

        investmentTitle: fields.text({ label: 'Investment Section Title' }),
        investmentBody: fields.text({ label: 'Investment Body', multiline: true }),
        investmentImage: fields.text({ label: 'Investment Image Path' }),

        servicesTitle: fields.text({ label: 'Services Section Title' }),
        servicesItems: fields.array(
          fields.object({
            title: fields.text({ label: 'Service Item Title' }),
            body: fields.text({ label: 'Service Item Description', multiline: true }),
          }),
          { label: 'Service Items', itemLabel: props => props.fields.title.value }
        ),

        featuresTitle: fields.text({ label: 'Features Section Title' }),
        features: fields.array(
          fields.object({
            title: fields.text({ label: 'Feature Title' }),
            body: fields.text({ label: 'Feature Description', multiline: true }),
          }),
          { label: 'Features (icons stay in code)', itemLabel: props => props.fields.title.value }
        ),

        standardsTitle: fields.text({ label: 'Standards Section Title' }),
        standards: fields.array(
          fields.object({
            title: fields.text({ label: 'Standard Title' }),
            body: fields.text({ label: 'Standard Description', multiline: true }),
          }),
          { label: 'Standards', itemLabel: props => props.fields.title.value }
        ),

        ctaTitle: fields.text({ label: 'CTA Title' }),
        ctaBody: fields.text({ label: 'CTA Body', multiline: true }),
        ctaImage: fields.text({ label: 'CTA Image Path' }),

        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'FAQ Items', itemLabel: props => props.fields.question.value }
        ),
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
        description: fields.text({ label: 'Description', multiline: true }),
        heroImage: fields.text({ label: 'Hero Image Path' }),
        location: fields.text({ label: 'Location', description: 'e.g. Seattle, WA' }),
        year: fields.text({ label: 'Year', description: 'e.g. 2024' }),
        category: fields.text({ label: 'Category', description: 'e.g. Crystalline Architecture' }),

        philosophyTitle: fields.text({ label: 'Philosophy Section Title' }),
        philosophyBody: fields.text({ label: 'Philosophy Body', multiline: true }),
        philosophyImage: fields.text({ label: 'Philosophy Image Path' }),

        gallery: fields.array(
          fields.object({
            url: fields.text({ label: 'Image Path' }),
            title: fields.text({ label: 'Image Title' }),
            spec: fields.text({ label: 'Spec/Caption' }),
            size: fields.text({ label: 'Grid Size Class', description: 'Tailwind class, e.g. col-span-2 row-span-1' }),
          }),
          { label: 'Gallery Images', itemLabel: props => props.fields.title.value }
        ),

        technicalTitle: fields.text({ label: 'Technical Section Title' }),
        technicalBody: fields.text({ label: 'Technical Body', multiline: true }),
        accentColor: fields.text({ label: 'Accent Color (hex)', description: 'e.g. #D4AF37' }),

        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'FAQ Items', itemLabel: props => props.fields.question.value }
        ),
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

    /* ── About page content ────────────────────────────────────────────── */
    aboutPage: singleton({
      label: 'About Page Content',
      path: 'content/pages/about',
      schema: {
        heroTagline: fields.text({
          label: 'Hero Tagline',
          defaultValue: 'Passionately shaping backyards into timeless designs',
        }),
        manifesto: fields.text({
          label: 'Manifesto Text',
          multiline: true,
          defaultValue:
            'AquaVida transforms architectural vision into built reality. We specialise in luxury pool environments that shape water, define space, and elevate design. Every project is guided by precision, craftsmanship, and a commitment to enduring beauty.',
        }),
        approachQuote: fields.text({
          label: 'Approach Section Quote',
          multiline: true,
          defaultValue:
            'Each phase of our work carries the same intent; to understand before we create, to refine before we build, and to craft with care that lasts.',
        }),
        approachDescription: fields.text({
          label: 'Approach Description',
          multiline: true,
          defaultValue:
            "We're a collective of craftsmen, engineers, and thinkers united by a deep respect for detail. Our culture is built on collaboration and care. Every project begins with understanding and ends with precision.",
        }),
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
            desc: fields.text({ label: 'Description', multiline: true }),
          }),
          {
            label: 'Values',
            itemLabel: props => props.fields.title.value,
          },
        ),
        founderBio: fields.text({
          label: 'Founder Bio',
          multiline: true,
          defaultValue:
            'Hassan Bari, CEO and Founder of AquaVida Pools and Spas. He specializes in designing luxury outdoor living spaces while offering premium custom pool construction with unparalleled craftsmanship for homeowners across America.',
        }),
        founderName: fields.text({ label: 'Founder Name', defaultValue: 'Hassan Bari' }),
        founderRole: fields.text({ label: 'Founder Role', defaultValue: 'CEO & Founder' }),
        founderImage: fields.text({
          label: 'Founder Image Path',
          defaultValue: '/Hassan-Bari-(Aquavida).avif',
          description: 'Path relative to /public, e.g. /Hassan-Bari-(Aquavida).avif',
        }),
      },
    }),

    /* ── Services page content ─────────────────────────────────────────── */
    servicesPage: singleton({
      label: 'Services Page Content',
      path: 'content/pages/services',
      schema: {
        services: fields.array(
          fields.object({
            title: fields.text({ label: 'Service Name' }),
            sub: fields.text({ label: 'Subtitle' }),
            href: fields.text({ label: 'URL Path', description: 'e.g. /services/pool-construction' }),
            image: fields.text({ label: 'Image Path', description: 'Path relative to /public' }),
            accent: fields.text({ label: 'Accent Color (hex)', description: 'e.g. #0d5699' }),
          }),
          {
            label: 'Service Cards',
            itemLabel: props => props.fields.title.value,
          },
        ),
        testimonials: fields.array(
          fields.object({
            client: fields.text({ label: 'Client Name' }),
            location: fields.text({ label: 'Location', description: 'e.g. Frisco, TX' }),
            type: fields.text({ label: 'Service Type', description: 'e.g. Pool Construction · Outdoor Kitchen' }),
            quote: fields.text({ label: 'Testimonial Quote', multiline: true }),
            image: fields.text({ label: 'Photo Path', description: 'Path relative to /public' }),
          }),
          {
            label: 'Testimonials',
            itemLabel: props => props.fields.client.value,
          },
        ),
        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          {
            label: 'FAQ Items',
            itemLabel: props => props.fields.question.value,
          },
        ),
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
            insight: fields.text({ label: 'Insight Paragraph', multiline: true }),
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
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          {
            label: 'FAQ Items',
            itemLabel: props => props.fields.question.value,
          },
        ),
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
        intro: fields.text({
          label: 'Intro Paragraph',
          multiline: true,
          defaultValue: "AquaVida Pools and Spas' Privacy Policy details how it collects, uses and safeguards personal information provided to us from visitors and clients of AquaVida Pools and Spas. By engaging our services, you agree to the data practices described.",
        }),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Section Heading' }),
            body: fields.text({ label: 'Main Paragraph', multiline: true }),
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
            body: fields.text({ label: 'Section Body', multiline: true }),
          }),
          {
            label: 'Sections',
            itemLabel: props => props.fields.heading.value,
          },
        ),
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
      },
    }),

    /* ── Portfolio listing page FAQ ────────────────────────────────────── */
    portfolioListingPage: singleton({
      label: 'Portfolio Listing Page',
      path: 'content/pages/portfolio-listing',
      schema: {
        faqItems: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          {
            label: 'FAQ Items',
            itemLabel: props => props.fields.question.value,
          },
        ),
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
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          {
            label: 'FAQ Items',
            itemLabel: props => props.fields.question.value,
          },
        ),
      },
    }),
  },
})

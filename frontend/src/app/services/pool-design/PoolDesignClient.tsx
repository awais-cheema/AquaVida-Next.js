'use client';

import ServicePageShell, { ServiceData } from '@/components/services/ServicePageShell';
import {
    Compass, Layers, Palette, Ruler,
    Eye, Cpu, Star, CheckCircle,
} from 'lucide-react';

const data: ServiceData = {
    accentColor: '#1e78b0',
    accentRgb: '30,120,176',

    heroLabel: 'Visionary Waterscapes — Dallas, TX',
    heroTitle: 'Pool Design',
    heroHighlight: 'Studio.',
    heroBody: "Every exceptional project begins with an exceptional blueprint. Our Dallas studio combines architectural vision, 3D rendering technology, and local engineering expertise to curate a pool that is uniquely yours — long before the first shovel breaks ground.",
    heroImage: '/images/services/pool_design_hero.avif',

    overviewTitle: 'Architectural Discovery',
    overviewBody: "AquaVida’s design phase is an exploration of form and function. We analyze your lifestyle, property topography, and existing architectural style to translate your vision into a technically precise, construction-ready plan. Whether it's a sleek modern infinity edge or a natural free-form retreat, our designs are optimized for Dallas soil conditions and the North Texas climate.",
    overviewImage: '/images/services/pool_design_overview.avif',


    processTitle: 'The Design Workflow',
    processSteps: [
        {
            title: 'Diagnostic Site Analysis',
            body: 'We perform a deep site audit—evaluating soil dynamics, utility corridors, and solar orientation. This technical data informs every aesthetic decision, ensuring a buildable and efficient vision.',
        },
        {
            title: '3D Virtual Modeling',
            body: "Using industry-leading rendering engines, we produce a photorealistic virtual twin of your property. You can experience the textures, lighting, and spatial flow of your new pool with absolute clarity.",
        },
        {
            title: 'Precision Engineering',
            body: 'Our studio generates full structural blueprints, hydraulic schematics, and permit-ready documents. We handle the technical friction of Dallas city codes, providing a seamless path to construction.',
        },
    ],

    investmentTitle: 'Investing in Design Intelligence',
    investmentBody: "Design is not a decorative layer; it's a cost-saving foundation. Professional blueprinting anticipates site challenges and optimizes hydraulic efficiency, preventing expensive mid-build corrections. In Dallas, architecturally designed pools command a significant premium in property value, making the design phase your highest-ROI investment during the build process.",
    investmentImage: '/images/services/pool_design_investment.avif',

    servicesTitle: 'Studio Specializations',
    servicesItems: [
        {
            title: 'Custom Modern Geometry',
            body: 'Specializing in clean lines, vanishing edges, perimeter overflows, and glass-wall integrations. We push the boundaries of what water can do in a residential setting.',
        },
        {
            title: 'Hydraulic & System Design',
            body: 'Engineering silent, high-output water features and efficient filtration loops. We design your pool’s mechanical heart to be as reliable as it is powerful.',
        },
        {
            title: 'Contextual Hardscape Planning',
            body: 'We design the entire environment—decking, specialized plantings, and adjacent structures—ensuring your pool is a cohesive part of a unified garden architecture.',
        },
    ],

    featuresTitle: 'The Design Studio Edge',
    features: [
        {
            icon: Compass,
            title: 'Master Designers',
            body: 'Our studio leads are trained in both architectural principles and APSP standards, ensuring every curve and angle has a structural justification.',
        },
        {
            icon: Eye,
            title: 'Kinetic 3D Visuals',
            body: 'Experience your pool under different lighting scenes and seasons. Our renderings account for shadow movement and water reflections for true-to-life accuracy.',
        },
        {
            icon: Layers,
            title: 'Total Document Sets',
            body: 'Electrical layouts, plumbing isometrics, and structural details. We provide the most comprehensive technical package in the Dallas market.',
        },
        {
            icon: Palette,
            title: 'Curated Materiality',
            body: 'We guide you through a selection of glass tiles, pebble finishes, and exotic stones, creating a palette that harmonizes with your home’s existing materials.',
        },
        {
            icon: Ruler,
            title: 'Expansion Engineering',
            body: "Dallas clay requires a specific structural approach. Our designs account for local soil expansion forces that standard 'template' builders often ignore.",
        },
        {
            icon: Cpu,
            title: 'Digital Core Integration',
            body: 'We pre-plan for total home automation. Control lighting, chemical levels, and temperatures via a unified digital interface designed into the project from day one.',
        },
    ],

    standardsTitle: 'Governing Standards',
    standards: [
        {
            title: 'Technical Compliance',
            body: 'Every blueprint meets or exceeds national APSP standards and rigid Dallas City permit requirements, ensuring your project passes inspection without delays.',
        },
        {
            title: 'Collaborative Refinement',
            body: 'We include structured revision cycles to ensure the design is calibrated to your exact preference. Technical perfection is our priority; your satisfaction is our mandate.',
        },
    ],

    ctaTitle: 'Architect Your Legacy',
    ctaBody: "Your journey to an iconic Dallas pool begins with a technical consultation. Contact our studio to receive a site audit and an architectural vision for your property.",
    ctaImage: '/images/services/pool_design_cta.avif',
};

import { mergeServiceData, type ServicePageOverride } from '@/lib/service-override'

export default function PoolDesignClient({ override }: { override?: ServicePageOverride | null }) {
    return <ServicePageShell d={mergeServiceData(data, override)} />;
}

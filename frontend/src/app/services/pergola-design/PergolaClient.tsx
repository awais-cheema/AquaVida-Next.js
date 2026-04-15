'use client';

import ServicePageShell, { ServiceData } from '@/components/services/ServicePageShell';
import {
    Trees, Sun, Shield, Lightbulb,
    Ruler, Star, Wind, Wrench,
} from 'lucide-react';

const data: ServiceData = {
    accentColor: '#886030',
    accentRgb: '136,96,48',

    heroLabel: 'Shadow & Structure — Dallas, TX',
    heroTitle: 'Pergola',
    heroHighlight: 'Design.',
    heroBody: "From elegant cedar structures to modern aluminum frameworks — AquaVida designs and builds custom pergolas that define your outdoor space, providing architectural shade and a stunning frame for your garden living.",
    heroImage: '/images/services/pergola_design_hero.avif',

    overviewTitle: 'Architectural Shade Engineering',
    overviewBody: "At AquaVida, we view the pergola as a critical spatial boundary. Our Dallas structures are site-specific — meticulously calculated for sun angles, prevailing winds, and sight lines. We utilize premium cedar, redwood, architectural aluminum, and composite materials to deliver structures that provide both relief from the Texas sun and a permanent design statement.",
    overviewImage: '/images/services/pergola_design_overview.avif',

    processTitle: 'The Structural Workflow',
    processSteps: [
        {
            title: 'Solar Site Analysis',
            body: 'We map your property’s sun patterns to optimize louver and beam placement. This ensure your structure provides maximum shade during peak heat hours while maintaining open-air aesthetics.',
        },
        {
            title: 'Engineering & Compliance',
            body: "We manage the entire permitting and engineering phase. Every structure is built to meet Dallas wind-load standards and structural codes, ensuring your investment is both safe and legal.",
        },
        {
            title: 'Artisan Construction',
            body: 'Our master carpenters and metalworkers execute the build with precision. From deep concrete footings to the final finish coat, we prioritize clean joinery and structural integrity.',
        },
    ],

    investmentTitle: 'Investing in Outdoor Volume',
    investmentBody: "A professionally designed pergola adds high-value functional square footage to your property. By defining an 'outdoor room,' you create a dedicated zone for entertaining and relaxation. We utilize high-performance materials like Western Red Cedar and powder-coated aluminum to ensure your structure maintains its architectural value with minimal long-term maintenance.",
    investmentImage: '/images/services/pergola_design_investment.avif',

    servicesTitle: 'Specialized Structure Services',
    servicesItems: [
        {
            title: 'Architectural Frameworks',
            body: 'Custom freestanding and house-attached structures designed to scale with your home’s geometry. We specialize in hidden-fastener methods for a clean, furniture-grade finish.',
        },
        {
            title: 'Dynamic Shade Systems',
            body: 'Integration of motorized louvered roofs, retractable canopies, and privacy screens. These systems allow you to control light levels and wind exposure at the touch of a button.',
        },
        {
            title: 'Atmospheric Integration',
            body: 'Full-service lighting, cooling, and sound integration. We pre-wire structures for recessed LED scenes, outdoor fans, and high-fidelity audio during the frame phase.',
        },
    ],

    featuresTitle: 'The AquaVida Standard',
    features: [
        {
            icon: Trees,
            title: 'Select Timber & Metal',
            body: 'Grade-A Western Red Cedar or aerospace-grade aluminum — each material chosen for its ability to withstand the Dallas climate without warping or rust.',
        },
        {
            icon: Sun,
            title: 'Thermal Management',
            body: 'We engineer beam depth and spacing to reduce ' + 'direct UV exposure by up to 60%, creating a significantly cooler micro-climate beneath the structure.',
        },
        {
            icon: Shield,
            title: 'Seismic & Wind Load',
            body: 'Our structures are built with deep-pour footings and reinforced steel connections, rated for the heavy wind gusts and soil movement common in North Texas.',
        },
        {
            icon: Lightbulb,
            title: 'Concealed Utilities',
            body: 'We route all electrical and control wiring through the internal structure of the posts and beams, maintaining a clean architectural profile with no visible conduit.',
        },
        {
            icon: Ruler,
            title: 'Precision Blueprinting',
            body: 'Detailed 3D models allow you to visualize the structure on your property before construction begins, ensuring perfect alignment with your pool and patio.',
        },
        {
            icon: Star,
            title: 'Landscape Haromny',
            body: 'Pergolas designed to host climbing greenery or frame specific views, integrating seamlessly with your broader garden and hardscape vision.',
        },
    ],

    standardsTitle: 'Structural Governance',
    standards: [
        {
            title: 'Code & Safety Protocol',
            body: "Every structure is designed to meet Dallas building codes for structural load and foundation depth. We provide all necessary technical documentation for resale and insurance purposes.",
        },
        {
            title: 'Longevity Assurance',
            body: 'Beyond the build, we provide specific maintenance protocols for your material type — ensuring your structure ages gracefully and maintains its structural integrity for decades.',
        },
    ],

    ctaTitle: 'Define Your Outdoor Room',
    ctaBody: "Start your architectural shade project with an AquaVida site analysis. Contact us today to schedule a consultation with our structural design team.",
    ctaImage: '/images/services/pergola_design_cta.avif',
};

export default function PergolaClient() {
    return <ServicePageShell d={data} />;
}

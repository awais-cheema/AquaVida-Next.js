'use client';

import ServicePageShell, { ServiceData } from '@/components/services/ServicePageShell';
import {
    RefreshCw, Shield, Zap, Wrench,
    Star, CheckCircle, Clock, Layers,
} from 'lucide-react';

const data: ServiceData = {
    accentColor: '#2860a0',
    accentRgb: '40,96,160',

    heroLabel: 'Pool Remodeling & Renovation — Dallas, TX',
    heroTitle: 'Pool',
    heroHighlight: 'Remodeling.',
    heroBody: "Your pool deserves a second life. AquaVida's pool remodeling experts transform outdated, worn, or underperforming pools into stunning modern retreats — without the cost and disruption of complete demolition and rebuild.",
    heroImage: '/images/services/pool_remodeling_hero.avif',

    overviewTitle: 'Expert Pool Remodeling Solutions in Dallas',
    overviewBody: "Over time, even the best-built pools show their age — cracked plaster, faded tile, outdated equipment, and inefficient systems. AquaVida specializes in comprehensive pool remodeling projects that address structural issues, aesthetic upgrades, and technology improvements simultaneously. Our Dallas remodeling crews work efficiently to minimize downtime, getting you back in the water faster with a pool that looks and performs like new.",
    overviewImage: '/images/services/pool_remodeling_overview.avif',

    processTitle: 'Our Remodeling Process',
    processSteps: [
        {
            title: 'Pool Assessment & Diagnosis',
            body: 'Our remodeling specialists conduct a thorough structural, mechanical, and aesthetic assessment of your existing pool — identifying all issues, prioritizing repairs, and documenting the current state before any work begins.',
        },
        {
            title: 'Demolition & Structural Repair',
            body: 'Existing failing plaster, tile, and damaged structural elements are carefully removed. Any cracks, leaks, or structural deficiencies are fully repaired before new finishes are applied — ensuring decades of longevity.',
        },
        {
            title: 'Refinishing & Equipment Upgrade',
            body: 'New plaster or pebble finishes, tile, coping, decking, and modern equipment are installed. We can add water features, LED lighting, automation, and energy-efficient pumps during the remodel at minimal additional cost.',
        },
    ],

    investmentTitle: 'Remodeling Investment vs. Rebuilding',
    investmentBody: "Pool remodeling typically costs 30–60% less than full demolition and replacement — making it one of the highest-ROI home improvement investments available to Dallas homeowners. A remodel also avoids the extended timeline and landscaping disruption of new construction. Financing is available for all remodeling projects, and most remodels are complete within 2–4 weeks depending on scope.",
    investmentImage: '/images/services/pool_remodeling_investment.avif',

    servicesTitle: 'Comprehensive Remodeling Services',
    servicesItems: [
        {
            title: 'Full Plaster & Surface Refinishing',
            body: 'White plaster, colored plaster, quartz aggregate, and pebble finishes — we resurface your pool with premium materials that last 15–25 years and dramatically transform its appearance.',
        },
        {
            title: 'Tile, Coping & Deck Replacement',
            body: 'Waterline tile, coping stones, and surrounding deck surfaces are replaced using premium materials that complement your home and withstand Dallas heat and freeze cycles.',
        },
        {
            title: 'Equipment Modernization',
            body: 'Variable-speed pumps, LED color lighting, salt chlorination, automation systems, and energy-efficient heaters are installed during the remodel — upgrading your pool\'s performance for decades.',
        },
    ],

    featuresTitle: 'Why Remodel with AquaVida',
    features: [
        {
            icon: RefreshCw,
            title: 'Complete Transformation',
            body: 'From structural repairs to surface finishes to equipment upgrades — we handle every aspect of the remodel in one coordinated project.',
        },
        {
            icon: Clock,
            title: 'Fast Turnaround',
            body: 'Most standard remodeling projects are completed within 2–4 weeks — significantly faster than new pool construction timelines.',
        },
        {
            icon: Shield,
            title: 'Warranty on All Work',
            body: 'Full warranty on new plaster, tile, and equipment installations — giving you complete confidence in the quality and longevity of your remodel.',
        },
        {
            icon: Zap,
            title: 'Energy Efficiency Upgrades',
            body: 'Variable-speed pumps and LED systems reduce operating costs by up to 70% compared to outdated single-speed equipment — paying for themselves over time.',
        },
        {
            icon: Layers,
            title: 'Surface Options',
            body: 'White plaster, Diamond Brite, pebble finishes, and glass tile — we offer the full spectrum of premium pool interior finishes to suit every style and budget.',
        },
        {
            icon: Star,
            title: 'Water Feature Additions',
            body: 'Waterfalls, deck jets, bubblers, and grottos can be added during the remodel — transforming your existing pool into a luxury resort-style retreat.',
        },
    ],

    standardsTitle: 'Quality & Care Standards',
    standards: [
        {
            title: 'Structural Integrity First',
            body: "Every remodel begins with a full structural assessment. We never simply cover up existing problems with new finishes — all cracks, leaks, and structural issues are fully repaired before new surfaces are applied.",
        },
        {
            title: 'Manufacturer-Certified Installers',
            body: "Our remodeling crews are certified applicators for all major plaster and pebble finish manufacturers — ensuring your new surface is installed to exact specification and backed by full manufacturer warranty.",
        },
    ],

    ctaTitle: "Transform Your Existing Pool Today",
    ctaBody: "AquaVida's pool remodeling specialists serve all of Dallas and surrounding communities. Contact us for a free remodeling assessment — we'll document your pool's current condition, outline all recommended improvements, and provide a detailed written proposal with no obligation.",
    ctaImage: '/images/services/pool_remodeling_cta.avif',
};

import { mergeServiceData, type ServicePageOverride } from '@/lib/service-override'

export default function PoolRemodelingClient({ override }: { override?: ServicePageOverride | null }) {
    return <ServicePageShell d={mergeServiceData(data, override)} />;
}

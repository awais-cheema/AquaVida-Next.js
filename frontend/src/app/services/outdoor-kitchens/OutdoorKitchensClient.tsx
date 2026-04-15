'use client';

import ServicePageShell, { ServiceData } from '@/components/services/ServicePageShell';
import {
    Flame, Wind, Utensils, Shield,
    Thermometer, Zap, Star, Wrench,
} from 'lucide-react';

const data: ServiceData = {
    accentColor: '#7a9638',
    accentRgb: '122,150,56',

    heroLabel: 'Culinary Architecture — Dallas, TX',
    heroTitle: 'Outdoor Kitchen',
    heroHighlight: 'Installation.',
    heroBody: 'Seamless integration of smart appliances and artisan textures — designed for the elements. Our outdoor stations feature weather-sealed cabinetry, marine-grade steel, and the culinary power your lifestyle demands.',
    heroImage: '/images/services/outdoor_kitchen_hero.avif',

    overviewTitle: 'The Epicurean Standard',
    overviewBody: "AquaVida transforms your backyard into a master-class entertaining environment. We specialize in custom culinary suites that combine architectural masonry with pro-series appliances. Every installation is engineered to withstand the North Texas climate while providing a seamless transition from your internal kitchen to a gourmet alfresco paradise.",
    overviewImage: '/images/services/outdoor_kitchen_overview.avif',

    processTitle: 'The Culinary Workflow',
    processSteps: [
        {
            title: 'Gourmet Site Design',
            body: 'We map your outdoor space to optimize workflow, appliance placement, and service access. Our designers help you select textures and utilities that harmonize with your existing architecture.',
        },
        {
            title: 'Masonry & Framework',
            body: 'Our master masons construct custom bases using natural stone, architectural concrete, or premium stucco. Every structure is built with reinforced internal framing for decade-long durability.',
        },
        {
            title: 'Utility & Appliance Set',
            body: 'Technicians handle all precision gas, plumbing, and electrical integrations. We execute the final appliance fitting and surface polishing to meet manufacturer tolerances.',
        },
    ],

    investmentTitle: 'Investing in Lifestyle Capital',
    investmentBody: "A custom outdoor kitchen is more than a utility; it's a high-yield property upgrade. We utilize granite, 304 stainless steel, and marine-grade polymers to ensure your investment maintains its aesthetic and functional value. Our design process ensures that your culinary station is scaled correctly to your property, maximizing ROI and entertaining capacity.",
    investmentImage: '/images/services/outdoor_kitchen_investment.avif',

    servicesTitle: 'Bespoke Culinary Services',
    servicesItems: [
        {
            title: 'Full Culinary Suite Installation',
            body: 'From simple grill stations to full-scale outdoor kitchens featuring smokers, pizza ovens, wine cooling, and prep zones — all executed with technical precision.',
        },
        {
            title: 'Professional Restoration',
            body: 'High-end structural repair and service for existing outdoor kitchens. We recalibrate systems, replace failing masonry, and upgrade internal utilities to modern safety standards.',
        },
        {
            title: 'Prestige Maintenance Plans',
            body: 'Structured care programs designed to keep your appliances in showroom condition year-round, including specialized deep cleans and preventative system checks.',
        },
    ],

    featuresTitle: 'The Alfresco Masterclass',
    features: [
        {
            icon: Utensils,
            title: 'Chef-Grade Hardware',
            body: "Pro-series thermal grills, ceramic smokers, and custom pizza ovens—the same equipment professional chefs rely on, integrated into your backyard.",
        },
        {
            icon: Shield,
            title: 'Elite Materials',
            body: "Marine-grade 316 stainless steel and weather-stable polymers engineered to deny the Dallas sun, rain, and humidity—no warping, no compromise.",
        },
        {
            icon: Thermometer,
            title: 'Poreless Surfaces',
            body: "Exotic granite and high-density sintered stone that defy stains and heat—countertops that maintain a perpetual glow under sunlight.",
        },
        {
            icon: Zap,
            title: 'Intelligent Controls',
            body: "Subtle task lighting, integrated USB ports, and Wi-fi enabled appliance management bring modern digital convenience to your flame-fired space.",
        },
        {
            icon: Wind,
            title: 'Atmospheric Balance',
            body: "Optimized ventilation and airflow dynamics ensure heat and smoke are managed effectively, maintaining Guest comfort even during peak use.",
        },
        {
            icon: Star,
            title: 'Architectural Unity',
            body: "Every kitchen exterior is matched to your home’s specific material palette—creating a cohesive, high-fashion look from deck to door.",
        },
    ],

    standardsTitle: 'Technical Compliance',
    standards: [
        {
            title: 'Safety & Code Integrity',
            body: 'Every project meets City of Dallas fire safety and building codes, ensuring proper gas clearances, ventilation, and weather-proof electrical circuits.',
        },
        {
            title: 'Manufacturer Hand-Off',
            body: 'We provide full technical walkthroughs for all new hardware, ensuring you understand the performance parameters and care requirements of your new professional gear.',
        },
    ],

    ctaTitle: 'Elevate Your Entertaining Capacity',
    ctaBody: "AquaVida is ready to architect your perfect outdoor culinary experience. Contact us for a technical site assessment and start planning your bespoke garden kitchen.",
    ctaImage: '/images/services/outdoor_kitchen_cta.avif',
};

export default function OutdoorKitchensClient() {
    return <ServicePageShell d={data} />;
}

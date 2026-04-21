import type { ServiceData } from '@/components/services/ServicePageShell'

export type ServicePageOverride = {
  accentColor: string
  accentRgb: string
  heroLabel: string
  heroTitle: string
  heroHighlight: string
  heroBody: string
  heroImage: string | null
  overviewTitle: string
  overviewBody: string
  overviewImage: string | null
  processTitle: string
  processSteps: ReadonlyArray<{ readonly title: string; readonly body: string }>
  investmentTitle: string
  investmentBody: string
  investmentImage: string | null
  servicesTitle: string
  servicesItems: ReadonlyArray<{ readonly title: string; readonly body: string }>
  featuresTitle: string
  features: ReadonlyArray<{ readonly title: string; readonly body: string }>
  standardsTitle: string
  standards: ReadonlyArray<{ readonly title: string; readonly body: string }>
  ctaTitle: string
  ctaBody: string
  ctaImage: string | null
  faqItems?: ReadonlyArray<{ readonly question: string; readonly answer: string }> | null
  [key: string]: unknown
}

export function mergeServiceData(base: ServiceData, override?: ServicePageOverride | null): ServiceData {
  if (!override) return base
  return {
    accentColor: override.accentColor || base.accentColor,
    accentRgb: override.accentRgb || base.accentRgb,
    heroLabel: override.heroLabel || base.heroLabel,
    heroTitle: override.heroTitle || base.heroTitle,
    heroHighlight: override.heroHighlight || base.heroHighlight,
    heroBody: override.heroBody || base.heroBody,
    heroImage: override.heroImage || base.heroImage,
    overviewTitle: override.overviewTitle || base.overviewTitle,
    overviewBody: override.overviewBody || base.overviewBody,
    overviewImage: override.overviewImage || base.overviewImage,
    processTitle: override.processTitle || base.processTitle,
    processSteps: override.processSteps?.length
      ? override.processSteps.map(s => ({ title: s.title, body: s.body }))
      : base.processSteps,
    investmentTitle: override.investmentTitle || base.investmentTitle,
    investmentBody: override.investmentBody || base.investmentBody,
    investmentImage: override.investmentImage || base.investmentImage,
    servicesTitle: override.servicesTitle || base.servicesTitle,
    servicesItems: override.servicesItems?.length
      ? override.servicesItems.map(s => ({ title: s.title, body: s.body }))
      : base.servicesItems,
    featuresTitle: override.featuresTitle || base.featuresTitle,
    features: base.features.map((f, i) => ({
      ...f,
      ...(override.features?.[i] ? { title: override.features[i].title, body: override.features[i].body } : {}),
    })),
    standardsTitle: override.standardsTitle || base.standardsTitle,
    standards: override.standards?.length
      ? override.standards.map(s => ({ title: s.title, body: s.body }))
      : base.standards,
    ctaTitle: override.ctaTitle || base.ctaTitle,
    ctaBody: override.ctaBody || base.ctaBody,
    ctaImage: override.ctaImage || base.ctaImage,
    faqItems: override.faqItems?.length
      ? override.faqItems.map(f => ({ question: f.question, answer: f.answer }))
      : base.faqItems,
  }
}

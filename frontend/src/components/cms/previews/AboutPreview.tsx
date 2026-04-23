'use client';

import AboutClient from '@/app/about/AboutClient';
import ShadowSaveButton from '../fields/ShadowSaveButton';

export default function AboutPreview(props: any) {
  const { fields } = props;
  
  // Map Keystatic fields to AboutPageData format
  const data = {
    heroTagline: fields.heroTagline.value,
    manifesto: fields.manifesto.value,
    approachQuote: fields.approachQuote.value,
    approachDescription: fields.approachDescription.value,
    beliefs: fields.beliefs.elements.map((el: any) => ({
      word: el.fields.word.value,
      pill: el.fields.pill.value,
    })),
    valuesHeading: fields.valuesHeading.value,
    values: fields.values.elements.map((el: any) => ({
      title: el.fields.title.value,
      desc: el.fields.desc.value,
    })),
    founderBio: fields.founderBio.value,
    founderName: fields.founderName.value,
    founderRole: fields.founderRole.value,
    founderImage: fields.founderImage.value,
  };

  return (
    <div className="w-full h-full overflow-auto bg-[#05070A]">
      <div className="p-8 pb-0">
        <ShadowSaveButton />
      </div>
      <AboutClient data={data} />
    </div>
  );
}

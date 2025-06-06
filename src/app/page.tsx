import { Navbar } from '@/components/layout/Navbar';
import { Carousel } from '@/components/Carousel';
import { slides } from '@/lib/constants/carousel-slides';
import { WhatWeDoSection } from '@/modules/home/components/WhatWeDoSection';
import { OrganizationalStructureSection } from '@/modules/home/components/OrganizationalStructureSection';
import { LatestPublicationsSection } from '@/modules/home/components/LatestPublicationsSection';
import { BannerSection } from '@/modules/home/components/BannerSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background pt-6 mt-10">
        <Carousel slides={slides} />
        <WhatWeDoSection />
        <OrganizationalStructureSection />
        <LatestPublicationsSection />
        <BannerSection />
      </main>
    </>
  );
}

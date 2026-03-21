import { Section } from '@/stores/builderStore';
import { Theme } from '@/stores/themeStore';
import { Company } from '@/stores/companyStore';
import HeroSection from '@/components/builder/sections/HeroSection';
import AboutSection from '@/components/builder/sections/AboutSection';
import CultureSection from '@/components/builder/sections/CultureSection';
import BenefitsSection from '@/components/builder/sections/BenefitsSection';
import JobListingsSection from '@/components/builder/sections/JobListingsSection';
import CustomSection from '@/components/builder/sections/CustomSection';

interface Props {
  section: Section;
  theme: Theme | null;
  company: Company | null;
  isPreview?: boolean;
}

export default function SectionRenderer({ section, theme, company, isPreview }: Props) {
  switch (section.type) {
    case 'hero':
      return <HeroSection content={section.content} theme={theme} />;
    case 'about':
      return <AboutSection content={section.content} theme={theme} />;
    case 'culture':
      return <CultureSection content={section.content} theme={theme} />;
    case 'benefits':
      return <BenefitsSection content={section.content} theme={theme} />;
    case 'jobs':
      return <JobListingsSection content={section.content} theme={theme} company={company} isPreview={isPreview} />;
    case 'custom':
      return <CustomSection content={section.content} theme={theme} />;
    default:
      return (
        <div className="py-12 px-6 text-center opacity-50">
          Unknown section type: {section.type}
        </div>
      );
  }
}

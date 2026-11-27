import { useEffect } from 'react';
import { useDocumentationTree } from '../../../shared/hooks/useDocumentationTree';
import { ArchitectureSection } from '../components/ArchitectureSection';
import { DeliverySection } from '../components/DeliverySection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HeroSection } from '../components/HeroSection';
import { TechnologySection } from '../components/TechnologySection';
import { TeamSection } from '../components/TeamSection';
import '../styles/home.css';

interface HomeProps {
  section?: string;
}

/**
 * One page presentation of the project, from the hero to the team
 * @param props section to scroll to
 * @returns the home page
 */
export function Home({ section }: HomeProps) {
  const tree = useDocumentationTree();

  useEffect(() => {
    if (!section) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
    return () => {
      window.clearTimeout(timer);
    };
  }, [section]);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection tree={tree} />
      <TechnologySection />
      <DeliverySection />
      <TeamSection />
    </>
  );
}

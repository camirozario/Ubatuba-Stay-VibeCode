import { useRef, useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Philosophy } from './components/sections/Philosophy';
import { Services } from './components/sections/Services';
import { Photography } from './components/sections/Photography';
import { Process } from './components/sections/Process';
import { OwnerPlatform } from './components/sections/OwnerPlatform';
import { Plans } from './components/sections/Plans';
import { Testimonials } from './components/sections/Testimonials';
import { Principles } from './components/sections/Principles';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';
import { PageLoader } from './components/ui/PageLoader';

export default function App() {
  const headerLogoTargetRef = useRef(null);
  const [showLoader, setShowLoader] = useState(true);
  const [headerBrandReady, setHeaderBrandReady] = useState(false);

  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>

      <Header brandTargetRef={headerLogoTargetRef} brandVisible={headerBrandReady || !showLoader} />

      {showLoader ? (
        <PageLoader
          targetRef={headerLogoTargetRef}
          onDock={() => setHeaderBrandReady(true)}
          onComplete={() => {
            setHeaderBrandReady(true);
            setShowLoader(false);
          }}
        />
      ) : null}

      <main id="conteudo">
        <Hero contentReady={!showLoader} />
        <Philosophy />
        <Services />
        <Photography />
        <Process />
        <OwnerPlatform />
        <Plans />
        <Testimonials />
        <Principles />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

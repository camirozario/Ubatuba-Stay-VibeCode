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

export default function App() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>

      <Header />

      <main id="conteudo">
        <Hero />
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

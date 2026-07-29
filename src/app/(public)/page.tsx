import HeroSection from "@/components/home/HeroSection";
import SortieDuFour from "@/components/home/SortieDuFour";
import HistoireSection from "@/components/home/HistoireSection";
import NosProduits from "@/components/home/NosProduits";
import LaSemaine from "@/components/home/LaSemaine";
import NosFarines from "@/components/home/NosFarines";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SortieDuFour />
      <HistoireSection />
      <NosProduits />
      <LaSemaine />
      <NosFarines />
      <ContactSection />
    </>
  );
}

import { lazy, Suspense } from "react";
// Crítico / above-the-fold: se cargan de inmediato.
import HeroSection from "@/components/HeroSection";
import GlobalStats from "@/components/GlobalStats";
import DashboardFooter from "@/components/DashboardFooter";
import EmergencyBar from "@/components/EmergencyBar";
import CoffeeButton from "@/components/CoffeeButton";
import SupportChat from "@/components/SupportChat";
import PrivacyNotice from "@/components/PrivacyNotice";

// Secciones analíticas (Recharts): se cargan en diferido para acelerar el primer render.
const GenderAnalysis = lazy(() => import("@/components/GenderAnalysis"));
const EconomicFactors = lazy(() => import("@/components/EconomicFactors"));
const SocialMediaImpact = lazy(() => import("@/components/SocialMediaImpact"));
const AgeGroupDeepDive = lazy(() => import("@/components/AgeGroupDeepDive"));
const ChartsSection = lazy(() => import("@/components/ChartsSection"));
const HelplineDirectory = lazy(() => import("@/components/HelplineDirectory"));
const PreventionResources = lazy(() => import("@/components/PreventionResources"));
const SourcesFaq = lazy(() => import("@/components/SourcesFaq"));

const SectionFallback = () => (
  <div className="px-6 py-24" aria-hidden="true">
    <div className="max-w-6xl mx-auto h-64 rounded-2xl bg-muted/40 animate-pulse" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <GlobalStats />
      <Suspense fallback={<SectionFallback />}>
        <GenderAnalysis />
        <EconomicFactors />
        <SocialMediaImpact />
        <AgeGroupDeepDive />
        <ChartsSection />
        <HelplineDirectory />
        <PreventionResources />
        <SourcesFaq />
      </Suspense>
      <DashboardFooter />
      <EmergencyBar />
      <CoffeeButton />
      <SupportChat />
      <PrivacyNotice />
    </div>
  );
};

export default Index;

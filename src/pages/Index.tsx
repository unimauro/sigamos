import HeroSection from "@/components/HeroSection";
import GlobalStats from "@/components/GlobalStats";
import GenderAnalysis from "@/components/GenderAnalysis";
import EconomicFactors from "@/components/EconomicFactors";
import SocialMediaImpact from "@/components/SocialMediaImpact";
import AgeGroupDeepDive from "@/components/AgeGroupDeepDive";
import ChartsSection from "@/components/ChartsSection";
import HelplineDirectory from "@/components/HelplineDirectory";
import PreventionResources from "@/components/PreventionResources";
import SourcesFaq from "@/components/SourcesFaq";
import DashboardFooter from "@/components/DashboardFooter";
import EmergencyBar from "@/components/EmergencyBar";
import CoffeeButton from "@/components/CoffeeButton";
import SupportChat from "@/components/SupportChat";
import PrivacyNotice from "@/components/PrivacyNotice";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <GlobalStats />
      <GenderAnalysis />
      <EconomicFactors />
      <SocialMediaImpact />
      <AgeGroupDeepDive />
      <ChartsSection />
      <HelplineDirectory />
      <PreventionResources />
      <SourcesFaq />
      <DashboardFooter />
      <EmergencyBar />
      <CoffeeButton />
      <SupportChat />
      <PrivacyNotice />
    </div>
  );
};

export default Index;

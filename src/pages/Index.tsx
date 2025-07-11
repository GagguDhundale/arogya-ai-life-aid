
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Brain, QrCode, Stethoscope, Shield, Phone, Apple, FileText, Syringe, Wind } from "lucide-react";
import SymptomChecker from "@/components/SymptomChecker";
import EmergencyProfile from "@/components/EmergencyProfile";
import MentalHealthSupport from "@/components/MentalHealthSupport";
import DietTracker from "@/components/DietTracker";
import WeeklyReport from "@/components/WeeklyReport";
import VaccineScheduler from "@/components/VaccineScheduler";
import PollutionAllergyAlert from "@/components/PollutionAllergyAlert";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { t } = useTranslation(selectedLanguage);

  const handleEmergencyAlert = () => {
    setEmergencyMode(true);
    toast.error(t("emergencyActivated"), {
      duration: 5000,
    });
    
    // Simulate emergency contact
    setTimeout(() => {
      toast.success(t("emergencyContacted"));
      setEmergencyMode(false);
    }, 3000);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    console.log(`Language changed to: ${language}`);
  };

  const healthStats = [
    { label: t("healthScore"), value: "85/100", color: "text-green-600", icon: Heart },
    { label: t("lastCheckup"), value: t("daysAgo", "2"), color: "text-blue-600", icon: Stethoscope },
    { label: t("riskLevel"), value: t("low"), color: "text-green-600", icon: Shield },
    { label: t("alerts"), value: t("activeAlerts", "0"), color: "text-gray-600", icon: AlertTriangle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "symptoms":
        return <SymptomChecker />;
      case "emergency":
        return <EmergencyProfile />;
      case "mental-health":
        return <MentalHealthSupport />;
      case "diet":
        return <DietTracker selectedLanguage={selectedLanguage} />;
      case "weekly-report":
        return <WeeklyReport selectedLanguage={selectedLanguage} />;
      case "vaccines":
        return <VaccineScheduler />;
      case "pollution-allergy":
        return <PollutionAllergyAlert />;
      default:
        return (
          <div className="space-y-6">
            {/* Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {healthStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
                        </div>
                        <IconComponent className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  {t("quickHealthActions")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("symptoms")}
                  >
                    <Brain className="h-6 w-6" />
                    {t("checkSymptoms")}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("vaccines")}
                  >
                    <Syringe className="h-6 w-6" />
                    Vaccines
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("pollution-allergy")}
                  >
                    <Wind className="h-6 w-6" />
                    Air Quality
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("diet")}
                  >
                    <Apple className="h-6 w-6" />
                    {t("dietTracker")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>{t("recentHealthActivity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">{t("symptomCheckCompleted")}</p>
                      <p className="text-sm text-muted-foreground">{t("mildHeadacheLowRisk")}</p>
                    </div>
                    <Badge variant="secondary">{t("hoursAgo", "2")}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Vaccine Reminder Set</p>
                      <p className="text-sm text-muted-foreground">COVID-19 booster due in 5 days</p>
                    </div>
                    <Badge variant="secondary">Today</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">Air Quality Alert</p>
                      <p className="text-sm text-muted-foreground">High pollution detected in your area</p>
                    </div>
                    <Badge variant="secondary">{t("hoursAgo", "1")}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ArogyaAI</h1>
                <p className="text-xs text-muted-foreground">{t("aiHealthCompanion")}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <LanguageSelector 
                currentLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
              
              <Button
                variant="destructive"
                size="sm"
                className={`flex items-center gap-2 ${emergencyMode ? 'animate-pulse' : ''}`}
                onClick={handleEmergencyAlert}
                disabled={emergencyMode}
              >
                <Phone className="h-4 w-4" />
                {emergencyMode ? t("alerting") : t("emergency")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "dashboard", label: t("dashboard"), icon: Heart },
              { id: "symptoms", label: t("symptomChecker"), icon: Brain },
              { id: "vaccines", label: "Vaccines", icon: Syringe },
              { id: "pollution-allergy", label: "Air & Allergy", icon: Wind },
              { id: "emergency", label: t("emergency"), icon: AlertTriangle },
              { id: "mental-health", label: t("mentalHealth"), icon: Shield },
              { id: "diet", label: t("dietTracker"), icon: Apple },
              { id: "weekly-report", label: t("weeklyReport"), icon: FileText },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;

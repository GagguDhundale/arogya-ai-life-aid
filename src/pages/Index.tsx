import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Heart, Activity, Calendar, Shield, Brain, Apple, Pill, AlertCircle, Globe, Phone, LogOut } from 'lucide-react';
import SymptomChecker from '@/components/SymptomChecker';
import EmergencyProfile from '@/components/EmergencyProfile';
import DietTracker from '@/components/DietTracker';
import MentalHealthSupport from '@/components/MentalHealthSupport';
import VaccineScheduler from '@/components/VaccineScheduler';
import PollutionAllergyAlert from '@/components/PollutionAllergyAlert';
import WeeklyReport from '@/components/WeeklyReport';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from "sonner";

export default function Index() {
  const { user, userType, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { t } = useTranslation(selectedLanguage);

  // Redirect if not authenticated or if doctor tries to access patient dashboard
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (userType === 'doctor') {
    return <Navigate to="/doctor-dashboard" replace />;
  }

  const handleEmergencyAlert = () => {
    setEmergencyMode(true);
    toast.error("Emergency activated! Contacting emergency services...", {
      duration: 5000,
    });
    
    // Simulate emergency contact
    setTimeout(() => {
      toast.success("Emergency services contacted successfully");
      setEmergencyMode(false);
    }, 3000);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    console.log(`Language changed to: ${language}`);
  };

  const healthStats = [
    { label: t("healthScore"), value: "85/100", color: "text-green-600", icon: Heart },
    { label: t("lastCheckup"), value: "2 days ago", color: "text-blue-600", icon: Activity },
    { label: t("riskLevel"), value: t("low"), color: "text-green-600", icon: Shield },
    { label: t("alerts"), value: "0 active", color: "text-gray-600", icon: AlertTriangle },
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
                  <Activity className="h-5 w-5" />
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
                    <Pill className="h-6 w-6" />
                    {t("vaccineScheduler")}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("pollution-allergy")}
                  >
                    <Globe className="h-6 w-6" />
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

            {/* Feature Summaries */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Summaries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">{t("symptomChecker")}</h4>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">AI-powered symptom analysis and health recommendations</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        Last used: 6 hours ago
                      </Badge>
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        Accuracy: 94%
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">{t("mentalHealth")}</h4>
                    </div>
                    <p className="text-sm text-green-700 mb-3">Track your mental wellbeing and get personalized support</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        Mood today: Good
                      </Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        Streak: 5 days
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Apple className="h-5 w-5 text-orange-600" />
                      <h4 className="font-semibold text-orange-800">{t("dietTracker")}</h4>
                    </div>
                    <p className="text-sm text-orange-700 mb-3">Monitor nutrition and get personalized meal recommendations</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        Today's calories: 1,847/2,200
                      </Badge>
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        On track
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Pill className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">{t("vaccineScheduler")}</h4>
                    </div>
                    <p className="text-sm text-purple-700 mb-3">Stay up-to-date with vaccination schedules and reminders</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-purple-600 border-purple-300">
                        Next due: 5 days
                      </Badge>
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        Up to date
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Health Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Symptom check completed</p>
                      <p className="text-sm text-muted-foreground">Mild headache - Low risk assessment</p>
                    </div>
                    <Badge variant="secondary">2 hours ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Vaccine reminder set</p>
                      <p className="text-sm text-muted-foreground">COVID-19 booster due in 5 days</p>
                    </div>
                    <Badge variant="secondary">Today</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">Air quality alert</p>
                      <p className="text-sm text-muted-foreground">High pollution detected in your area</p>
                    </div>
                    <Badge variant="secondary">1 hour ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Arogya-AI</span>
              <Badge variant="secondary">Patient</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                currentLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleEmergencyAlert}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                {t("emergency")}
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "dashboard", label: t("dashboard"), icon: Heart },
              { id: "symptoms", label: t("symptomChecker"), icon: Brain },
              { id: "vaccines", label: t("vaccineScheduler"), icon: Pill },
              { id: "pollution-allergy", label: "Air Quality", icon: Globe },
              { id: "emergency", label: t("emergency"), icon: AlertTriangle },
              { id: "mental-health", label: t("mentalHealth"), icon: Shield },
              { id: "diet", label: t("dietTracker"), icon: Apple },
              { id: "weekly-report", label: t("weeklyReport"), icon: Calendar },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
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
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
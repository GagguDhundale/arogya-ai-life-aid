import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Brain, QrCode, Stethoscope, Shield, Phone, Apple } from "lucide-react";
import SymptomChecker from "@/components/SymptomChecker";
import EmergencyProfile from "@/components/EmergencyProfile";
import MentalHealthSupport from "@/components/MentalHealthSupport";
import DietTracker from "@/components/DietTracker";
import LanguageSelector from "@/components/LanguageSelector";
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleEmergencyAlert = () => {
    setEmergencyMode(true);
    toast.error("Emergency Alert Activated! Contacting emergency services...", {
      duration: 5000,
    });
    
    // Simulate emergency contact
    setTimeout(() => {
      toast.success("Emergency contacts notified. Help is on the way!");
      setEmergencyMode(false);
    }, 3000);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    console.log(`Language changed to: ${language}`);
  };

  const healthStats = [
    { label: "Health Score", value: "85/100", color: "text-green-600", icon: Heart },
    { label: "Last Checkup", value: "2 days ago", color: "text-blue-600", icon: Stethoscope },
    { label: "Risk Level", value: "Low", color: "text-green-600", icon: Shield },
    { label: "Alerts", value: "0 Active", color: "text-gray-600", icon: AlertTriangle },
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
        return <DietTracker />;
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
                  Quick Health Actions
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
                    Check Symptoms
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("emergency")}
                  >
                    <QrCode className="h-6 w-6" />
                    Emergency Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("mental-health")}
                  >
                    <Heart className="h-6 w-6" />
                    Mental Health
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("diet")}
                  >
                    <Apple className="h-6 w-6" />
                    Diet Tracker
                  </Button>
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
                      <p className="font-medium">Symptom Check Completed</p>
                      <p className="text-sm text-muted-foreground">Mild headache - Low risk</p>
                    </div>
                    <Badge variant="secondary">2 hours ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Health Report Generated</p>
                      <p className="text-sm text-muted-foreground">Weekly summary available</p>
                    </div>
                    <Badge variant="secondary">1 day ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">Diet Goal Achieved</p>
                      <p className="text-sm text-muted-foreground">Daily calorie target met</p>
                    </div>
                    <Badge variant="secondary">Yesterday</Badge>
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
                <p className="text-xs text-muted-foreground">Your AI Health Companion</p>
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
                {emergencyMode ? "Alerting..." : "Emergency"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: Heart },
              { id: "symptoms", label: "Symptom Checker", icon: Brain },
              { id: "emergency", label: "Emergency", icon: AlertTriangle },
              { id: "mental-health", label: "Mental Health", icon: Shield },
              { id: "diet", label: "Diet Tracker", icon: Apple },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

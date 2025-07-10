
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Phone } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { toast } from "sonner";

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const Header = ({ selectedLanguage, onLanguageChange }: HeaderProps) => {
  const [emergencyMode, setEmergencyMode] = useState(false);

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

  return (
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
              onLanguageChange={onLanguageChange}
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
  );
};

export default Header;

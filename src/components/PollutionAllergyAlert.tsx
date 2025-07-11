import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  MapPin, 
  Wind, 
  Eye, 
  Thermometer, 
  Droplets,
  Shield,
  Zap
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface PollutionData {
  location: string;
  aqi: number; // Air Quality Index
  pm25: number;
  pm10: number;
  status: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  recommendations: string[];
}

interface AllergyAlert {
  allergen: string;
  level: 'low' | 'medium' | 'high';
  recommendations: string[];
}

const PollutionAllergyAlert = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userAllergies, setUserAllergies] = useState<string[]>(['pollen', 'dust']);
  const [currentLocation, setCurrentLocation] = useState("Current Location");
  const [pollutionData, setPollutionData] = useState<PollutionData>({
    location: "Delhi, India",
    aqi: 178,
    pm25: 89,
    pm10: 156,
    status: 'unhealthy',
    recommendations: [
      "Wear a N95 mask when going outside",
      "Avoid outdoor exercise",
      "Keep windows closed",
      "Use air purifier indoors"
    ]
  });

  const [allergyAlerts, setAllergyAlerts] = useState<AllergyAlert[]>([
    {
      allergen: 'Pollen',
      level: 'high',
      recommendations: [
        "Take antihistamines as prescribed",
        "Keep windows closed during peak hours",
        "Shower after being outdoors"
      ]
    },
    {
      allergen: 'Dust Mites',
      level: 'medium',
      recommendations: [
        "Use dust-proof covers on bedding",
        "Vacuum regularly with HEPA filter",
        "Maintain humidity below 50%"
      ]
    }
  ]);

  useEffect(() => {
    // Simulate location-based pollution monitoring
    const monitorPollution = () => {
      if (notificationsEnabled) {
        if (pollutionData.aqi > 150) {
          toast.error(`High Pollution Alert! AQI: ${pollutionData.aqi}. Wear a mask before going outside!`, {
            duration: 8000,
          });
        } else if (pollutionData.aqi > 100) {
          toast.warning(`Moderate Pollution Alert! AQI: ${pollutionData.aqi}. Consider wearing a mask.`, {
            duration: 6000,
          });
        }
      }
    };

    // Simulate allergy alerts
    const checkAllergyAlerts = () => {
      if (notificationsEnabled) {
        allergyAlerts.forEach(alert => {
          if (alert.level === 'high' && userAllergies.includes(alert.allergen.toLowerCase())) {
            toast.warning(`High ${alert.allergen} Alert! Take precautions to avoid allergic reactions.`, {
              duration: 6000,
            });
          }
        });
      }
    };

    monitorPollution();
    checkAllergyAlerts();

    // Set up periodic checks (every 30 minutes)
    const interval = setInterval(() => {
      monitorPollution();
      checkAllergyAlerts();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [pollutionData, allergyAlerts, notificationsEnabled, userAllergies]);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600 bg-green-50';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-50';
    if (aqi <= 150) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    return 'Unhealthy';
  };

  const getAllergyLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const addAllergy = (allergy: string) => {
    if (!userAllergies.includes(allergy.toLowerCase())) {
      setUserAllergies([...userAllergies, allergy.toLowerCase()]);
      toast.success(`Added ${allergy} to your allergy list`);
    }
  };

  const removeAllergy = (allergy: string) => {
    setUserAllergies(userAllergies.filter(a => a !== allergy));
    toast.success(`Removed ${allergy} from your allergy list`);
  };

  return (
    <div className="space-y-6">
      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get alerts when pollution or allergy levels are high
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          
          <div>
            <Label>Your Location</Label>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{pollutionData.location}</span>
              <Badge variant="outline">Auto-detected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Pollution Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5" />
            Current Air Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">
                {pollutionData.aqi}
              </div>
              <Badge className={getAQIColor(pollutionData.aqi)}>
                {getAQIStatus(pollutionData.aqi)}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">AQI</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {pollutionData.pm25}
              </div>
              <div className="text-sm text-muted-foreground">PM2.5 µg/m³</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {pollutionData.pm10}
              </div>
              <div className="text-sm text-muted-foreground">PM10 µg/m³</div>
            </div>
          </div>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Recommendations:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {pollutionData.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm">{rec}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Allergy Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Allergy Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Your Allergies</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {userAllergies.map(allergy => (
                <Badge 
                  key={allergy} 
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeAllergy(allergy)}
                >
                  {allergy.charAt(0).toUpperCase() + allergy.slice(1)} ×
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <Label>Add Allergy</Label>
            <Select onValueChange={addAllergy}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select an allergy to add" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pollen">Pollen</SelectItem>
                <SelectItem value="dust">Dust Mites</SelectItem>
                <SelectItem value="mold">Mold</SelectItem>
                <SelectItem value="pet dander">Pet Dander</SelectItem>
                <SelectItem value="smoke">Smoke</SelectItem>
                <SelectItem value="chemicals">Chemical Fumes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Current Allergy Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Current Allergy Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allergyAlerts.map((alert, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{alert.allergen}</h3>
                  <Badge className={getAllergyLevelColor(alert.level)}>
                    {alert.level.toUpperCase()} LEVEL
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <strong className="text-sm">Recommendations:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    {alert.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className="text-sm text-muted-foreground">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PollutionAllergyAlert;


import { Card, CardContent } from "@/components/ui/card";
import { Heart, Stethoscope, Shield, AlertTriangle } from "lucide-react";

const HealthStats = () => {
  const healthStats = [
    { label: "Health Score", value: "85/100", color: "text-green-600", icon: Heart },
    { label: "Last Checkup", value: "2 days ago", color: "text-blue-600", icon: Stethoscope },
    { label: "Risk Level", value: "Low", color: "text-green-600", icon: Shield },
    { label: "Alerts", value: "0 Active", color: "text-gray-600", icon: AlertTriangle },
  ];

  return (
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
  );
};

export default HealthStats;

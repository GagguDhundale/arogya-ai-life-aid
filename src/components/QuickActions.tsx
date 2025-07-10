
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, QrCode, Heart, Apple, Stethoscope } from "lucide-react";

interface QuickActionsProps {
  onActionClick: (tabId: string) => void;
}

const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  return (
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
            onClick={() => onActionClick("symptoms")}
          >
            <Brain className="h-6 w-6" />
            Check Symptoms
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => onActionClick("emergency")}
          >
            <QrCode className="h-6 w-6" />
            Emergency Profile
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => onActionClick("mental-health")}
          >
            <Heart className="h-6 w-6" />
            Mental Health
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => onActionClick("diet")}
          >
            <Apple className="h-6 w-6" />
            Diet Tracker
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, Syringe, Bell, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Vaccine {
  id: string;
  name: string;
  totalDoses: number;
  completedDoses: number;
  nextDueDate?: Date;
  healthCondition: string;
  priority: 'high' | 'medium' | 'low';
}

const VaccineScheduler = () => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([
    {
      id: '1',
      name: 'COVID-19 Booster',
      totalDoses: 3,
      completedDoses: 2,
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      healthCondition: 'General Health',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Flu Shot',
      totalDoses: 1,
      completedDoses: 0,
      nextDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      healthCondition: 'Respiratory Health',
      priority: 'medium'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [vaccineName, setVaccineName] = useState("");
  const [totalDoses, setTotalDoses] = useState("");
  const [healthCondition, setHealthCondition] = useState("");

  useEffect(() => {
    // Check for upcoming vaccine notifications
    const checkNotifications = () => {
      vaccines.forEach(vaccine => {
        if (vaccine.nextDueDate) {
          const daysUntilDue = Math.ceil((vaccine.nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilDue <= 3 && daysUntilDue > 0) {
            toast.warning(`Vaccine Reminder: ${vaccine.name} is due in ${daysUntilDue} day(s)!`, {
              duration: 5000,
            });
          } else if (daysUntilDue <= 0) {
            toast.error(`Vaccine Overdue: ${vaccine.name} was due ${Math.abs(daysUntilDue)} day(s) ago!`, {
              duration: 5000,
            });
          }
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 24 * 60 * 60 * 1000); // Check daily
    
    return () => clearInterval(interval);
  }, [vaccines]);

  const addVaccine = () => {
    if (!vaccineName || !totalDoses || !selectedDate || !healthCondition) {
      toast.error("Please fill in all fields");
      return;
    }

    const newVaccine: Vaccine = {
      id: Date.now().toString(),
      name: vaccineName,
      totalDoses: parseInt(totalDoses),
      completedDoses: 0,
      nextDueDate: selectedDate,
      healthCondition,
      priority: 'medium'
    };

    setVaccines([...vaccines, newVaccine]);
    setVaccineName("");
    setTotalDoses("");
    setSelectedDate(undefined);
    setHealthCondition("");
    
    toast.success("Vaccine scheduled successfully!");
  };

  const markDoseComplete = (vaccineId: string) => {
    setVaccines(vaccines.map(vaccine => {
      if (vaccine.id === vaccineId) {
        const updatedVaccine = {
          ...vaccine,
          completedDoses: vaccine.completedDoses + 1
        };
        
        if (updatedVaccine.completedDoses < updatedVaccine.totalDoses) {
          // Schedule next dose (assuming 4 weeks interval)
          updatedVaccine.nextDueDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000);
        } else {
          updatedVaccine.nextDueDate = undefined;
        }
        
        return updatedVaccine;
      }
      return vaccine;
    }));
    
    toast.success("Dose marked as completed!");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Vaccine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Schedule New Vaccine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vaccine-name">Vaccine Name</Label>
              <Input
                id="vaccine-name"
                value={vaccineName}
                onChange={(e) => setVaccineName(e.target.value)}
                placeholder="e.g., COVID-19, Flu Shot"
              />
            </div>
            
            <div>
              <Label htmlFor="total-doses">Total Doses Required</Label>
              <Input
                id="total-doses"
                type="number"
                value={totalDoses}
                onChange={(e) => setTotalDoses(e.target.value)}
                placeholder="1"
                min="1"
              />
            </div>
            
            <div>
              <Label>Next Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="health-condition">Health Condition</Label>
              <Select value={healthCondition} onValueChange={setHealthCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Health">General Health</SelectItem>
                  <SelectItem value="Diabetes">Diabetes</SelectItem>
                  <SelectItem value="Heart Disease">Heart Disease</SelectItem>
                  <SelectItem value="Respiratory Issues">Respiratory Issues</SelectItem>
                  <SelectItem value="Immune Compromised">Immune Compromised</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={addVaccine} className="w-full">
            Schedule Vaccine
          </Button>
        </CardContent>
      </Card>

      {/* Vaccine List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Your Vaccines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vaccines.map(vaccine => (
              <div key={vaccine.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{vaccine.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Condition: {vaccine.healthCondition}
                    </p>
                  </div>
                  <Badge className={getPriorityColor(vaccine.priority)}>
                    {vaccine.priority.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {vaccine.completedDoses}/{vaccine.totalDoses}
                    </div>
                    <div className="text-sm text-muted-foreground">Doses Complete</div>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {vaccine.totalDoses - vaccine.completedDoses}
                    </div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-bold text-green-600">
                      {vaccine.nextDueDate ? format(vaccine.nextDueDate, "MMM dd, yyyy") : "Complete"}
                    </div>
                    <div className="text-sm text-muted-foreground">Next Due</div>
                  </div>
                </div>
                
                {vaccine.nextDueDate && vaccine.completedDoses < vaccine.totalDoses && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => markDoseComplete(vaccine.id)}
                      variant="outline"
                      size="sm"
                    >
                      Mark Dose Complete
                    </Button>
                  </div>
                )}
                
                {vaccine.completedDoses >= vaccine.totalDoses && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      All doses completed! Well done on staying up to date.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VaccineScheduler;

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Stethoscope, MessageCircle, Heart, Activity, Brain } from 'lucide-react';
import DietTracker from '@/components/DietTracker';
import SymptomChecker from '@/components/SymptomChecker';
import VaccineScheduler from '@/components/VaccineScheduler';
import MentalHealthSupport from '@/components/MentalHealthSupport';
import WeeklyReport from '@/components/WeeklyReport';
import { AppointmentBooking } from '@/components/AppointmentBooking';
import { PatientAICopilot } from '@/components/PatientAICopilot';
import { useToast } from '@/hooks/use-toast';

export default function PatientDashboard() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadPatientData();
      loadAppointments();
    }
  }, [user]);

  const loadPatientData = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setPatient(data);
    } catch (error) {
      console.error('Error loading patient data:', error);
      toast({
        title: "Error",
        description: "Failed to load patient information",
        variant: "destructive",
      });
    }
  };

  const loadAppointments = async () => {
    try {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (patientData) {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors (
              first_name,
              last_name,
              specialty,
              office_location
            )
          `)
          .eq('patient_id', patientData.id)
          .order('scheduled_time', { ascending: true });

        if (error) throw error;
        setAppointments(data || []);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 flex items-center justify-center">
        <div className="animate-pulse text-medical-600">Loading your dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Please log in to access your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getAppointmentStatus = (appointment: any) => {
    const now = new Date();
    const appointmentTime = new Date(appointment.scheduled_time);
    
    if (appointmentTime > now) {
      return { label: 'Upcoming', variant: 'default' as const };
    } else if (appointment.status === 'completed') {
      return { label: 'Completed', variant: 'secondary' as const };
    } else {
      return { label: appointment.status, variant: 'outline' as const };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text text-transparent">
                Welcome back, {patient?.first_name || 'Patient'}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your health journey with our comprehensive dashboard
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Card className="bg-white/80 border-medical-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-medical-500" />
                    <span className="text-sm font-medium">Health Score: 85%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-medical-500 to-medical-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-medical-100 text-sm">Next Appointment</p>
                  <p className="text-2xl font-bold">
                    {appointments.length > 0 ? 'Today' : 'None'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-medical-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-100 text-sm">Active Medications</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Stethoscope className="h-8 w-8 text-accent-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success-100 text-sm">Health Goals</p>
                  <p className="text-2xl font-bold">7/10</p>
                </div>
                <Activity className="h-8 w-8 text-success-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning-500 to-warning-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-warning-100 text-sm">Wellness Score</p>
                  <p className="text-2xl font-bold">Good</p>
                </div>
                <Brain className="h-8 w-8 text-warning-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-white/80 border border-medical-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
              Health Tools
            </TabsTrigger>
            <TabsTrigger value="diet" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
              Diet
            </TabsTrigger>
            <TabsTrigger value="mental" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
              Mental Health
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
              Reports
            </TabsTrigger>
            <TabsTrigger value="ai-copilot" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <Card className="bg-white/80 border-medical-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-medical-700">
                    <Calendar className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No upcoming appointments
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {appointments.slice(0, 3).map((appointment) => {
                        const status = getAppointmentStatus(appointment);
                        return (
                          <div key={appointment.id} className="p-4 bg-medical-50 rounded-lg border border-medical-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-medical-700">
                                Dr. {appointment.doctors?.first_name} {appointment.doctors?.last_name}
                              </h4>
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {appointment.doctors?.specialty}
                            </p>
                            <p className="text-sm text-medical-600">
                              {new Date(appointment.scheduled_time).toLocaleDateString()} at{' '}
                              {new Date(appointment.scheduled_time).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Health Activity */}
              <Card className="bg-white/80 border-medical-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-medical-700">
                    <Activity className="h-5 w-5" />
                    Recent Health Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                        <span className="font-medium text-success-700">Symptom Check Completed</span>
                      </div>
                      <p className="text-sm text-success-600">No concerning symptoms detected</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                    
                    <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                        <span className="font-medium text-accent-700">Diet Logged</span>
                      </div>
                      <p className="text-sm text-accent-600">Breakfast: 450 calories</p>
                      <p className="text-xs text-muted-foreground mt-1">This morning</p>
                    </div>
                    
                    <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                        <span className="font-medium text-warning-700">Medication Reminder</span>
                      </div>
                      <p className="text-sm text-warning-600">Take your evening medication</p>
                      <p className="text-xs text-muted-foreground mt-1">Due in 3 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <AppointmentBooking onAppointmentBooked={loadAppointments} />
          </TabsContent>

          <TabsContent value="health" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SymptomChecker />
              <VaccineScheduler />
            </div>
          </TabsContent>

          <TabsContent value="diet" className="mt-6">
            <DietTracker selectedLanguage="en" />
          </TabsContent>

          <TabsContent value="mental" className="mt-6">
            <MentalHealthSupport />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <WeeklyReport selectedLanguage="en" />
          </TabsContent>

          <TabsContent value="ai-copilot" className="mt-6">
            <PatientAICopilot />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
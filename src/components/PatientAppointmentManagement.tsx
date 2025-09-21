import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, User, MessageSquare, Video, 
  CheckCircle, AlertTriangle, Stethoscope, MapPin,
  Phone, Mail, FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  scheduled_time: string;
  status: string;
  type: string;
  patient_symptoms: string;
  urgency_level: string;
  booking_reason: string;
  consultation_fee: number;
  patients: {
    id: string;
    first_name: string;
    last_name: string;
    current_symptoms: string;
    pain_level: number;
    phone_number: string;
    medical_history: string;
    user_id: string;
  };
}

export function PatientAppointmentManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctorId, setDoctorId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (user) {
      loadDoctorId();
    }
  }, [user]);

  useEffect(() => {
    if (doctorId) {
      loadAppointments();
    }
  }, [doctorId]);

  const loadDoctorId = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setDoctorId(data.id);
    } catch (error) {
      console.error('Error loading doctor ID:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (
            id,
            first_name,
            last_name,
            current_symptoms,
            pain_level,
            phone_number,
            medical_history,
            user_id
          )
        `)
        .eq('doctor_id', doctorId)
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );

      toast({
        title: "Success",
        description: `Appointment ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  const getAppointmentsByStatus = (status: string) => {
    const now = new Date();
    return appointments.filter(apt => {
      const appointmentTime = new Date(apt.scheduled_time);
      
      switch (status) {
        case 'upcoming':
          return appointmentTime > now && apt.status === 'scheduled';
        case 'today':
          const today = new Date();
          return appointmentTime.toDateString() === today.toDateString();
        case 'completed':
          return apt.status === 'completed';
        case 'cancelled':
          return apt.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const getUrgencyColor = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'normal': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="cursor-pointer transition-all hover:shadow-lg border border-medical-200 bg-white/80">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="border-2 border-medical-200">
              <AvatarFallback className="bg-medical-100 text-medical-700 font-semibold">
                {appointment.patients.first_name?.[0]}{appointment.patients.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-medical-700">
                {appointment.patients.first_name} {appointment.patients.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">{appointment.type}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getUrgencyColor(appointment.urgency_level)}>
              {appointment.urgency_level}
            </Badge>
            <Badge variant="outline" className="text-xs">
              ${appointment.consultation_fee}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-medical-500" />
            <span>{new Date(appointment.scheduled_time).toLocaleDateString()}</span>
            <Clock className="h-4 w-4 text-medical-500 ml-4" />
            <span>{new Date(appointment.scheduled_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>

          {appointment.booking_reason && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-medical-500" />
              <span>{appointment.booking_reason}</span>
            </div>
          )}

          {appointment.patient_symptoms && (
            <div className="p-3 bg-warning-50 rounded-lg border border-warning-200">
              <div className="flex items-start gap-2">
                <Stethoscope className="h-4 w-4 text-warning-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning-700">Patient Symptoms:</p>
                  <p className="text-sm text-warning-600">{appointment.patient_symptoms}</p>
                </div>
              </div>
            </div>
          )}

          {appointment.patients.current_symptoms && (
            <div className="p-3 bg-accent-50 rounded-lg border border-accent-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-accent-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-accent-700">Current Symptoms:</p>
                  <p className="text-sm text-accent-600">{appointment.patients.current_symptoms}</p>
                </div>
              </div>
            </div>
          )}

          {appointment.patients.pain_level && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span>Pain Level: {appointment.patients.pain_level}/10</span>
            </div>
          )}

          {appointment.patients.phone_number && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-medical-500" />
              <span>{appointment.patients.phone_number}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {appointment.status === 'scheduled' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          )}

          <Button
            size="sm"
            className="bg-medical-500 hover:bg-medical-600 text-white"
            onClick={() => setSelectedAppointment(appointment)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-accent-200 hover:bg-accent-50"
          >
            <Video className="h-4 w-4 mr-1" />
            Video Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 border-medical-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-medical-700">
            <Calendar className="h-5 w-5" />
            Patient Appointment Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-medical-50 border border-medical-200">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
                Upcoming ({getAppointmentsByStatus('upcoming').length})
              </TabsTrigger>
              <TabsTrigger value="today" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
                Today ({getAppointmentsByStatus('today').length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
                Completed ({getAppointmentsByStatus('completed').length})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-medical-500 data-[state=active]:text-white">
                Cancelled ({getAppointmentsByStatus('cancelled').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {getAppointmentsByStatus('upcoming').map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
                {getAppointmentsByStatus('upcoming').length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No upcoming appointments
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="today" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {getAppointmentsByStatus('today').map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
                {getAppointmentsByStatus('today').length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No appointments scheduled for today
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {getAppointmentsByStatus('completed').map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
                {getAppointmentsByStatus('completed').length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No completed appointments
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {getAppointmentsByStatus('cancelled').map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
                {getAppointmentsByStatus('cancelled').length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No cancelled appointments
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
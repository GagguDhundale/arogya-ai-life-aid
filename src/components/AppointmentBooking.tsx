import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, MapPin, DollarSign, User, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AppointmentBookingProps {
  onAppointmentBooked?: () => void;
}

export function AppointmentBooking({ onAppointmentBooked }: AppointmentBookingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('normal');
  const [bookingReason, setBookingReason] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [patientId, setPatientId] = useState<string>('');

  useEffect(() => {
    loadDoctors();
    loadPatientId();
  }, [user]);

  const loadPatientId = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setPatientId(data.id);
    } catch (error) {
      console.error('Error loading patient ID:', error);
    }
  };

  const loadDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('first_name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load available doctors",
        variant: "destructive",
      });
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !patientId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const scheduledTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          doctor_id: selectedDoctor.id,
          scheduled_time: scheduledTime.toISOString(),
          status: 'scheduled',
          type: 'consultation',
          patient_symptoms: symptoms,
          urgency_level: urgencyLevel,
          booking_reason: bookingReason,
          consultation_fee: selectedDoctor.consultation_fee,
          duration: '00:30:00'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });

      // Reset form
      setSelectedDoctor(null);
      setSelectedDate(undefined);
      setSelectedTime('');
      setSymptoms('');
      setUrgencyLevel('normal');
      setBookingReason('');

      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 border-medical-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-medical-700">
            <Calendar className="h-5 w-5" />
            Book an Appointment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Doctor Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-medical-700">
              Choose a Doctor
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    selectedDoctor?.id === doctor.id
                      ? "border-medical-500 bg-medical-50"
                      : "border-border hover:border-medical-300"
                  )}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-medical-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-medical-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-medical-700 truncate">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </h3>
                        <p className="text-sm text-medical-600 mb-2">{doctor.specialty}</p>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Stethoscope className="h-3 w-3" />
                            <span>{doctor.years_experience || 0} years experience</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{doctor.office_location || 'Location TBD'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{doctor.available_hours || '9 AM - 5 PM'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <DollarSign className="h-3 w-3" />
                            <span>${doctor.consultation_fee || 150} consultation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedDoctor && (
            <>
              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-medical-700">Select Date</Label>
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-medical-700">Select Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-base font-semibold text-medical-700">
                    Reason for Visit
                  </Label>
                  <Input
                    id="reason"
                    placeholder="e.g., Regular checkup, follow-up, etc."
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-medical-700">Urgency Level</Label>
                  <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Routine checkup</SelectItem>
                      <SelectItem value="normal">Normal - Standard consultation</SelectItem>
                      <SelectItem value="high">High - Concerning symptoms</SelectItem>
                      <SelectItem value="urgent">Urgent - Immediate attention needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-base font-semibold text-medical-700">
                  Current Symptoms or Concerns
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Please describe any symptoms, concerns, or questions you'd like to discuss..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Appointment Summary */}
              <Card className="bg-medical-50 border-medical-200">
                <CardHeader>
                  <CardTitle className="text-medical-700">Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Doctor:</span>
                    <span className="text-sm">Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Specialty:</span>
                    <span className="text-sm">{selectedDoctor.specialty}</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Date:</span>
                      <span className="text-sm">{format(selectedDate, "PPP")}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Time:</span>
                      <span className="text-sm">{selectedTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">30 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Consultation Fee:</span>
                    <span className="text-sm font-bold">${selectedDoctor.consultation_fee || 150}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Urgency:</span>
                    <Badge variant={urgencyLevel === 'urgent' ? 'destructive' : urgencyLevel === 'high' ? 'default' : 'secondary'}>
                      {urgencyLevel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleBookAppointment}
                disabled={isBooking || !selectedDate || !selectedTime}
                className="w-full bg-medical-500 hover:bg-medical-600 text-white"
              >
                {isBooking ? 'Booking...' : 'Book Appointment'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
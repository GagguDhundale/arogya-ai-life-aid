-- Add patient dashboard fields and appointment booking enhancements
-- Add missing fields to patients table for symptoms and pain info
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS current_symptoms TEXT,
ADD COLUMN IF NOT EXISTS pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
ADD COLUMN IF NOT EXISTS medical_history TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Add missing fields to doctors table for booking info
ALTER TABLE public.doctors 
ADD COLUMN IF NOT EXISTS consultation_fee DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS available_hours TEXT,
ADD COLUMN IF NOT EXISTS office_location TEXT,
ADD COLUMN IF NOT EXISTS years_experience INTEGER;

-- Update appointments table to include more booking details
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_symptoms TEXT,
ADD COLUMN IF NOT EXISTS urgency_level TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS preferred_time_slots TEXT[],
ADD COLUMN IF NOT EXISTS booking_reason TEXT,
ADD COLUMN IF NOT EXISTS consultation_fee DECIMAL(10,2);

-- Enable RLS policies for appointment booking
CREATE POLICY IF NOT EXISTS "Patients can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (patient_id IN (
  SELECT patients.id FROM patients WHERE patients.user_id = auth.uid()
));

CREATE POLICY IF NOT EXISTS "Patients can update their appointments" 
ON public.appointments 
FOR UPDATE 
USING (patient_id IN (
  SELECT patients.id FROM patients WHERE patients.user_id = auth.uid()
));

CREATE POLICY IF NOT EXISTS "Doctors can update their appointments" 
ON public.appointments 
FOR UPDATE 
USING (doctor_id IN (
  SELECT doctors.id FROM doctors WHERE doctors.user_id = auth.uid()
));

-- Create patient AI chat sessions table
CREATE TABLE IF NOT EXISTS public.patient_ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL,
  conversation_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Enable RLS for AI chat sessions
ALTER TABLE public.patient_ai_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can manage their AI chat sessions" 
ON public.patient_ai_chat_sessions 
FOR ALL 
USING (patient_id IN (
  SELECT patients.id FROM patients WHERE patients.user_id = auth.uid()
))
WITH CHECK (patient_id IN (
  SELECT patients.id FROM patients WHERE patients.user_id = auth.uid()
));

-- Create updated_at trigger for AI chat sessions
CREATE TRIGGER IF NOT EXISTS update_patient_ai_chat_sessions_updated_at
BEFORE UPDATE ON public.patient_ai_chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample doctors data
INSERT INTO public.doctors (user_id, first_name, last_name, specialty, license_number, bio, consultation_fee, available_hours, office_location, years_experience) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Dr. Sarah', 'Johnson', 'Cardiologist', 'MD123456', 'Experienced cardiologist specializing in heart disease prevention and treatment.', 150.00, '9:00 AM - 5:00 PM', 'Medical Center Downtown', 15),
  ('00000000-0000-0000-0000-000000000002', 'Dr. Michael', 'Chen', 'Orthopedic Surgeon', 'MD789012', 'Board-certified orthopedic surgeon with expertise in sports medicine and joint replacement.', 200.00, '8:00 AM - 4:00 PM', 'Sports Medicine Clinic', 12),
  ('00000000-0000-0000-0000-000000000003', 'Dr. Emily', 'Rodriguez', 'Neurologist', 'MD345678', 'Neurologist specializing in stroke treatment and neurological disorders.', 180.00, '10:00 AM - 6:00 PM', 'Neurology Institute', 18)
ON CONFLICT (user_id) DO NOTHING;
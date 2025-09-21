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

-- Enable RLS policies for appointment booking (drop if exists first)
DROP POLICY IF EXISTS "Patients can create appointments" ON public.appointments;
CREATE POLICY "Patients can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (patient_id IN (
  SELECT patients.id FROM patients WHERE patients.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Patients can update their appointments" ON public.appointments;
CREATE POLICY "Patients can update their appointments" 
ON public.appointments 
FOR UPDATE 
USING (patient_id IN (
  SELECT patients.id FROM patients WHERE patients.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Doctors can update their appointments" ON public.appointments;
CREATE POLICY "Doctors can update their appointments" 
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

DROP POLICY IF EXISTS "Patients can manage their AI chat sessions" ON public.patient_ai_chat_sessions;
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
DROP TRIGGER IF EXISTS update_patient_ai_chat_sessions_updated_at ON public.patient_ai_chat_sessions;
CREATE TRIGGER update_patient_ai_chat_sessions_updated_at
BEFORE UPDATE ON public.patient_ai_chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
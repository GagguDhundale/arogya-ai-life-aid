-- Create trigger to automatically create doctor/patient profiles after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Check if this is a doctor signup
  IF NEW.raw_user_meta_data->>'user_type' = 'doctor' THEN
    INSERT INTO public.doctors (
      user_id,
      first_name,
      last_name,
      specialty,
      license_number
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      NEW.raw_user_meta_data->>'specialty',
      NEW.raw_user_meta_data->>'license_number'
    );
  -- Check if this is a patient signup
  ELSIF NEW.raw_user_meta_data->>'user_type' = 'patient' THEN
    INSERT INTO public.patients (
      user_id,
      first_name,
      last_name,
      date_of_birth
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      (NEW.raw_user_meta_data->>'date_of_birth')::date
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to handle new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add INSERT policies for doctors and patients to allow profile creation
CREATE POLICY "Users can create their own doctor profile"
ON public.doctors
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create their own patient profile" 
ON public.patients
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policies
CREATE POLICY "Doctors can update own profile"
ON public.doctors
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Patients can update own profile"
ON public.patients  
FOR UPDATE
USING (auth.uid() = user_id);
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          booking_reason: string | null
          consultation_fee: number | null
          created_at: string | null
          doctor_id: string
          duration: unknown | null
          id: string
          notes: string | null
          patient_id: string
          patient_symptoms: string | null
          preferred_time_slots: string[] | null
          scheduled_time: string
          status: string | null
          type: string | null
          updated_at: string | null
          urgency_level: string | null
          video_call_link: string | null
        }
        Insert: {
          booking_reason?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          doctor_id: string
          duration?: unknown | null
          id?: string
          notes?: string | null
          patient_id: string
          patient_symptoms?: string | null
          preferred_time_slots?: string[] | null
          scheduled_time: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          video_call_link?: string | null
        }
        Update: {
          booking_reason?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          doctor_id?: string
          duration?: unknown | null
          id?: string
          notes?: string | null
          patient_id?: string
          patient_symptoms?: string | null
          preferred_time_slots?: string[] | null
          scheduled_time?: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
          urgency_level?: string | null
          video_call_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_patient_relationships: {
        Row: {
          created_at: string | null
          doctor_id: string
          id: string
          is_active: boolean | null
          patient_id: string
          sharing_initiated_by: string | null
        }
        Insert: {
          created_at?: string | null
          doctor_id: string
          id?: string
          is_active?: boolean | null
          patient_id: string
          sharing_initiated_by?: string | null
        }
        Update: {
          created_at?: string | null
          doctor_id?: string
          id?: string
          is_active?: boolean | null
          patient_id?: string
          sharing_initiated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_patient_relationships_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctor_patient_relationships_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available_hours: string | null
          bio: string | null
          consultation_fee: number | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          license_number: string | null
          office_location: string | null
          specialty: string | null
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          available_hours?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_number?: string | null
          office_location?: string | null
          specialty?: string | null
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          available_hours?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_number?: string | null
          office_location?: string | null
          specialty?: string | null
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      patient_ai_chat_sessions: {
        Row: {
          conversation_history: Json | null
          created_at: string | null
          id: string
          patient_id: string
          updated_at: string | null
        }
        Insert: {
          conversation_history?: Json | null
          created_at?: string | null
          id?: string
          patient_id: string
          updated_at?: string | null
        }
        Update: {
          conversation_history?: Json | null
          created_at?: string | null
          id?: string
          patient_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_ai_chat_sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_air_quality_alerts: {
        Row: {
          alert_level: string
          alert_message: string
          created_at: string | null
          id: string
          patient_id: string
          pollutant_type: string | null
        }
        Insert: {
          alert_level: string
          alert_message: string
          created_at?: string | null
          id?: string
          patient_id: string
          pollutant_type?: string | null
        }
        Update: {
          alert_level?: string
          alert_message?: string
          created_at?: string | null
          id?: string
          patient_id?: string
          pollutant_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_patient"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_air_quality_alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_air_quality_logs: {
        Row: {
          aqi_level: string
          created_at: string | null
          id: string
          logged_at: string | null
          overall_aqi: number
          patient_id: string
          pm10: number
          pm25: number
        }
        Insert: {
          aqi_level: string
          created_at?: string | null
          id?: string
          logged_at?: string | null
          overall_aqi: number
          patient_id: string
          pm10: number
          pm25: number
        }
        Update: {
          aqi_level?: string
          created_at?: string | null
          id?: string
          logged_at?: string | null
          overall_aqi?: number
          patient_id?: string
          pm10?: number
          pm25?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_air_quality_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_air_quality_recommendations: {
        Row: {
          id: string
          recommendation_text: string
          trigger_type: string
          trigger_value: string
        }
        Insert: {
          id?: string
          recommendation_text: string
          trigger_type: string
          trigger_value: string
        }
        Update: {
          id?: string
          recommendation_text?: string
          trigger_type?: string
          trigger_value?: string
        }
        Relationships: []
      }
      patient_alert_settings: {
        Row: {
          created_at: string | null
          enable_notifications: boolean | null
          id: string
          is_auto_detected: boolean | null
          location: string | null
          patient_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enable_notifications?: boolean | null
          id?: string
          is_auto_detected?: boolean | null
          location?: string | null
          patient_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enable_notifications?: boolean | null
          id?: string
          is_auto_detected?: boolean | null
          location?: string | null
          patient_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_alert_settings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_allergies: {
        Row: {
          allergy_name: string
          created_at: string | null
          id: string
          patient_id: string
          severity: string | null
        }
        Insert: {
          allergy_name: string
          created_at?: string | null
          id?: string
          patient_id: string
          severity?: string | null
        }
        Update: {
          allergy_name?: string
          created_at?: string | null
          id?: string
          patient_id?: string
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_food_entries: {
        Row: {
          calories: number
          carbs_g: number | null
          consumed_at: string | null
          created_at: string | null
          fat_g: number | null
          food_name: string
          id: string
          meal_type_id: string | null
          patient_id: string
          protein_g: number | null
        }
        Insert: {
          calories: number
          carbs_g?: number | null
          consumed_at?: string | null
          created_at?: string | null
          fat_g?: number | null
          food_name: string
          id?: string
          meal_type_id?: string | null
          patient_id: string
          protein_g?: number | null
        }
        Update: {
          calories?: number
          carbs_g?: number | null
          consumed_at?: string | null
          created_at?: string | null
          fat_g?: number | null
          food_name?: string
          id?: string
          meal_type_id?: string | null
          patient_id?: string
          protein_g?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_food_entries_meal_type_id_fkey"
            columns: ["meal_type_id"]
            isOneToOne: false
            referencedRelation: "patient_meal_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_food_entries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_meal_types: {
        Row: {
          id: string
          type_name: string
        }
        Insert: {
          id?: string
          type_name: string
        }
        Update: {
          id?: string
          type_name?: string
        }
        Relationships: []
      }
      patient_mood_logs: {
        Row: {
          ai_feedback: string | null
          ai_risk_assessment: string | null
          created_at: string | null
          id: string
          mood: string
          patient_id: string
          thoughts: string | null
        }
        Insert: {
          ai_feedback?: string | null
          ai_risk_assessment?: string | null
          created_at?: string | null
          id?: string
          mood: string
          patient_id: string
          thoughts?: string | null
        }
        Update: {
          ai_feedback?: string | null
          ai_risk_assessment?: string | null
          created_at?: string | null
          id?: string
          mood?: string
          patient_id?: string
          thoughts?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_mood_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_symptom_checks: {
        Row: {
          ai_assessment: string
          ai_confidence: number | null
          created_at: string | null
          id: string
          patient_id: string
          risk_level: string
          symptoms_text: string
        }
        Insert: {
          ai_assessment: string
          ai_confidence?: number | null
          created_at?: string | null
          id?: string
          patient_id: string
          risk_level: string
          symptoms_text: string
        }
        Update: {
          ai_assessment?: string
          ai_confidence?: number | null
          created_at?: string | null
          id?: string
          patient_id?: string
          risk_level?: string
          symptoms_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_patient"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_symptom_checks_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_vaccine_doses: {
        Row: {
          administered_by_doctor_id: string | null
          administered_date: string | null
          created_at: string | null
          dose_number: number
          due_date: string
          id: string
          updated_at: string | null
          vaccine_id: string
        }
        Insert: {
          administered_by_doctor_id?: string | null
          administered_date?: string | null
          created_at?: string | null
          dose_number: number
          due_date: string
          id?: string
          updated_at?: string | null
          vaccine_id: string
        }
        Update: {
          administered_by_doctor_id?: string | null
          administered_date?: string | null
          created_at?: string | null
          dose_number?: number
          due_date?: string
          id?: string
          updated_at?: string | null
          vaccine_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_vaccine_doses_administered_by_doctor_id_fkey"
            columns: ["administered_by_doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_vaccine_doses_vaccine_id_fkey"
            columns: ["vaccine_id"]
            isOneToOne: false
            referencedRelation: "patient_vaccines"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_vaccines: {
        Row: {
          created_at: string | null
          doctor_id: string | null
          health_condition: string | null
          id: string
          name: string
          patient_id: string
          total_doses_required: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          doctor_id?: string | null
          health_condition?: string | null
          id?: string
          name: string
          patient_id: string
          total_doses_required?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          doctor_id?: string | null
          health_condition?: string | null
          id?: string
          name?: string
          patient_id?: string
          total_doses_required?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_vaccines_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_vaccines_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_water_intake: {
        Row: {
          amount_ml: number
          consumed_at: string | null
          created_at: string | null
          id: string
          patient_id: string
        }
        Insert: {
          amount_ml: number
          consumed_at?: string | null
          created_at?: string | null
          id?: string
          patient_id: string
        }
        Update: {
          amount_ml?: number
          consumed_at?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_water_intake_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_wellbeing_resources: {
        Row: {
          description: string | null
          id: string
          operational_hours: string | null
          organization_name: string
          phone_number: string
        }
        Insert: {
          description?: string | null
          id?: string
          operational_hours?: string | null
          organization_name: string
          phone_number: string
        }
        Update: {
          description?: string | null
          id?: string
          operational_hours?: string | null
          organization_name?: string
          phone_number?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          created_at: string | null
          current_symptoms: string | null
          date_of_birth: string | null
          emergency_contact: string | null
          first_name: string | null
          id: string
          last_name: string | null
          medical_history: string | null
          pain_level: number | null
          phone_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_symptoms?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          medical_history?: string | null
          pain_level?: number | null
          phone_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_symptoms?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          medical_history?: string | null
          pain_level?: number | null
          phone_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shared_health_reports: {
        Row: {
          ai_insights: string | null
          created_at: string | null
          doctor_id: string
          id: string
          is_urgent: boolean | null
          patient_id: string
          relationship_id: string
          report_data: Json
          title: string
        }
        Insert: {
          ai_insights?: string | null
          created_at?: string | null
          doctor_id: string
          id?: string
          is_urgent?: boolean | null
          patient_id: string
          relationship_id: string
          report_data: Json
          title: string
        }
        Update: {
          ai_insights?: string | null
          created_at?: string | null
          doctor_id?: string
          id?: string
          is_urgent?: boolean | null
          patient_id?: string
          relationship_id?: string
          report_data?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_health_reports_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_health_reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_health_reports_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "doctor_patient_relationships"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_patient_activity_feed: {
        Args: { p_patient_id: string }
        Returns: {
          activity_type: string
          created_at: string
          subtitle: string
          title: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

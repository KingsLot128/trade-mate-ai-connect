export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_decisions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          decision_type: string
          description: string
          estimated_value: string | null
          id: string
          impact: string
          priority: number | null
          reasoning: string | null
          scheduled_for: string | null
          status: string | null
          time_to_implement: string | null
          title: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          decision_type: string
          description: string
          estimated_value?: string | null
          id?: string
          impact: string
          priority?: number | null
          reasoning?: string | null
          scheduled_for?: string | null
          status?: string | null
          time_to_implement?: string | null
          title: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          decision_type?: string
          description?: string
          estimated_value?: string | null
          id?: string
          impact?: string
          priority?: number | null
          reasoning?: string | null
          scheduled_for?: string | null
          status?: string | null
          time_to_implement?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string | null
          id: string
          scheduled_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          scheduled_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          scheduled_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      automation_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data: Json
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      business_insights: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          data_source: Json | null
          description: string
          expires_at: string | null
          id: string
          impact_estimation: string | null
          insight_type: string
          title: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          data_source?: Json | null
          description: string
          expires_at?: string | null
          id?: string
          impact_estimation?: string | null
          insight_type: string
          title: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          data_source?: Json | null
          description?: string
          expires_at?: string | null
          id?: string
          impact_estimation?: string | null
          insight_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      business_metrics: {
        Row: {
          context: Json | null
          id: string
          metric_type: string
          recorded_at: string | null
          user_id: string
          value: number
        }
        Insert: {
          context?: Json | null
          id?: string
          metric_type: string
          recorded_at?: string | null
          user_id: string
          value: number
        }
        Update: {
          context?: Json | null
          id?: string
          metric_type?: string
          recorded_at?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      business_settings: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      calls: {
        Row: {
          customer_id: string | null
          id: string
          notes: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          customer_id?: string | null
          id?: string
          notes?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          customer_id?: string | null
          id?: string
          notes?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          custom_fields: Json | null
          email: string | null
          external_id: string | null
          id: string
          integration_id: string | null
          job_title: string | null
          last_contact_date: string | null
          lead_score: number | null
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          job_title?: string | null
          last_contact_date?: string | null
          lead_score?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          job_title?: string | null
          last_contact_date?: string | null
          lead_score?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_deals: {
        Row: {
          actual_close_date: string | null
          amount: number | null
          contact_id: string | null
          created_at: string
          custom_fields: Json | null
          description: string | null
          expected_close_date: string | null
          external_id: string | null
          id: string
          integration_id: string | null
          name: string
          probability: number | null
          stage: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_close_date?: string | null
          amount?: number | null
          contact_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          name: string
          probability?: number | null
          stage?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_close_date?: string | null
          amount?: number | null
          contact_id?: string | null
          created_at?: string
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          name?: string
          probability?: number | null
          stage?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_invoices: {
        Row: {
          amount: number
          contact_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          external_id: string | null
          id: string
          integration_id: string | null
          invoice_number: string
          line_items: Json | null
          paid_date: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          invoice_number: string
          line_items?: Json | null
          paid_date?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          invoice_number?: string
          line_items?: Json | null
          paid_date?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_invoices_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_invoices_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          best_contact_time: string | null
          communication_preference: string | null
          competition_level: string | null
          created_at: string | null
          decision_maker_type: string | null
          email: string | null
          geographic_distance: string | null
          id: string
          lead_source: string | null
          name: string | null
          notes: string | null
          pain_point_severity: string | null
          phone: string | null
          project_scope: string | null
          project_value_max: number | null
          project_value_min: number | null
          property_type: string | null
          relationship_stage: string | null
          service_type: string | null
          tags: string[] | null
          timeline_urgency: string | null
          user_id: string
        }
        Insert: {
          best_contact_time?: string | null
          communication_preference?: string | null
          competition_level?: string | null
          created_at?: string | null
          decision_maker_type?: string | null
          email?: string | null
          geographic_distance?: string | null
          id?: string
          lead_source?: string | null
          name?: string | null
          notes?: string | null
          pain_point_severity?: string | null
          phone?: string | null
          project_scope?: string | null
          project_value_max?: number | null
          project_value_min?: number | null
          property_type?: string | null
          relationship_stage?: string | null
          service_type?: string | null
          tags?: string[] | null
          timeline_urgency?: string | null
          user_id: string
        }
        Update: {
          best_contact_time?: string | null
          communication_preference?: string | null
          competition_level?: string | null
          created_at?: string | null
          decision_maker_type?: string | null
          email?: string | null
          geographic_distance?: string | null
          id?: string
          lead_source?: string | null
          name?: string | null
          notes?: string | null
          pain_point_severity?: string | null
          phone?: string | null
          project_scope?: string | null
          project_value_max?: number | null
          project_value_min?: number | null
          property_type?: string | null
          relationship_stage?: string | null
          service_type?: string | null
          tags?: string[] | null
          timeline_urgency?: string | null
          user_id?: string
        }
        Relationships: []
      }
      decision_interactions: {
        Row: {
          action: string
          created_at: string | null
          decision_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          decision_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          decision_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      enhanced_recommendations: {
        Row: {
          confidence_score: number | null
          content: Json
          created_at: string | null
          estimated_read_time: number | null
          expected_impact: string | null
          hook: string
          id: string
          is_active: boolean | null
          personalized_score: number | null
          priority_score: number | null
          reasoning: string
          recommendation_id: string
          recommendation_type: string
          stream_type: string | null
          time_to_implement: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          content: Json
          created_at?: string | null
          estimated_read_time?: number | null
          expected_impact?: string | null
          hook: string
          id?: string
          is_active?: boolean | null
          personalized_score?: number | null
          priority_score?: number | null
          reasoning: string
          recommendation_id: string
          recommendation_type: string
          stream_type?: string | null
          time_to_implement?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          content?: Json
          created_at?: string | null
          estimated_read_time?: number | null
          expected_impact?: string | null
          hook?: string
          id?: string
          is_active?: boolean | null
          personalized_score?: number | null
          priority_score?: number | null
          reasoning?: string
          recommendation_id?: string
          recommendation_type?: string
          stream_type?: string | null
          time_to_implement?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      integrations: {
        Row: {
          access_token: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          provider: string
          refresh_token: string | null
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider: string
          refresh_token?: string | null
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider?: string
          refresh_token?: string | null
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      magic_link_tokens: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          quiz_data: Json
          token: string
          user_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          quiz_data: Json
          token: string
          user_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          quiz_data?: Json
          token?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          biggest_challenge: string | null
          business_goals: string | null
          business_name: string | null
          chaos_score: number | null
          clarity_zone: string | null
          competition_level: string | null
          created_at: string | null
          customer_acquisition_method: string | null
          daily_overwhelm_score: number | null
          email: string | null
          full_name: string | null
          id: string
          industry: string | null
          industry_percentile: number | null
          onboarding_step: string | null
          phone: string | null
          pricing_strategy: string | null
          primary_service_types: string[] | null
          quiz_completed_at: string | null
          revenue_predictability_score: number | null
          seasonal_patterns: string | null
          service_area_radius: number | null
          setup_preference: string | null
          target_customer_type: string | null
          typical_project_range_max: number | null
          typical_project_range_min: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          biggest_challenge?: string | null
          business_goals?: string | null
          business_name?: string | null
          chaos_score?: number | null
          clarity_zone?: string | null
          competition_level?: string | null
          created_at?: string | null
          customer_acquisition_method?: string | null
          daily_overwhelm_score?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          industry_percentile?: number | null
          onboarding_step?: string | null
          phone?: string | null
          pricing_strategy?: string | null
          primary_service_types?: string[] | null
          quiz_completed_at?: string | null
          revenue_predictability_score?: number | null
          seasonal_patterns?: string | null
          service_area_radius?: number | null
          setup_preference?: string | null
          target_customer_type?: string | null
          typical_project_range_max?: number | null
          typical_project_range_min?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          biggest_challenge?: string | null
          business_goals?: string | null
          business_name?: string | null
          chaos_score?: number | null
          clarity_zone?: string | null
          competition_level?: string | null
          created_at?: string | null
          customer_acquisition_method?: string | null
          daily_overwhelm_score?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          industry_percentile?: number | null
          onboarding_step?: string | null
          phone?: string | null
          pricing_strategy?: string | null
          primary_service_types?: string[] | null
          quiz_completed_at?: string | null
          revenue_predictability_score?: number | null
          seasonal_patterns?: string | null
          service_area_radius?: number | null
          setup_preference?: string | null
          target_customer_type?: string | null
          typical_project_range_max?: number | null
          typical_project_range_min?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recommendation_interactions: {
        Row: {
          business_impact: Json | null
          created_at: string | null
          feedback_rating: number | null
          id: string
          interaction_type: string
          metadata: Json | null
          outcome_reported: string | null
          recommendation_id: string
          scroll_depth: number | null
          time_spent: number | null
          user_id: string
        }
        Insert: {
          business_impact?: Json | null
          created_at?: string | null
          feedback_rating?: number | null
          id?: string
          interaction_type: string
          metadata?: Json | null
          outcome_reported?: string | null
          recommendation_id: string
          scroll_depth?: number | null
          time_spent?: number | null
          user_id: string
        }
        Update: {
          business_impact?: Json | null
          created_at?: string | null
          feedback_rating?: number | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
          outcome_reported?: string | null
          recommendation_id?: string
          scroll_depth?: number | null
          time_spent?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_quiz_responses: {
        Row: {
          chaos_contribution: number | null
          created_at: string | null
          id: string
          question_id: string
          response: Json
          user_id: string
        }
        Insert: {
          chaos_contribution?: number | null
          created_at?: string | null
          id?: string
          question_id: string
          response: Json
          user_id: string
        }
        Update: {
          chaos_contribution?: number | null
          created_at?: string | null
          id?: string
          question_id?: string
          response?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_setup_preferences: {
        Row: {
          created_at: string | null
          id: string
          onboarding_completed: boolean | null
          preferences_data: Json | null
          setup_preference: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          onboarding_completed?: boolean | null
          preferences_data?: Json | null
          setup_preference: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          onboarding_completed?: boolean | null
          preferences_data?: Json | null
          setup_preference?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workflow_rules: {
        Row: {
          actions: Json | null
          conditions: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          trigger_event: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actions?: Json | null
          conditions?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          trigger_event: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actions?: Json | null
          conditions?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          trigger_event?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

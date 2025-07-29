export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          action_details: Json | null
          action_type: string
          admin_user_id: string
          created_at: string | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          admin_user_id: string
          created_at?: string | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          admin_user_id?: string
          created_at?: string | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
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
      ai_preferences: {
        Row: {
          benchmarking: boolean | null
          competitive: boolean | null
          complexity: string | null
          created_at: string | null
          focus_areas: string[] | null
          frequency: string | null
          id: string
          predictive: boolean | null
          preferences_data: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          benchmarking?: boolean | null
          competitive?: boolean | null
          complexity?: string | null
          created_at?: string | null
          focus_areas?: string[] | null
          frequency?: string | null
          id?: string
          predictive?: boolean | null
          preferences_data?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          benchmarking?: boolean | null
          competitive?: boolean | null
          complexity?: string | null
          created_at?: string | null
          focus_areas?: string[] | null
          frequency?: string | null
          id?: string
          predictive?: boolean | null
          preferences_data?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          actions: Json | null
          business_sizes: string[] | null
          complexity: string | null
          created_at: string | null
          description: string | null
          engagement_data: Json | null
          expected_impact: string | null
          expires_at: string | null
          hook: string | null
          id: string
          industries: string[] | null
          priority: string | null
          reasoning: string | null
          recommendation_type: string
          source: string | null
          status: string | null
          time_to_implement: string | null
          title: string
          user_id: string
        }
        Insert: {
          actions?: Json | null
          business_sizes?: string[] | null
          complexity?: string | null
          created_at?: string | null
          description?: string | null
          engagement_data?: Json | null
          expected_impact?: string | null
          expires_at?: string | null
          hook?: string | null
          id?: string
          industries?: string[] | null
          priority?: string | null
          reasoning?: string | null
          recommendation_type: string
          source?: string | null
          status?: string | null
          time_to_implement?: string | null
          title: string
          user_id: string
        }
        Update: {
          actions?: Json | null
          business_sizes?: string[] | null
          complexity?: string | null
          created_at?: string | null
          description?: string | null
          engagement_data?: Json | null
          expected_impact?: string | null
          expires_at?: string | null
          hook?: string | null
          id?: string
          industries?: string[] | null
          priority?: string | null
          reasoning?: string | null
          recommendation_type?: string
          source?: string | null
          status?: string | null
          time_to_implement?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_name: string
          last_used_at: string | null
          permissions: string[] | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name: string
          last_used_at?: string | null
          permissions?: string[] | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string
          last_used_at?: string | null
          permissions?: string[] | null
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
      clarity_points: {
        Row: {
          created_at: string | null
          description: string
          id: string
          point_type: string
          points: number
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          point_type: string
          points?: number
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          point_type?: string
          points?: number
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
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
      custom_widgets: {
        Row: {
          created_at: string | null
          data_source: string | null
          height: number | null
          id: string
          is_active: boolean | null
          position_x: number | null
          position_y: number | null
          refresh_interval: number | null
          updated_at: string | null
          user_id: string
          widget_config: Json
          widget_name: string
          widget_type: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          data_source?: string | null
          height?: number | null
          id?: string
          is_active?: boolean | null
          position_x?: number | null
          position_y?: number | null
          refresh_interval?: number | null
          updated_at?: string | null
          user_id: string
          widget_config?: Json
          widget_name: string
          widget_type: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          data_source?: string | null
          height?: number | null
          id?: string
          is_active?: boolean | null
          position_x?: number | null
          position_y?: number | null
          refresh_interval?: number | null
          updated_at?: string | null
          user_id?: string
          widget_config?: Json
          widget_name?: string
          widget_type?: string
          width?: number | null
        }
        Relationships: []
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
      dashboard_preferences: {
        Row: {
          active_widgets: Json | null
          color_theme: string | null
          created_at: string | null
          custom_metrics: Json | null
          dashboard_role: string | null
          id: string
          layout_config: Json | null
          quick_actions: Json | null
          updated_at: string | null
          user_id: string
          widget_settings: Json | null
        }
        Insert: {
          active_widgets?: Json | null
          color_theme?: string | null
          created_at?: string | null
          custom_metrics?: Json | null
          dashboard_role?: string | null
          id?: string
          layout_config?: Json | null
          quick_actions?: Json | null
          updated_at?: string | null
          user_id: string
          widget_settings?: Json | null
        }
        Update: {
          active_widgets?: Json | null
          color_theme?: string | null
          created_at?: string | null
          custom_metrics?: Json | null
          dashboard_role?: string | null
          id?: string
          layout_config?: Json | null
          quick_actions?: Json | null
          updated_at?: string | null
          user_id?: string
          widget_settings?: Json | null
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
      email_accounts: {
        Row: {
          access_token: string | null
          created_at: string
          email_address: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          provider: string
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          email_address: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          email_address?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_automation_rules: {
        Row: {
          actions: Json
          created_at: string
          id: string
          is_active: boolean | null
          rule_name: string
          trigger_conditions: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          actions: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          rule_name: string
          trigger_conditions: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          actions?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          rule_name?: string
          trigger_conditions?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_conversations: {
        Row: {
          clarity_score: number | null
          contact_id: string | null
          conversation_stage: string | null
          created_at: string
          deal_id: string | null
          email_account_id: string
          id: string
          last_activity_at: string | null
          participants: Json | null
          sentiment_score: number | null
          subject: string | null
          thread_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          clarity_score?: number | null
          contact_id?: string | null
          conversation_stage?: string | null
          created_at?: string
          deal_id?: string | null
          email_account_id: string
          id?: string
          last_activity_at?: string | null
          participants?: Json | null
          sentiment_score?: number | null
          subject?: string | null
          thread_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          clarity_score?: number | null
          contact_id?: string | null
          conversation_stage?: string | null
          created_at?: string
          deal_id?: string | null
          email_account_id?: string
          id?: string
          last_activity_at?: string | null
          participants?: Json | null
          sentiment_score?: number | null
          subject?: string | null
          thread_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_conversations_account"
            columns: ["email_account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conversations_contact"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conversations_deal"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      email_drafts: {
        Row: {
          ai_generated: boolean | null
          body_html: string | null
          body_text: string | null
          conversation_id: string | null
          created_at: string
          id: string
          is_sent: boolean | null
          scheduled_for: string | null
          subject: string | null
          template_name: string | null
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          body_html?: string | null
          body_text?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_sent?: boolean | null
          scheduled_for?: string | null
          subject?: string | null
          template_name?: string | null
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          body_html?: string | null
          body_text?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_sent?: boolean | null
          scheduled_for?: string | null
          subject?: string | null
          template_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_drafts_conversation"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "email_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_insights: {
        Row: {
          confidence_score: number | null
          conversation_id: string
          created_at: string
          description: string
          id: string
          insight_type: string
          is_dismissed: boolean | null
          suggested_actions: Json | null
          title: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          conversation_id: string
          created_at?: string
          description: string
          id?: string
          insight_type: string
          is_dismissed?: boolean | null
          suggested_actions?: Json | null
          title: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          conversation_id?: string
          created_at?: string
          description?: string
          id?: string
          insight_type?: string
          is_dismissed?: boolean | null
          suggested_actions?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_insights_conversation"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "email_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_messages: {
        Row: {
          body_html: string | null
          body_text: string | null
          conversation_id: string
          created_at: string
          has_attachments: boolean | null
          id: string
          is_outbound: boolean | null
          message_date: string
          message_id: string
          recipient_emails: Json | null
          response_time_hours: number | null
          sender_email: string
          sentiment_score: number | null
          subject: string | null
          urgency_score: number | null
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          conversation_id: string
          created_at?: string
          has_attachments?: boolean | null
          id?: string
          is_outbound?: boolean | null
          message_date: string
          message_id: string
          recipient_emails?: Json | null
          response_time_hours?: number | null
          sender_email: string
          sentiment_score?: number | null
          subject?: string | null
          urgency_score?: number | null
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          conversation_id?: string
          created_at?: string
          has_attachments?: boolean | null
          id?: string
          is_outbound?: boolean | null
          message_date?: string
          message_id?: string
          recipient_emails?: Json | null
          response_time_hours?: number | null
          sender_email?: string
          sentiment_score?: number | null
          subject?: string | null
          urgency_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_messages_conversation"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "email_conversations"
            referencedColumns: ["id"]
          },
        ]
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
      follow_up_actions: {
        Row: {
          action_type: string
          content: string | null
          created_at: string | null
          executed_at: string | null
          id: string
          opportunity_id: string | null
          result: string | null
          scheduled_for: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          content?: string | null
          created_at?: string | null
          executed_at?: string | null
          id?: string
          opportunity_id?: string | null
          result?: string | null
          scheduled_for?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          content?: string | null
          created_at?: string | null
          executed_at?: string | null
          id?: string
          opportunity_id?: string | null
          result?: string | null
          scheduled_for?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_actions_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "revenue_opportunities"
            referencedColumns: ["id"]
          },
        ]
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
          account_status: string | null
          biggest_challenge: string | null
          business_goals: string | null
          business_health_score: number | null
          business_level: number | null
          business_name: string | null
          business_size: string | null
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
          last_login_at: string | null
          location: string | null
          next_billing_date: string | null
          onboarding_step: string | null
          phone: string | null
          photo_url: string | null
          pricing_strategy: string | null
          primary_goal: string | null
          primary_service_types: string[] | null
          quiz_completed_at: string | null
          revenue_predictability_score: number | null
          seasonal_patterns: string | null
          service_area_radius: number | null
          setup_preference: string | null
          stripe_customer_id: string | null
          subscription_ends_at: string | null
          subscription_status: string | null
          subscription_tier: string | null
          suspended_at: string | null
          suspended_by: string | null
          suspension_reason: string | null
          target_customer_type: string | null
          target_revenue: string | null
          trial_ends_at: string | null
          typical_project_range_max: number | null
          typical_project_range_min: number | null
          updated_at: string | null
          user_id: string
          website_url: string | null
          years_in_business: number | null
        }
        Insert: {
          account_status?: string | null
          biggest_challenge?: string | null
          business_goals?: string | null
          business_health_score?: number | null
          business_level?: number | null
          business_name?: string | null
          business_size?: string | null
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
          last_login_at?: string | null
          location?: string | null
          next_billing_date?: string | null
          onboarding_step?: string | null
          phone?: string | null
          photo_url?: string | null
          pricing_strategy?: string | null
          primary_goal?: string | null
          primary_service_types?: string[] | null
          quiz_completed_at?: string | null
          revenue_predictability_score?: number | null
          seasonal_patterns?: string | null
          service_area_radius?: number | null
          setup_preference?: string | null
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspension_reason?: string | null
          target_customer_type?: string | null
          target_revenue?: string | null
          trial_ends_at?: string | null
          typical_project_range_max?: number | null
          typical_project_range_min?: number | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
          years_in_business?: number | null
        }
        Update: {
          account_status?: string | null
          biggest_challenge?: string | null
          business_goals?: string | null
          business_health_score?: number | null
          business_level?: number | null
          business_name?: string | null
          business_size?: string | null
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
          last_login_at?: string | null
          location?: string | null
          next_billing_date?: string | null
          onboarding_step?: string | null
          phone?: string | null
          photo_url?: string | null
          pricing_strategy?: string | null
          primary_goal?: string | null
          primary_service_types?: string[] | null
          quiz_completed_at?: string | null
          revenue_predictability_score?: number | null
          seasonal_patterns?: string | null
          service_area_radius?: number | null
          setup_preference?: string | null
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspension_reason?: string | null
          target_customer_type?: string | null
          target_revenue?: string | null
          trial_ends_at?: string | null
          typical_project_range_max?: number | null
          typical_project_range_min?: number | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
          years_in_business?: number | null
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
      revenue_opportunities: {
        Row: {
          ai_analysis: Json | null
          confidence_score: number | null
          conversion_date: string | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          estimated_value: number | null
          follow_up_date: string | null
          id: string
          last_contacted_at: string | null
          opportunity_type: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          confidence_score?: number | null
          conversion_date?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          estimated_value?: number | null
          follow_up_date?: string | null
          id?: string
          last_contacted_at?: string | null
          opportunity_type: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          confidence_score?: number | null
          conversion_date?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          estimated_value?: number | null
          follow_up_date?: string | null
          id?: string
          last_contacted_at?: string | null
          opportunity_type?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_opportunities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          amount_cents: number | null
          billing_interval: string | null
          created_at: string
          currency: string | null
          email: string
          id: string
          next_billing_date: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_ends_at: string | null
          subscription_starts_at: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents?: number | null
          billing_interval?: string | null
          created_at?: string
          currency?: string | null
          email: string
          id?: string
          next_billing_date?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number | null
          billing_interval?: string | null
          created_at?: string
          currency?: string | null
          email?: string
          id?: string
          next_billing_date?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          plan_id: string
          price_monthly_cents: number
          price_yearly_cents: number | null
          stripe_monthly_price_id: string | null
          stripe_yearly_price_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          plan_id: string
          price_monthly_cents: number
          price_yearly_cents?: number | null
          stripe_monthly_price_id?: string | null
          stripe_yearly_price_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          plan_id?: string
          price_monthly_cents?: number
          price_yearly_cents?: number | null
          stripe_monthly_price_id?: string | null
          stripe_yearly_price_id?: string | null
        }
        Relationships: []
      }
      unified_business_profiles: {
        Row: {
          ai_preferences: Json | null
          created_at: string | null
          id: string
          integration_data: Json | null
          intelligence_score: number | null
          last_updated: string | null
          profile_completeness: number | null
          profile_data: Json | null
          user_id: string
          website_data: Json | null
        }
        Insert: {
          ai_preferences?: Json | null
          created_at?: string | null
          id?: string
          integration_data?: Json | null
          intelligence_score?: number | null
          last_updated?: string | null
          profile_completeness?: number | null
          profile_data?: Json | null
          user_id: string
          website_data?: Json | null
        }
        Update: {
          ai_preferences?: Json | null
          created_at?: string | null
          id?: string
          integration_data?: Json | null
          intelligence_score?: number | null
          last_updated?: string | null
          profile_completeness?: number | null
          profile_data?: Json | null
          user_id?: string
          website_data?: Json | null
        }
        Relationships: []
      }
      user_engagement: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          page_path: string | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_photos: {
        Row: {
          created_at: string | null
          file_size: number | null
          file_type: string | null
          id: string
          photo_type: string | null
          photo_url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          photo_type?: string | null
          photo_url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          photo_type?: string | null
          photo_url?: string
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
      website_analysis: {
        Row: {
          analysis_data: Json | null
          conversion_score: number | null
          created_at: string | null
          design_score: number | null
          id: string
          last_analyzed: string | null
          recommendations: Json | null
          seo_score: number | null
          user_id: string
          website_url: string
        }
        Insert: {
          analysis_data?: Json | null
          conversion_score?: number | null
          created_at?: string | null
          design_score?: number | null
          id?: string
          last_analyzed?: string | null
          recommendations?: Json | null
          seo_score?: number | null
          user_id: string
          website_url: string
        }
        Update: {
          analysis_data?: Json | null
          conversion_score?: number | null
          created_at?: string | null
          design_score?: number | null
          id?: string
          last_analyzed?: string | null
          recommendations?: Json | null
          seo_score?: number | null
          user_id?: string
          website_url?: string
        }
        Relationships: []
      }
      white_label_configs: {
        Row: {
          agency_name: string
          brand_colors: Json
          created_at: string | null
          custom_domain: string | null
          features: string[] | null
          id: string
          is_active: boolean | null
          logo: string | null
          monthly_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          agency_name: string
          brand_colors?: Json
          created_at?: string | null
          custom_domain?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          monthly_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          agency_name?: string
          brand_colors?: Json
          created_at?: string | null
          custom_domain?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          monthly_revenue?: number | null
          updated_at?: string | null
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
      assign_admin_roles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "super_admin"
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
    Enums: {
      app_role: ["admin", "user", "super_admin"],
    },
  },
} as const

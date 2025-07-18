import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yahcbigzuknluctdoaba.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaGNiaWd6dWtubHVjdGRvYWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjQ1NTUsImV4cCI6MjA2NjEwMDU1NX0.vmHLbS-oaN0AJtk6d5Ow__pjj76bC0P_BU9FpqnDyIA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Enhanced database types for better type safety
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          business_name: string | null
          phone: string | null
          industry: string | null
          business_size: string | null
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          business_name?: string | null
          phone?: string | null
          industry?: string | null
          business_size?: string | null
          trial_ends_at?: string | null
        }
        Update: {
          business_name?: string | null
          phone?: string | null
          industry?: string | null
          business_size?: string | null
          trial_ends_at?: string | null
        }
      }
      demo_requests: {
        Row: {
          id: string
          email: string
          name: string | null
          company: string | null
          requested_at: string
          status: 'pending' | 'contacted' | 'converted'
          notes: string | null
          created_at: string
        }
        Insert: {
          email: string
          name?: string | null
          company?: string | null
          requested_at?: string
          status?: 'pending' | 'contacted' | 'converted'
          notes?: string | null
        }
        Update: {
          name?: string | null
          company?: string | null
          status?: 'pending' | 'contacted' | 'converted'
          notes?: string | null
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          message: string
          submitted_at: string
          status: 'new' | 'contacted' | 'qualified' | 'closed'
          created_at: string
        }
        Insert: {
          name: string
          email: string
          company?: string | null
          message: string
          submitted_at?: string
          status?: 'new' | 'contacted' | 'qualified' | 'closed'
        }
        Update: {
          status?: 'new' | 'contacted' | 'qualified' | 'closed'
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          notes: string | null
          status: 'active' | 'inactive' | 'prospect'
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
          status?: 'active' | 'inactive' | 'prospect'
        }
        Update: {
          name?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
          status?: 'active' | 'inactive' | 'prospect'
        }
      }
      calls: {
        Row: {
          id: string
          user_id: string
          customer_id: string | null
          phone_number: string
          call_type: 'inbound' | 'outbound'
          status: 'answered' | 'missed' | 'scheduled' | 'completed'
          duration: number
          summary: string | null
          transcript: string | null
          recording_url: string | null
          ai_response: string | null
          recovery_status: 'pending' | 'contacted' | 'scheduled' | 'lost' | null
          follow_up_sent: boolean | null
          created_at: string
        }
        Insert: {
          user_id: string
          customer_id?: string | null
          phone_number: string
          call_type?: 'inbound' | 'outbound'
          status?: 'answered' | 'missed' | 'scheduled' | 'completed'
          duration?: number
          summary?: string | null
          transcript?: string | null
          recording_url?: string | null
          ai_response?: string | null
          recovery_status?: 'pending' | 'contacted' | 'scheduled' | 'lost' | null
          follow_up_sent?: boolean | null
        }
        Update: {
          customer_id?: string | null
          phone_number?: string
          call_type?: 'inbound' | 'outbound'
          status?: 'answered' | 'missed' | 'scheduled' | 'completed'
          duration?: number
          summary?: string | null
          transcript?: string | null
          recording_url?: string | null
          ai_response?: string | null
          recovery_status?: 'pending' | 'contacted' | 'scheduled' | 'lost' | null
          follow_up_sent?: boolean | null
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          customer_id: string
          title: string
          description: string | null
          scheduled_at: string
          duration: number
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
          location: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          customer_id: string
          title: string
          description?: string | null
          scheduled_at: string
          duration?: number
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
          location?: string | null
          notes?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          scheduled_at?: string
          duration?: number
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
          location?: string | null
          notes?: string | null
        }
      }
      business_settings: {
        Row: {
          id: string
          user_id: string
          business_hours: any
          greeting_message: string
          ai_personality: string
          auto_scheduling: boolean
          follow_up_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          business_hours?: any
          greeting_message?: string
          ai_personality?: string
          auto_scheduling?: boolean
          follow_up_enabled?: boolean
        }
        Update: {
          business_hours?: any
          greeting_message?: string
          ai_personality?: string
          auto_scheduling?: boolean
          follow_up_enabled?: boolean
        }
      }
    }
  }
}

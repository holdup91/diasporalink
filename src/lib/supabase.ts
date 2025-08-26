import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://vilghwoiddaazkuqnyfh.supabase.co"
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbGdod29pZGRhYXprdXFueWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNzQ4OTYsImV4cCI6MjA3MDY1MDg5Nn0.eKeulTzRF4ecyAeO9ke7jp2gaRFF4vvPHaWgyVR5RH4"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. URL:", !!supabaseUrl, "Key:", !!supabaseAnonKey)
  throw new Error("Missing Supabase environment variables")
}

console.log("[v0] Supabase client initialized with URL:", supabaseUrl.substring(0, 30) + "...")

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database type definitions for TypeScript support
export type Database = {
  public: {
    Tables: {
      carriers: {
        Row: {
          id: string
          full_name: string
          username: string
          email: string | null
          phone: string | null
          verified: boolean
          rating: number | null
          total_trips: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          username: string
          email?: string | null
          phone?: string | null
          verified?: boolean
          rating?: number | null
          total_trips?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          username?: string
          email?: string | null
          phone?: string | null
          verified?: boolean
          rating?: number | null
          total_trips?: number
          created_at?: string
          updated_at?: string
        }
      }
      countries: {
        Row: {
          id: number
          name_en: string
          name_fr: string | null
          name_ar: string | null
          iso_code: string | null
          flag_emoji: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name_en: string
          name_fr?: string | null
          name_ar?: string | null
          iso_code?: string | null
          flag_emoji?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name_en?: string
          name_fr?: string | null
          name_ar?: string | null
          iso_code?: string | null
          flag_emoji?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cities: {
        Row: {
          id: number
          name_en: string
          name_fr: string | null
          name_ar: string | null
          country_id: number
          latitude: number | null
          longitude: number | null
          aliases: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name_en: string
          name_fr?: string | null
          name_ar?: string | null
          country_id: number
          latitude?: number | null
          longitude?: number | null
          aliases?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name_en?: string
          name_fr?: string | null
          name_ar?: string | null
          country_id?: number
          latitude?: number | null
          longitude?: number | null
          aliases?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          url_id: string
          traveler_id: string
          origin_city_id: number
          origin_country_id: number
          destination_city_id: number
          destination_country_id: number
          departure_date: string
          price_per_kg: number
          currency: string
          available_kg: number
          notes: string | null
          origin_flag: string | null
          destination_flag: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          url_id: string
          traveler_id: string
          origin_city_id: number
          origin_country_id: number
          destination_city_id: number
          destination_country_id: number
          departure_date: string
          price_per_kg: number
          currency: string
          available_kg: number
          notes?: string | null
          origin_flag?: string | null
          destination_flag?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          url_id?: string
          traveler_id?: string
          origin_city_id?: number
          origin_country_id?: number
          destination_city_id?: number
          destination_country_id?: number
          departure_date?: string
          price_per_kg?: number
          currency?: string
          available_kg?: number
          notes?: string | null
          origin_flag?: string | null
          destination_flag?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      trip_stops: {
        Row: {
          id: string
          trip_id: string
          city_id: number
          country_id: number
          stop_order: number
          stop_type: string
          address: string | null
          availability_time: string | null
          instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          city_id: number
          country_id: number
          stop_order: number
          stop_type: string
          address?: string | null
          availability_time?: string | null
          instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          city_id?: number
          country_id?: number
          stop_order?: number
          stop_type?: string
          address?: string | null
          availability_time?: string | null
          instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trip_contacts: {
        Row: {
          id: string
          trip_id: string
          contact_type: string
          contact_value: string
          contact_label: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          contact_type: string
          contact_value: string
          contact_label?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          contact_type?: string
          contact_value?: string
          contact_label?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trip_analytics: {
        Row: {
          id: string
          trip_id: string
          views: number
          clicked_phone: boolean
          clicked_whatsapp: boolean
          clicked_messenger: boolean
          ip_address: string | null
          user_agent: string | null
          device_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          views?: number
          clicked_phone?: boolean
          clicked_whatsapp?: boolean
          clicked_messenger?: boolean
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          views?: number
          clicked_phone?: boolean
          clicked_whatsapp?: boolean
          clicked_messenger?: boolean
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      search_logs: {
        Row: {
          id: string
          origin_query: string
          destination_query: string
          results_count: number
          ip_address: string | null
          user_agent: string | null
          device_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          origin_query: string
          destination_query: string
          results_count: number
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          origin_query?: string
          destination_query?: string
          results_count?: number
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_trips_with_match_type: {
        Args: {
          origin_city_id: number | null
          origin_country_id: number
          destination_city_id: number | null
          destination_country_id: number
        }
        Returns: {
          id: string
          url_id: string
          traveler_id: string
          origin_city_id: number
          origin_country_id: number
          destination_city_id: number
          destination_country_id: number
          departure_date: string
          price_per_kg: number
          currency: string
          available_kg: number
          notes: string | null
          origin_flag: string | null
          destination_flag: string | null
          status: string
          created_at: string
          updated_at: string
          match_type: string
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

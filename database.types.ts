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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      chats: {
        Row: {
          closed_at: string | null
          created_at: string
          customer_id: string
          id: string
          is_closed: boolean | null
          order_id: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_closed?: boolean | null
          order_id: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_closed?: boolean | null
          order_id?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          base_amount: number
          commission_amount: number
          created_at: string | null
          id: string
          order_id: string | null
          rate: number
          status: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          base_amount: number
          commission_amount: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          rate?: number
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          base_amount?: number
          commission_amount?: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          rate?: number
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      fcm_tokens: {
        Row: {
          created_at: string
          device_type: string | null
          id: string
          is_active: boolean | null
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          id?: string
          is_active?: boolean | null
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_type?: string | null
          id?: string
          is_active?: boolean | null
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      laundry_go: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      locations: {
        Row: {
          coordinates: Json | null
          description: string | null
          id: string
          main_text: string | null
          place_id: string | null
          secondary_text: string | null
        }
        Insert: {
          coordinates?: Json | null
          description?: string | null
          id?: string
          main_text?: string | null
          place_id?: string | null
          secondary_text?: string | null
        }
        Update: {
          coordinates?: Json | null
          description?: string | null
          id?: string
          main_text?: string | null
          place_id?: string | null
          secondary_text?: string | null
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempted_at: string
          id: string
          identifier: string
          ip_address: string | null
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          attempted_at?: string
          id?: string
          identifier: string
          ip_address?: string | null
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          attempted_at?: string
          id?: string
          identifier?: string
          ip_address?: string | null
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: []
      }
      main_services: {
        Row: {
          id: number
          service: string
          slug: Database["public"]["Enums"]["main_services_types"]
        }
        Insert: {
          id?: number
          service: string
          slug: Database["public"]["Enums"]["main_services_types"]
        }
        Update: {
          id?: number
          service?: string
          slug?: Database["public"]["Enums"]["main_services_types"]
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          name: string | null
          order_id: string
          price: number | null
          quantity: number
          service_item_id: string | null
          service_option_id: string | null
          vendor_service_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          order_id?: string
          price?: number | null
          quantity?: number
          service_item_id?: string | null
          service_option_id?: string | null
          vendor_service_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          order_id?: string
          price?: number | null
          quantity?: number
          service_item_id?: string | null
          service_option_id?: string | null
          vendor_service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_service_item_id_fkey"
            columns: ["service_item_id"]
            isOneToOne: false
            referencedRelation: "service_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_service_option_id_fkey"
            columns: ["service_option_id"]
            isOneToOne: false
            referencedRelation: "service_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vendor_service_id_fkey"
            columns: ["vendor_service_id"]
            isOneToOne: false
            referencedRelation: "vendor_prices"
            referencedColumns: ["id"]
          },
        ]
      }
      order_timeline: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_timeline_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          delivery_details: Json | null
          delivery_fee: number | null
          id: string
          main_service_id: number
          payment_channel: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          payment_verified_at: string | null
          pickup_details: Json | null
          rider_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number | null
          total_price: number
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivery_details?: Json | null
          delivery_fee?: number | null
          id?: string
          main_service_id: number
          payment_channel?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          payment_verified_at?: string | null
          pickup_details?: Json | null
          rider_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number | null
          total_price: number
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivery_details?: Json | null
          delivery_fee?: number | null
          id?: string
          main_service_id?: number
          payment_channel?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          payment_verified_at?: string | null
          pickup_details?: Json | null
          rider_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number | null
          total_price?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_main_service_id_fkey"
            columns: ["main_service_id"]
            isOneToOne: false
            referencedRelation: "main_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last_four: string | null
          card_token: string | null
          created_at: string
          id: string
          is_default: boolean | null
          mpesa_number: string | null
          payment_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last_four?: string | null
          card_token?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          mpesa_number?: string | null
          payment_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last_four?: string | null
          card_token?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          mpesa_number?: string | null
          payment_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          email: string
          fcm_token: string | null
          full_name: string | null
          id: string
          phone: string | null
          profile_completed_at: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          signup_step: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          fcm_token?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          profile_completed_at?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          signup_step?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          fcm_token?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_completed_at?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          signup_step?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          order_id: string
          rating: number
          vendor_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          order_id: string
          rating: number
          vendor_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          order_id?: string
          rating?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      riders: {
        Row: {
          assigned_vehicle: string | null
          created_at: string
          id: string
          id_number: string
          in_process_orders: number | null
          notes: string | null
          status: string | null
          total_deliveries: number | null
          updated_at: string
          user_id: string | null
          vehicle_plate: string
          vendor_id: string
        }
        Insert: {
          assigned_vehicle?: string | null
          created_at?: string
          id?: string
          id_number: string
          in_process_orders?: number | null
          notes?: string | null
          status?: string | null
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string | null
          vehicle_plate: string
          vendor_id: string
        }
        Update: {
          assigned_vehicle?: string | null
          created_at?: string
          id?: string
          id_number?: string
          in_process_orders?: number | null
          notes?: string | null
          status?: string | null
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string | null
          vehicle_plate?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "riders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "riders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      service_items: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon_path: string | null
          id: string
          is_active: boolean | null
          main_service_id: number | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon_path?: string | null
          id?: string
          is_active?: boolean | null
          main_service_id?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon_path?: string | null
          id?: string
          is_active?: boolean | null
          main_service_id?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_items_service_id_fkey"
            columns: ["main_service_id"]
            isOneToOne: false
            referencedRelation: "main_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_options: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          service_item_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          service_item_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          service_item_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_options_service_item_id_fkey"
            columns: ["service_item_id"]
            isOneToOne: false
            referencedRelation: "service_items"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          channel: string | null
          created_at: string | null
          currency: string | null
          customer_id: string | null
          gateway_fee: number | null
          id: string
          metadata: Json | null
          net_amount: number
          order_id: string | null
          reference: string
          status: string | null
        }
        Insert: {
          amount: number
          channel?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          gateway_fee?: number | null
          id?: string
          metadata?: Json | null
          net_amount: number
          order_id?: string | null
          reference: string
          status?: string | null
        }
        Update: {
          amount?: number
          channel?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          gateway_fee?: number | null
          id?: string
          metadata?: Json | null
          net_amount?: number
          order_id?: string | null
          reference?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_approval_queue: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          priority: number | null
          queued_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          queued_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          queued_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_approval_queue_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_main_services: {
        Row: {
          created_at: string | null
          main_service_id: number
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          main_service_id: number
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          main_service_id?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_main_services_main_service_id_fkey"
            columns: ["main_service_id"]
            isOneToOne: false
            referencedRelation: "main_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_main_services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_prices: {
        Row: {
          created_at: string | null
          id: string
          is_available: boolean | null
          notes: string | null
          price: number
          service_item_id: string
          service_option_id: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          price: number
          service_item_id: string
          service_option_id?: string | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          price?: number
          service_item_id?: string
          service_option_id?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_prices_service_item_id_fkey"
            columns: ["service_item_id"]
            isOneToOne: false
            referencedRelation: "service_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_prices_service_option_id_fkey"
            columns: ["service_option_id"]
            isOneToOne: false
            referencedRelation: "service_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_prices_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_user_engagements: {
        Row: {
          created_at: string
          is_favorite: boolean | null
          last_used_at: string | null
          last_viewed_at: string | null
          orders_count: number | null
          profile_views: number | null
          updated_at: string
          used_before: boolean | null
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          is_favorite?: boolean | null
          last_used_at?: string | null
          last_viewed_at?: string | null
          orders_count?: number | null
          profile_views?: number | null
          updated_at?: string
          used_before?: boolean | null
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          is_favorite?: boolean | null
          last_used_at?: string | null
          last_viewed_at?: string | null
          orders_count?: number | null
          profile_views?: number | null
          updated_at?: string
          used_before?: boolean | null
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_user_engagements_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_users: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["vendor_user_role"]
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          role?: Database["public"]["Enums"]["vendor_user_role"]
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["vendor_user_role"]
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_users_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          admin_id: string
          approved_at: string | null
          business_license_url: string | null
          business_name: string | null
          created_at: string
          email: string
          id: string
          location_id: string | null
          logo_url: string | null
          operation_hours: Json | null
          phone: string | null
          profile_complete: boolean | null
          profile_completed_at: string | null
          rejected_at: string | null
          rejection_reason: string | null
          status: string | null
          suspended_at: string | null
          suspension_reason: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_id: string
          approved_at?: string | null
          business_license_url?: string | null
          business_name?: string | null
          created_at?: string
          email: string
          id?: string
          location_id?: string | null
          logo_url?: string | null
          operation_hours?: Json | null
          phone?: string | null
          profile_complete?: boolean | null
          profile_completed_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_id?: string
          approved_at?: string | null
          business_license_url?: string | null
          business_name?: string | null
          created_at?: string
          email?: string
          id?: string
          location_id?: string | null
          logo_url?: string | null
          operation_hours?: Json | null
          phone?: string | null
          profile_complete?: boolean | null
          profile_completed_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          suspended_at?: string | null
          suspension_reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_vendor: {
        Args: { admin_user_id: string; vendor_id_input: string }
        Returns: undefined
      }
      complete_vendor_profile: {
        Args: { user_id: string; vendor_id: string }
        Returns: undefined
      }
      create_order: {
        Args: {
          p_customer_id: string
          p_items: Json
          p_order_items: Json
          p_pickup_details: Json
          p_status: string
          p_total_price: number
          p_vendor_id: string
        }
        Returns: string
      }
      delete_user: { Args: never; Returns: undefined }
      fetch_riders: {
        Args: {
          p_page?: number
          p_search?: string
          p_size?: number
          p_status?: string
          p_vendor_id: string
        }
        Returns: {
          data: Json
          has_next: boolean
          total_count: number
        }[]
      }
      fetch_vendor_services: {
        Args: {
          p_main_service_id?: number
          p_page?: number
          p_page_size?: number
          p_search?: string
          p_service_item_id?: string
          p_vendor_id: string
        }
        Returns: {
          data: Json
          has_next: boolean
          total_count: number
        }[]
      }
      get_admin_dashboard_stats: {
        Args: { p_period?: string }
        Returns: {
          active_laundry_marts: number
          pending_payouts: number
          prev_active_laundry_marts: number
          prev_pending_payouts: number
          prev_total_laundry_marts: number
          prev_total_orders: number
          prev_total_revenue: number
          total_laundry_marts: number
          total_orders: number
          total_revenue: number
        }[]
      }
      get_admin_financial_report: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          average_order_value: number
          max_order_value: number
          min_order_value: number
          report_end: string
          report_start: string
          total_completed_paid_orders: number
          total_revenue: number
        }[]
      }
      get_admin_orders_report: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          created_at: string
          customer_id: string
          customer_name: string
          customer_phone: string
          delivery_details: Json
          items: Json
          main_service: string
          order_id: string
          payment_channel: string
          payment_method: string
          payment_reference: string
          payment_status: string
          payment_verified_at: string
          pickup_details: Json
          rider_id: string
          rider_name: string
          status: string
          total_price: number
          updated_at: string
          vendor_id: string
          vendor_name: string
        }[]
      }
      get_admin_payments_report: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          amount: number
          customer_id: string
          customer_name: string
          customer_phone: string
          order_id: string
          order_status: string
          paid_at: string
          payment_channel: string
          payment_method: string
          payment_reference: string
          vendor_id: string
          vendor_name: string
        }[]
      }
      get_admin_report_stats: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          income_from_delivery: number
          income_from_service: number
          report_end: string
          report_start: string
          total_completed_orders: number
          total_orders: number
        }[]
      }
      get_admin_transactions_page: {
        Args: {
          p_commission_rate?: number
          p_end_date?: string
          p_page?: number
          p_page_size?: number
          p_search?: string
          p_sort_by?: string
          p_sort_order?: string
          p_start_date?: string
          p_status?: string
        }
        Returns: {
          data: Json
          has_next: boolean
          total_count: number
        }[]
      }
      get_admin_transactions_stats: {
        Args: {
          p_commission_rate?: number
          p_end_date?: string
          p_start_date?: string
          p_status?: string
        }
        Returns: {
          commission: number
          pending_commissions: number
          refunds_issued: number
          report_end: string
          report_start: string
          status_filter: string
          total_revenue: number
          vendor_payouts: number
        }[]
      }
      get_customer_order_stats: {
        Args: { p_customer_id: string }
        Returns: Json
      }
      get_customer_orders: {
        Args: {
          p_customer_id: string
          p_main_service_slug?: string
          p_page?: number
          p_page_size?: number
          p_sort_by?: string
          p_sort_order?: string
          p_status?: string
        }
        Returns: Json
      }
      get_customer_stats: { Args: never; Returns: Json }
      get_customers: {
        Args: {
          p_page?: number
          p_page_size?: number
          p_search?: string
          p_sort_by?: string
          p_sort_order?: string
          p_status?: string
        }
        Returns: Json
      }
      get_fcm_tokens: {
        Args: { target_user_id: string }
        Returns: {
          token: string
        }[]
      }
      get_orders: {
        Args: {
          p_main_service_slug?: string
          p_page?: number
          p_page_size?: number
          p_rider_id?: string
          p_search?: string
          p_service_item_id?: string
          p_service_option_id?: string
          p_sort_by?: string
          p_sort_order?: string
          p_status?: string
          p_vendor_id?: string
        }
        Returns: Json
      }
      get_orders_report_sheet: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_vendor_id: string
        }
        Returns: {
          created_at: string
          customer_id: string
          customer_name: string
          customer_phone: string
          delivery_details: Json
          items: Json
          main_service: string
          order_id: string
          payment_channel: string
          payment_method: string
          payment_reference: string
          payment_status: string
          payment_verified_at: string
          pickup_details: Json
          rider_id: string
          rider_name: string
          status: Database["public"]["Enums"]["order_status"]
          total_price: number
          updated_at: string
          vendor_id: string
          vendor_name: string
        }[]
      }
      get_service_analytics: {
        Args: never
        Returns: {
          id: number
          no_of_orders: number
          number_of_service_items: number
          ongoing_orders: number
          service_name: string
          slug: Database["public"]["Enums"]["main_services_types"]
          total_vendors: number
        }[]
      }
      get_user_email_by_identifier: {
        Args: { identifier: string; user_role?: string }
        Returns: string
      }
      get_vendor_chats_with_details: {
        Args: { p_vendor_id: string }
        Returns: {
          chat_created_at: string
          chat_id: string
          chat_updated_at: string
          closed_at: string
          customer_full_name: string
          customer_id: string
          customer_profile_picture: string
          is_closed: boolean
          latest_message: string
          latest_message_time: string
          order_id: string
          unread_count: number
          vendor_id: string
        }[]
      }
      get_vendor_dashboard_stats: {
        Args: { p_period?: string; p_vendor_id: string }
        Returns: {
          in_progress_orders: number
          new_orders: number
          prev_in_progress_orders: number
          prev_new_orders: number
          prev_ready_for_delivery: number
          prev_total_orders: number
          prev_total_revenue: number
          ready_for_delivery: number
          total_orders: number
          total_revenue: number
        }[]
      }
      get_vendor_financial_report: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_vendor_id: string
        }
        Returns: {
          average_order_value: number
          max_order_value: number
          min_order_value: number
          report_end: string
          report_start: string
          total_paid_orders: number
          total_revenue: number
          vendor_id: string
        }[]
      }
      get_vendor_orders_chart: {
        Args: { p_period?: string; p_vendor_id: string }
        Returns: {
          current_period: number
          label: string
          previous_period: number
        }[]
      }
      get_vendor_payments_report: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_vendor_id: string
        }
        Returns: {
          amount: number
          customer_id: string
          customer_name: string
          customer_phone: string
          order_id: string
          order_status: string
          paid_at: string
          payment_channel: string
          payment_method: string
          payment_reference: string
        }[]
      }
      get_vendor_report_stats: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_vendor_id: string
        }
        Returns: {
          income_from_delivery: number
          income_from_service: number
          report_end: string
          report_start: string
          total_completed_orders: number
          total_orders: number
          vendor_id: string
        }[]
      }
      get_vendor_service_prices: {
        Args: { p_main_service_id: number; p_vendor_id: string }
        Returns: {
          price: number
          service_name: string
        }[]
      }
      get_vendor_services: {
        Args: { p_vendor_id: string }
        Returns: {
          main_service_id: number
          main_service_name: string
          main_service_slug: string
          service_items: Json
        }[]
      }
      get_vendor_stats: { Args: never; Returns: Json }
      get_vendor_unread_messages_count: {
        Args: { p_vendor_id: string }
        Returns: number
      }
      get_vendors: {
        Args: {
          p_page?: number
          p_page_size?: number
          p_search?: string
          p_sort_by?: string
          p_sort_order?: string
          p_status?: string
        }
        Returns: Json
      }
      get_waypoints_page: {
        Args: {
          f_exclude_route?: string
          f_route?: string[]
          f_status?: string
          p_page?: number
          p_page_size?: number
          p_school_id: string
          p_search?: string
          p_sort_column?: string
          p_sort_direction?: string
        }
        Returns: Json
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      log_login_attempt: {
        Args: {
          identifier_input: string
          ip_input?: string
          success_input: boolean
          user_agent_input?: string
        }
        Returns: undefined
      }
      log_vendor_engagement: {
        Args: {
          p_increment_orders?: boolean
          p_increment_profile_view?: boolean
          p_is_favorite?: boolean
          p_used_before?: boolean
          p_vendor_id: string
        }
        Returns: {
          created_at: string
          is_favorite: boolean | null
          last_used_at: string | null
          last_viewed_at: string | null
          orders_count: number | null
          profile_views: number | null
          updated_at: string
          used_before: boolean | null
          user_id: string
          vendor_id: string
        }
        SetofOptions: {
          from: "*"
          to: "vendor_user_engagements"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      main_service_id: {
        Args: {
          service_items: Database["public"]["Tables"]["service_items"]["Row"]
        }
        Returns: string
      }
      name: {
        Args: {
          service_items: Database["public"]["Tables"]["service_items"]["Row"]
        }
        Returns: string
      }
      reject_vendor: {
        Args: {
          admin_user_id: string
          rejection_reason_input: string
          vendor_id_input: string
        }
        Returns: undefined
      }
      test_push_notification: {
        Args: {
          notification_body?: string
          notification_title?: string
          target_user_id: string
        }
        Returns: Json
      }
      verify_admin_login: {
        Args: { user_id: string }
        Returns: {
          business_name: string
          can_login: boolean
          message: string
          status: string
          vendor_id: string
        }[]
      }
    }
    Enums: {
      main_services_types:
        | "laundry"
        | "moving"
        | "house_cleaning"
        | "office_cleaning"
        | "fumigation"
        | "dry_cleaning"
      notification_type:
        | "new_order"
        | "order_status_change"
        | "rider_assignment"
        | "new_message"
        | "promotion"
        | "marketing"
        | "system"
      order_status:
        | "under_review"
        | "accepted"
        | "in_pickup"
        | "in_processing"
        | "ready_for_delivery"
        | "under_delivery"
        | "complete"
        | "cancelled"
        | "scheduled"
        | "draft"
      user_role: "super_admin" | "vendor_user" | "customer" | "rider"
      vendor_user_role: "owner" | "manager" | "staff"
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
      main_services_types: [
        "laundry",
        "moving",
        "house_cleaning",
        "office_cleaning",
        "fumigation",
        "dry_cleaning",
      ],
      notification_type: [
        "new_order",
        "order_status_change",
        "rider_assignment",
        "new_message",
        "promotion",
        "marketing",
        "system",
      ],
      order_status: [
        "under_review",
        "accepted",
        "in_pickup",
        "in_processing",
        "ready_for_delivery",
        "under_delivery",
        "complete",
        "cancelled",
        "scheduled",
        "draft",
      ],
      user_role: ["super_admin", "vendor_user", "customer", "rider"],
      vendor_user_role: ["owner", "manager", "staff"],
    },
  },
} as const

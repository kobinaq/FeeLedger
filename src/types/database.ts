export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: { id: string; name: string; address: string | null; phone: string | null; email: string | null; logo_url: string | null; currency: string; status: string; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; address?: string | null; phone?: string | null; email?: string | null; logo_url?: string | null; currency?: string; status?: string };
        Update: Partial<Database["public"]["Tables"]["schools"]["Insert"]>;
      };
      profiles: {
        Row: { id: string; school_id: string | null; family_id: string | null; full_name: string; email: string; role: Database["public"]["Enums"]["app_role"]; created_at: string; updated_at: string };
        Insert: { id: string; school_id?: string | null; family_id?: string | null; full_name: string; email: string; role: Database["public"]["Enums"]["app_role"] };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      academic_years: {
        Row: { id: string; school_id: string; name: string; starts_on: string; ends_on: string; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; name: string; starts_on: string; ends_on: string };
        Update: Partial<Database["public"]["Tables"]["academic_years"]["Insert"]>;
      };
      terms: {
        Row: { id: string; school_id: string; academic_year_id: string; name: string; starts_on: string; ends_on: string; is_current: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; academic_year_id: string; name: string; starts_on: string; ends_on: string; is_current?: boolean };
        Update: Partial<Database["public"]["Tables"]["terms"]["Insert"]>;
      };
      classes: {
        Row: { id: string; school_id: string; name: string; sort_order: number | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; name: string; sort_order?: number | null };
        Update: Partial<Database["public"]["Tables"]["classes"]["Insert"]>;
      };
      families: {
        Row: { id: string; school_id: string; guardian_full_name: string; phone: string; email: string | null; address: string | null; notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; guardian_full_name: string; phone: string; email?: string | null; address?: string | null; notes?: string | null };
        Update: Partial<Database["public"]["Tables"]["families"]["Insert"]>;
      };
      students: {
        Row: { id: string; school_id: string; family_id: string; class_id: string; first_name: string; last_name: string; student_code: string; status: string; optional_services: string[]; notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; family_id: string; class_id: string; first_name: string; last_name: string; student_code: string; status?: string; optional_services?: string[]; notes?: string | null };
        Update: Partial<Database["public"]["Tables"]["students"]["Insert"]>;
      };
      fee_items: {
        Row: { id: string; school_id: string; name: string; category: string; is_required: boolean; default_due_date: string | null; description: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; name: string; category: string; is_required?: boolean; default_due_date?: string | null; description?: string | null };
        Update: Partial<Database["public"]["Tables"]["fee_items"]["Insert"]>;
      };
      fee_rules: {
        Row: { id: string; school_id: string; term_id: string; class_id: string; fee_item_id: string; amount: number; is_required: boolean; due_date: string; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; term_id: string; class_id: string; fee_item_id: string; amount: number; is_required?: boolean; due_date: string };
        Update: Partial<Database["public"]["Tables"]["fee_rules"]["Insert"]>;
      };
      bills: {
        Row: { id: string; school_id: string; family_id: string; student_id: string; term_id: string; bill_number: string; status: Database["public"]["Enums"]["bill_status"]; total_amount: number; paid_amount: number; due_date: string; published_at: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; family_id: string; student_id: string; term_id: string; bill_number: string; status?: Database["public"]["Enums"]["bill_status"]; total_amount?: number; paid_amount?: number; due_date: string; published_at?: string | null };
        Update: Partial<Database["public"]["Tables"]["bills"]["Insert"]>;
      };
      bill_items: {
        Row: { id: string; school_id: string; bill_id: string; fee_item_id: string | null; description: string; amount: number; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; bill_id: string; fee_item_id?: string | null; description: string; amount: number };
        Update: Partial<Database["public"]["Tables"]["bill_items"]["Insert"]>;
      };
      payments: {
        Row: { id: string; school_id: string; family_id: string; student_id: string | null; bill_id: string | null; amount: number; method: string; reference_number: string | null; payment_date: string; notes: string | null; recorded_by: string | null; source: "manual" | "paystack"; provider: string | null; provider_reference: string | null; provider_channel: string | null; provider_fees: number | null; verified_at: string | null; reversed_at: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; family_id: string; student_id?: string | null; bill_id?: string | null; amount: number; method: string; reference_number?: string | null; payment_date?: string; notes?: string | null; recorded_by?: string | null; source?: "manual" | "paystack"; provider?: string | null; provider_reference?: string | null; provider_channel?: string | null; provider_fees?: number | null; verified_at?: string | null };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]> & { reversed_at?: string | null };
      };
      online_payment_sessions: {
        Row: { id: string; school_id: string; family_id: string; student_id: string | null; bill_id: string | null; payment_plan_id: string | null; amount: number; currency: string; provider: string; provider_reference: string; provider_access_code: string | null; authorization_url: string | null; provider_channel: string | null; status: string; metadata: Json; provider_response: Json | null; verified_at: string | null; paid_at: string | null; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; family_id: string; student_id?: string | null; bill_id?: string | null; payment_plan_id?: string | null; amount: number; currency?: string; provider?: string; provider_reference: string; provider_access_code?: string | null; authorization_url?: string | null; provider_channel?: string | null; status?: string; metadata?: Json; provider_response?: Json | null; verified_at?: string | null; paid_at?: string | null; created_by?: string | null };
        Update: Partial<Database["public"]["Tables"]["online_payment_sessions"]["Insert"]>;
      };
      payment_webhook_events: {
        Row: { id: string; provider: string; event_type: string | null; provider_reference: string | null; payload: Json; signature_valid: boolean; processing_status: string; processing_error: string | null; processed_at: string | null; created_at: string };
        Insert: { id?: string; provider: string; event_type?: string | null; provider_reference?: string | null; payload: Json; signature_valid?: boolean; processing_status?: string; processing_error?: string | null; processed_at?: string | null };
        Update: Partial<Database["public"]["Tables"]["payment_webhook_events"]["Insert"]>;
      };
      receipts: {
        Row: { id: string; school_id: string; family_id: string; student_id: string | null; payment_id: string; receipt_number: string; amount: number; method: string; reference_number: string | null; receipt_date: string; recorded_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; family_id: string; student_id?: string | null; payment_id: string; receipt_number: string; amount: number; method: string; reference_number?: string | null; receipt_date?: string; recorded_by?: string | null };
        Update: Partial<Database["public"]["Tables"]["receipts"]["Insert"]>;
      };
      payment_plans: {
        Row: { id: string; school_id: string; family_id: string; total_balance: number; status: Database["public"]["Enums"]["plan_status"]; approved_by: string | null; notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; family_id: string; total_balance: number; status?: Database["public"]["Enums"]["plan_status"]; approved_by?: string | null; notes?: string | null };
        Update: Partial<Database["public"]["Tables"]["payment_plans"]["Insert"]>;
      };
      payment_plan_installments: {
        Row: { id: string; school_id: string; payment_plan_id: string; due_date: string; amount: number; paid_amount: number; status: Database["public"]["Enums"]["installment_status"]; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; payment_plan_id: string; due_date: string; amount: number; paid_amount?: number; status?: Database["public"]["Enums"]["installment_status"] };
        Update: Partial<Database["public"]["Tables"]["payment_plan_installments"]["Insert"]>;
      };
      reminder_templates: {
        Row: { id: string; school_id: string; name: string; type: string; channel: Database["public"]["Enums"]["reminder_channel"]; body: string; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; name: string; type: string; channel?: Database["public"]["Enums"]["reminder_channel"]; body: string };
        Update: Partial<Database["public"]["Tables"]["reminder_templates"]["Insert"]>;
      };
      reminders: {
        Row: { id: string; school_id: string; family_id: string; reminder_template_id: string | null; channel: Database["public"]["Enums"]["reminder_channel"]; status: Database["public"]["Enums"]["reminder_status"]; message: string; provider_response: Json | null; sent_at: string | null; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; family_id: string; reminder_template_id?: string | null; channel: Database["public"]["Enums"]["reminder_channel"]; status?: Database["public"]["Enums"]["reminder_status"]; message: string; provider_response?: Json | null; sent_at?: string | null; created_by?: string | null };
        Update: Partial<Database["public"]["Tables"]["reminders"]["Insert"]>;
      };
      audit_logs: {
        Row: { id: string; school_id: string | null; actor_id: string | null; action: string; entity_type: string; entity_id: string | null; metadata: Json; created_at: string };
        Insert: { id?: string; school_id?: string | null; actor_id?: string | null; action: string; entity_type: string; entity_id?: string | null; metadata?: Json };
        Update: never;
      };
      subscriptions: {
        Row: { id: string; school_id: string; plan: string; status: string; starts_on: string; ends_on: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; school_id: string; plan?: string; status?: string; starts_on?: string; ends_on?: string | null };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
    };
    Enums: {
      app_role: "platform_admin" | "school_admin" | "headteacher" | "accountant" | "cashier" | "parent";
      bill_status: "draft" | "published" | "partially_paid" | "paid" | "overdue" | "cancelled";
      plan_status: "active" | "on_track" | "missed_payment" | "completed" | "cancelled";
      installment_status: "pending" | "partially_paid" | "paid" | "overdue";
      reminder_status: "draft" | "scheduled" | "sent" | "partial" | "failed";
      reminder_channel: "sms" | "email" | "both";
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Inserts<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type Updates<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];

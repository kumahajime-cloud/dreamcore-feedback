export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      topics: {
        Row: {
          id: string
          title: string
          content: string
          category: 'bug_report' | 'feature_request' | 'feedback' | 'discussion'
          user_id: string
          vote_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: 'bug_report' | 'feature_request' | 'feedback' | 'discussion'
          user_id: string
          vote_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: 'bug_report' | 'feature_request' | 'feedback' | 'discussion'
          user_id?: string
          vote_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      replies: {
        Row: {
          id: string
          topic_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          created_at?: string
        }
      }
    }
  }
}

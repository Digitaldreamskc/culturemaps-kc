import SubmitLocationForm from '@/components/SubmitLocationForm';

export type LocationCategory = 
  | 'museum'
  | 'gallery'
  | 'music_venue'
  | 'mural'
  | 'historic_place'
  | 'theater'
  | 'other';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  title: string;
  description: string;
  category: LocationCategory;
  latitude: number;
  longitude: number;
  address?: string;
  website?: string;
  phone?: string;
  custom_icon_url?: string;
  category_icon_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LocationSubmission {
  id: string;
  name: string;
  category: LocationCategory;
  description: string;
  website?: string;
  photo_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  submitted_by?: string;
  contact_email?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      locations: {
        Row: Location;
        Insert: Omit<Location, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Location, 'id' | 'created_at' | 'updated_at'>>;
      };
      location_submissions: {
        Row: LocationSubmission;
        Insert: Omit<LocationSubmission, 'id' | 'created_at' | 'updated_at' | 'status'>;
        Update: Partial<Omit<LocationSubmission, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
} 
export interface Attraction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'nature' | 'culture' | 'landmark' | 'history';
}

export interface Place {
  id: number;
  name: string;
  category: string;
  description?: string;
  lat?: number;
  lng?: number;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface LocalEvent {
  id: string;
  title: string;
  date: string; // ISO format (YYYY-MM-DD)
  time: string;
  description: string;
  location: string;
  category: 'festival' | 'business' | 'community' | 'tourism';
}

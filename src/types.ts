export interface Attraction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'nature' | 'culture' | 'landmark';
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
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

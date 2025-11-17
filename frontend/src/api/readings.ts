import api from './client';

export interface Book {
  id: number;
  openlibrary_id: string;
  title: string;
  author?: string;
  year?: number | null;
  cover_url?: string;
}

export interface Note {
  id: number;
  page: number | null;
  content: string;
  created_at: string;
}

export interface Reading {
  id: number;
  book: Book;
  started_at?: string | null;
  finished_at?: string | null;
  place?: string;
  rating?: number | null;
  comment?: string;
  created_at: string;
  notes?: Note[];
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getMyReadings(): Promise<Reading[]> {
  const { data } = await api.get<PaginatedResponse<Reading> | Reading[]>('/readings/');

  if (!Array.isArray(data)) {
    return data.results ?? [];
  }
  return data;
}

export async function getReading(id: number): Promise<Reading> {
  const { data } = await api.get<Reading>(`/readings/${id}/`);
  return data;
}

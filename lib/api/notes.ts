import type { ApiNote, ApiNotesResponse } from "@/types/note";
import { get, post, patch, del } from "./client";

export interface GetNotesParams {
  archived?: boolean;
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export function apiGetNotes(params: GetNotesParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.archived !== undefined) searchParams.set("archived", String(params.archived));
  if (params.tag) searchParams.set("tag", params.tag);
  if (params.q) searchParams.set("q", params.q);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.sort) searchParams.set("sort", params.sort);

  const qs = searchParams.toString();
  return get<ApiNotesResponse>(`/notes${qs ? `?${qs}` : ""}`);
}

export function apiGetNote(id: string) {
  return get<ApiNote>(`/notes/${id}`);
}

export function apiCreateNote(data: { title: string; content?: string; tags?: string[] }) {
  return post<ApiNote>("/notes", data);
}

export function apiUpdateNote(id: string, data: { title?: string; content?: string; tags?: string[] }) {
  return patch<ApiNote>(`/notes/${id}`, data);
}

export function apiDeleteNote(id: string) {
  return del<{ message: string }>(`/notes/${id}`);
}

export function apiArchiveNote(id: string) {
  return post<ApiNote>(`/notes/${id}/archive`);
}

export function apiRestoreNote(id: string) {
  return post<ApiNote>(`/notes/${id}/restore`);
}

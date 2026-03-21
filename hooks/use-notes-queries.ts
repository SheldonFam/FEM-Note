"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { apiGetNotes, apiGetNote, type GetNotesParams } from "@/lib/api/notes";
import { apiGetTags } from "@/lib/api/tags";
import { apiGetPreferences } from "@/lib/api/preferences";
import { mapApiNote } from "@/lib/api/mappers";

export function useNotes(params: GetNotesParams = {}) {
  return useQuery({
    queryKey: ["notes", params],
    queryFn: async () => {
      const response = await apiGetNotes(params);
      return {
        notes: response.data.map(mapApiNote),
        meta: response.meta,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useNote(id: string | null) {
  return useQuery({
    queryKey: ["notes", "detail", id],
    queryFn: async () => {
      const apiNote = await apiGetNote(id!);
      return mapApiNote(apiNote);
    },
    enabled: !!id,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: apiGetTags,
  });
}

export function usePreferences() {
  return useQuery({
    queryKey: ["preferences"],
    queryFn: apiGetPreferences,
  });
}

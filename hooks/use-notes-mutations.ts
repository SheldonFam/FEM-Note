"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  apiCreateNote,
  apiUpdateNote,
  apiDeleteNote,
  apiArchiveNote,
  apiRestoreNote,
} from "@/lib/api/notes";
import { apiUpdatePreferences, type Preferences } from "@/lib/api/preferences";
import { mapApiNote } from "@/lib/api/mappers";

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; content?: string; tags?: string[] }) =>
      apiCreateNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; content?: string; tags?: string[] };
    }) => apiUpdateNote(id, data),
    onSuccess: (apiNote) => {
      const note = mapApiNote(apiNote);
      queryClient.setQueryData(["notes", "detail", note.id], note);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDeleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useArchiveNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiArchiveNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useRestoreNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiRestoreNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Preferences>) => apiUpdatePreferences(data),
    onSuccess: (prefs) => {
      queryClient.setQueryData(["preferences"], prefs);
    },
  });
}

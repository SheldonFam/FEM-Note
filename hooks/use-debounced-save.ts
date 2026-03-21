"use client";

import { useCallback, useEffect, useRef } from "react";
import { useUpdateNote } from "./use-notes-mutations";

export function useDebouncedSave(delay = 400) {
  const updateNote = useUpdateNote();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<{ id: string; data: { title?: string; content?: string; tags?: string[] } } | null>(null);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pendingRef.current) {
      updateNote.mutate(pendingRef.current);
      pendingRef.current = null;
    }
  }, [updateNote]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    pendingRef.current = null;
  }, []);

  const save = useCallback(
    (id: string, data: { title?: string; content?: string; tags?: string[] }) => {
      if (pendingRef.current && pendingRef.current.id === id) {
        pendingRef.current = { id, data: { ...pendingRef.current.data, ...data } };
      } else {
        pendingRef.current = { id, data };
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          updateNote.mutate(pendingRef.current);
          pendingRef.current = null;
        }
        timerRef.current = null;
      }, delay);
    },
    [delay, updateNote],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // flush on unmount
      if (pendingRef.current) {
        updateNote.mutate(pendingRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { save, flush, cancel };
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import { useUpdateNote } from "./use-notes-mutations";

export function useDebouncedSave(delay = 400) {
  const { mutate } = useUpdateNote();
  const mutateRef = useRef(mutate);
  useEffect(() => {
    mutateRef.current = mutate;
  }, [mutate]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<{
    id: string;
    data: { title?: string; content?: string; tags?: string[] };
  } | null>(null);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pendingRef.current) {
      mutateRef.current(pendingRef.current);
      pendingRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    pendingRef.current = null;
  }, []);

  const save = useCallback(
    (
      id: string,
      data: { title?: string; content?: string; tags?: string[] },
    ) => {
      if (pendingRef.current && pendingRef.current.id === id) {
        pendingRef.current = {
          id,
          data: { ...pendingRef.current.data, ...data },
        };
      } else {
        pendingRef.current = { id, data };
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (pendingRef.current) {
          mutateRef.current(pendingRef.current);
          pendingRef.current = null;
        }
        timerRef.current = null;
      }, delay);
    },
    [delay],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (pendingRef.current) {
        mutateRef.current(pendingRef.current);
      }
    };
  }, []);

  return { save, flush, cancel };
}

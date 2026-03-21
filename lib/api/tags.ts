import type { ApiTag } from "@/types/note";
import { get } from "./client";

export function apiGetTags() {
  return get<ApiTag[]>("/tags");
}

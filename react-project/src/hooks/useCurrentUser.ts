import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGetUser } from "../api/auth";
import type { User } from "../utils/types";

export function useCurrentUser() {
  const stored = localStorage.getItem("authUser");
  const parsed: User | null = stored ? JSON.parse(stored) : null;

  const queryClient = useQueryClient();

  const query = useQuery<User>({
    queryKey: ["currentUser", parsed?.id],
    queryFn: () => apiGetUser(parsed!.id),
    enabled: Boolean(parsed?.id),
  });

  return {
    ...query,
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["currentUser", parsed?.id] }),
  };
}

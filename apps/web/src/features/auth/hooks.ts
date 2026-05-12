"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentSession, loginWithPassword, logoutFromSession, registerWithPassword } from "./api";
import { authQueryKeys } from "./query-keys";
import type { LoginInput, RegisterInput } from "./types";

export function useSessionQuery() {
  return useQuery({
    queryKey: authQueryKeys.session,
    queryFn: getCurrentSession
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => registerWithPassword(input),
    onSuccess(result) {
      queryClient.setQueryData(authQueryKeys.session, result.user ?? null);
    }
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => loginWithPassword(input),
    onSuccess(result) {
      queryClient.setQueryData(authQueryKeys.session, result.user ?? null);
    }
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutFromSession,
    onSuccess() {
      queryClient.setQueryData(authQueryKeys.session, null);
    }
  });
}
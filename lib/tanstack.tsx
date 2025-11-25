"use client";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidateQueries?: QueryKey[];
      successMessage?: string;
      errorMessage?: string;
      showErrorMessage?: boolean;
    };
  }
}
const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      console.log({ _data });
      if (
        _data &&
        typeof _data === "object" &&
        "error" in _data &&
        _data.error
      ) {
        throw new Error(_data.error as string);
      }
      if (mutation.meta?.successMessage) {
        toast.success(mutation.meta.successMessage);
      }
      if (mutation.meta?.invalidateQueries) {
        mutation.meta.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey: queryKey,
          });
        });
      }
    },
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.showErrorMessage) {
        toast.error(error.message || mutation.meta.errorMessage);
      } else {
        console.log({ error });
      }
    },
    onSettled: (_data, _error, _variables, _context, mutation) => {
      if (mutation.meta?.invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: mutation.meta.invalidateQueries,
        });
      }
    },
  }),
});

export default function TanstackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}

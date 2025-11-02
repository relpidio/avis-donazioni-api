import React, { ReactNode } from "react";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

type Props = { children: ReactNode };

export const QueryProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {Platform.OS === "web" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
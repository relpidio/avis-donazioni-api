// src/providers/QueryProvider.tsx
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// 🔹 Instância global (mantida fora do componente para evitar recriação)
const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

// 🔸 Envolve toda a aplicação com suporte a React Query
export const QueryProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Ferramenta de debug (não aparece em produção) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
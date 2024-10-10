"use client"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const ReactQueryProvider = ({ children }: Readonly<{children: React.ReactNode}>) => {
    const client: QueryClient = new QueryClient()

    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}

export default ReactQueryProvider;
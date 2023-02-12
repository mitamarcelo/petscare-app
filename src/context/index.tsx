import React, { useEffect } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import axios, { AxiosInstance } from "axios";
import { ToastContainer } from "react-toastify";
import AuthenticationProvider from "@/context/AuthenticationContext";
import localStorageConstants from "@/constants/localStorage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export type ApplicationContextType = {
  axiosClient: AxiosInstance;
};

export const ApplicationContext = React.createContext({
  axiosClient: axios.create(),
});

const ApplicationProvider = ({ children }: React.PropsWithChildren) => {
  const axiosClient = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <ApplicationContext.Provider value={{ axiosClient }}>
      <QueryClientProvider client={queryClient} contextSharing>
        <ReactQueryDevtools initialIsOpen />
        <ToastContainer />
        <AuthenticationProvider>{children}</AuthenticationProvider>
      </QueryClientProvider>
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => {
  return React.useContext(ApplicationContext);
};

export default ApplicationProvider;

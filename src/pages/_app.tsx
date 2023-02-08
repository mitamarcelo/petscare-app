import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import SSRProvider from "react-bootstrap/SSRProvider";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import ApplicationProvider from "@/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <ThemeProvider>
        <ApplicationProvider>
          <Component {...pageProps} />
        </ApplicationProvider>
      </ThemeProvider>
    </SSRProvider>
  );
}

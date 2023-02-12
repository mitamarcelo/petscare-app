import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import SSRProvider from "react-bootstrap/SSRProvider";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import ApplicationProvider from "@/context";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <ThemeProvider>
        <ApplicationProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApplicationProvider>
      </ThemeProvider>
    </SSRProvider>
  );
}

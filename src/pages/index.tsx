import Head from "next/head";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import styles from "@/styles/Home.module.scss";
import {
  useAuthenticated,
  useAuthenticationContext,
} from "@/context/AuthenticationContext";

import { usePetsIndexQuery } from "@/hooks/usePetQueries";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthenticationContext();
  useAuthenticated(router);

  const { data: pets, isLoading: loadingPets } = usePetsIndexQuery();

  if (!isAuthenticated) return null;
  if (loadingPets) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  return (
    <>
      <Head>
        <title>Pets care app</title>
        <meta name="description" content="App created by Marcelo Mita" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>My Pets</h1>
        <pre>{JSON.stringify(pets, null, 2)}</pre>
      </main>
    </>
  );
}

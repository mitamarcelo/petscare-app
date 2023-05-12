import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import styles from "@/styles/Home.module.scss";
import {
  useAuthenticated,
  useAuthenticationContext,
} from "@/context/AuthenticationContext";

import { usePetsIndexQuery } from "@/hooks/usePetQueries";
import PetCard from "@/components/PetCard";
import PetFormModal from "@/components/PetFormModal";
import { useQueryClient } from "react-query";
import queryNames from "@/constants/queryNames";

const Home = () => {
  const router = useRouter();
  const [addPetModalOpen, setAddPetModalOpen] = useState<boolean>(false);
  const { isAuthenticated } = useAuthenticationContext();
  const queryClient = useQueryClient();
  useAuthenticated(router);

  const {
    data: pets,
    isLoading: loadingPets,
    isStale: isPetsStale,
  } = usePetsIndexQuery();

  const handleToggleAddPet = () => {
    setAddPetModalOpen((p) => !p);
  };

  useEffect(() => {
    if (isPetsStale) {
      queryClient.refetchQueries([queryNames.petsIndex]);
    }
  }, [isPetsStale]);

  if (!isAuthenticated) return null;
  if (loadingPets) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Carregando...</span>
      </Spinner>
    );
  }
  return (
    <>
      <Head>
        <title>Pets care app</title>
        <meta name="description" content="Pets care home page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Container>
          <Row className={styles.titleRow}>
            <Col md={8}>
              <h1>Meus Pets</h1>
            </Col>
            <Col md={4} className={styles.addButtonCol}>
              <Button onClick={handleToggleAddPet}>Adicionar Pet</Button>
            </Col>
          </Row>
          <Row gy={4}>
            {pets && pets.length > 0 ? (
              pets.map((pet) => (
                <Col key={pet.id} md={6}>
                  <PetCard pet={pet} />
                </Col>
              ))
            ) : (
              <h2>Nenhum pet para mostrar.</h2>
            )}
          </Row>
        </Container>
        <PetFormModal open={addPetModalOpen} onClose={handleToggleAddPet} />
      </main>
    </>
  );
};

export default Home;

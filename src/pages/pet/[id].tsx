import Head from "next/head";
import React, { useEffect, useState } from "react";
import homeStyles from "@/styles/Home.module.scss";
import styles from "@/styles/PetView.module.scss";
import { usePetQuery } from "@/hooks/usePetQueries";
import { useRouter } from "next/router";
import {
  Button,
  Col,
  Container,
  ProgressBar,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { formatDate, getAge } from "@/utils/dates";
import { Category, ProcedureRecord } from "@/types/procedureRecords";
import ProcedureList from "@/components/ProcedureList";
import { compareDesc } from "date-fns";
import ProcedureFormModal from "@/components/ProcedureFormModal";
import { Gender, GenderEnum, Species, SpeciesEnum } from "@/types/pets";

const Pet = () => {
  const router = useRouter();
  const { id, edit } = router.query;
  const { data: pet, isLoading, error } = usePetQuery(id as string, !!id);
  const [lastWeightProcedure, setLastWeightProcedure] = useState<
    ProcedureRecord | undefined
  >(undefined);
  const [procedureModalOpen, setProcedureModalOpen] = useState<boolean>(false);

  const handleProcedureModalToggle = () => {
    setProcedureModalOpen((p) => !p);
  };

  const filterProceduresByCategory = (category: Category) => {
    if (pet?.id && pet.procedure_records.length > 0) {
      return pet.procedure_records.filter((proc) => proc.category === category);
    }
    return [];
  };

  useEffect(() => {
    if (error) router.push("/");
  }, [error]);

  useEffect(() => {
    if (!isLoading && pet?.id && pet.procedure_records.length > 0) {
      const proceduresWithWeight = pet.procedure_records.filter(
        (pr) => !!pr.weight
      );

      if (proceduresWithWeight.length > 0) {
        setLastWeightProcedure(
          proceduresWithWeight.sort((pr1, pr2) =>
            compareDesc(pr1.procedure_on, pr2.procedure_on)
          )[0]
        );
      }
    }
  }, [pet, isLoading]);

  return (
    <>
      <Head>
        <title>Pet {id}</title>
        <meta name="description" content="Pets care home page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={homeStyles.main}>
        {isLoading && !pet ? (
          <ProgressBar />
        ) : (
          <>
            <Container fluid>
              <Row>
                <Col md={7}>
                  <h1>
                    {pet?.name} -{" "}
                    {SpeciesEnum[(!!pet ? pet.species : "dog") as Species]}
                    {pet?.breed ? ` - ${pet.breed}` : null}
                  </h1>
                  <p>{pet?.bio}</p>
                </Col>
                {pet?.dob && (
                  <Col className={styles.petStat} md={5}>
                    <h4>
                      {GenderEnum[(!!pet ? pet.gender : "male") as Gender]}
                    </h4>
                    <h4>Idade: {getAge(new Date(pet?.dob))}</h4>
                    <h4>
                      Ultima pesagem:{" "}
                      {lastWeightProcedure ? (
                        <span>
                          {lastWeightProcedure.weight?.toLocaleString("pt-br")}
                          Kg em {formatDate(lastWeightProcedure.procedure_on)}
                        </span>
                      ) : (
                        <span>N/C</span>
                      )}{" "}
                    </h4>
                    <Button onClick={handleProcedureModalToggle}>
                      Adicionar Registro
                    </Button>
                  </Col>
                )}
              </Row>
              {!!pet?.id && (
                <Row>
                  <Col md={12}>
                    <Tabs defaultActiveKey="history" className="mb-3">
                      <Tab eventKey="history" title="Histórico">
                        <ProcedureList procedures={pet.procedure_records} />
                      </Tab>
                      <Tab eventKey="flea_and_tick" title="Pulgas e Carrapatos">
                        <ProcedureList
                          procedures={filterProceduresByCategory(
                            "flea_and_tick"
                          )}
                        />
                      </Tab>
                      <Tab eventKey="deworming" title="Vermifugação">
                        <ProcedureList
                          procedures={filterProceduresByCategory("deworming")}
                        />
                      </Tab>
                      <Tab
                        eventKey="nextProcedures"
                        title="Próximos compromissos"
                      >
                        <ProcedureList
                          procedures={pet.procedure_records.filter(
                            (proc) => proc.next_procedure_date
                          )}
                        />
                      </Tab>
                      <Tab eventKey="anotations" title="Anotações">
                        <ProcedureList
                          procedures={filterProceduresByCategory("annotation")}
                        />
                      </Tab>
                    </Tabs>
                  </Col>
                </Row>
              )}
            </Container>
            <ProcedureFormModal
              open={procedureModalOpen}
              onClose={handleProcedureModalToggle}
            />
          </>
        )}
      </main>
    </>
  );
};

export default Pet;

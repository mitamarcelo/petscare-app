import { ProcedureRecord } from "@/types/procedureRecords";
import React from "react";
import PetProcedureCard from "./PetProcedureCard";
import { Card } from "react-bootstrap";

type ProcedureListProps = {
  procedures: ProcedureRecord[];
};

const ProcedureList: React.FC<ProcedureListProps> = ({ procedures }) =>
  procedures.length ? (
    <>
      {procedures.map((procedure) => (
        <PetProcedureCard key={procedure.id} procedureRecord={procedure} />
      ))}
    </>
  ) : (
    <Card style={{ margin: "5px 0" }}>
      <Card.Header>Não há registros para esse animal.</Card.Header>
    </Card>
  );

export default ProcedureList;

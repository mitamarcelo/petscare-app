import { CategoryEnum, ProcedureRecord } from "@/types/procedureRecords";
import React from "react";
import { Card } from "react-bootstrap";
import ExpandableText from "./ExpandableText";
import styles from "@/styles/PetProcedureCard.module.scss";
import { formatDate } from "@/utils/dates";

type PetProcedureCardProps = {
  procedureRecord: ProcedureRecord;
};

const PetProcedureCard: React.FC<PetProcedureCardProps> = ({
  procedureRecord,
}) => {
  const {
    title,
    description,
    category,
    procedure_on,
    weight,
    next_procedure_date,
  } = procedureRecord;
  return (
    <Card style={{ margin: "5px 0" }}>
      <Card.Header className={styles.cardFeatured}>
        <span>{title}</span>
        <span>
          {CategoryEnum[category]} em {formatDate(procedure_on)}
        </span>
      </Card.Header>
      <Card.Body>
        <ExpandableText text={description} />
      </Card.Body>
      <Card.Footer className={styles.cardFeatured}>
        {!!weight ? (
          <span>Peso: {weight.toLocaleString("pt-BR")}Kg</span>
        ) : (
          <span>Nenhuma pesagem registrada</span>
        )}
        {!!next_procedure_date ? (
          <span>
            Próximo {CategoryEnum[category]} em{" "}
            {formatDate(next_procedure_date)}
          </span>
        ) : (
          <span>Não há novos agendamentos para esse procedimento</span>
        )}
      </Card.Footer>
    </Card>
  );
};

export default PetProcedureCard;

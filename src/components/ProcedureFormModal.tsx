import queryNames from "@/constants/queryNames";
import { useApplicationContext } from "@/context";
import { useAuthenticationContext } from "@/context/AuthenticationContext";
import useForm from "@/hooks/useForm";
import { usePost } from "@/hooks/usePost";
import { useProcedureCategoriesQuery } from "@/hooks/useProcedureQueries";
import useToastify from "@/hooks/useToastify";
import { CategoryEnum } from "@/types/procedureRecords";
import { ProcedureRecord } from "@/types/procedureRecords";
import { useRouter } from "next/router";
import React from "react";
import { Button, Modal, Row, Container, Col, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useMutation, useQueryClient } from "react-query";
import TextEditor from "./TextEditor";

type ProcedureFormModalProps = {
  open: boolean;
  onClose: () => void;
};

const ProcedureFormModal: React.FC<ProcedureFormModalProps> = ({
  open,
  onClose,
}) => {
  const initialProcedure: ProcedureRecord = {
    title: "",
    description: "",
    category: "appointment",
    procedure_on: new Date(),
    next_procedure_date: null,
  };
  const router = useRouter();
  const { id: petId } = router.query;
  const { values, handleInputChange, setValues } =
    useForm<ProcedureRecord>(initialProcedure);
  const queryClient = useQueryClient();
  const { error, success } = useToastify();

  const { data: categories, isLoading: categoriesLoading } =
    useProcedureCategoriesQuery();

  const handleProcedureOnChange = (date: Date) => {
    setValues((prev) => ({ ...prev, procedure_on: date || new Date() }));
  };

  const handleNextProcedureDateChange = (date: Date | null) => {
    setValues((prev) => ({ ...prev, next_procedure_date: date }));
  };

  const handleDescriptionChange = (description: string) => {
    setValues((prev) => ({ ...prev, description }));
  };

  const { post: createProcedure } = usePost<ProcedureRecord>(
    `pets/${petId}/procedures`,
    values
  );

  const { mutate } = useMutation(createProcedure, {
    mutationKey: queryNames.createProcedure,
    onError: () => {
      error("Ops, houve um erro ao criar o registro, tente novamente!");
    },
    onSuccess: () => {
      success("Seu registro foi criado com sucesso!");
      queryClient.invalidateQueries([queryNames.getPet, petId]);
      handleClose();
    },
  });

  const handleClose = () => {
    setValues(initialProcedure);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Modal show={open} onHide={handleClose} fullscreen >
      <Modal.Header closeButton>
        <Modal.Title>Criar Registro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col md={12}>
              <Form.Group controlId="title" className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  onChange={handleInputChange}
                  autoFocus
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Group controlId="category" className="mb-3">
                <Form.Label>Tipo de Registro</Form.Label>
                <Form.Select
                  name="category"
                  disabled={categoriesLoading}
                  value={values.category}
                  onChange={handleInputChange}
                >
                  {!!categories &&
                    categories.map((category) => (
                      <option key={category} value={category}>
                        {CategoryEnum[category]}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="procedure_on" className="mb-3">
                <Form.Label>Data do registro</Form.Label>
                <DatePicker
                  selected={values.procedure_on}
                  locale="pt-BR"
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  onChange={handleProcedureOnChange}
                  onSelect={handleProcedureOnChange}
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="next_procedure_date" className="mb-3">
                <Form.Label>
                  Próximo(a) {CategoryEnum[values.category]}
                </Form.Label>
                <DatePicker
                  selected={values.next_procedure_date}
                  locale="pt-BR"
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  onChange={handleNextProcedureDateChange}
                  onSelect={handleNextProcedureDateChange}
                  className="form-control"
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="weight" className="mb-3">
                <Form.Label>Peso</Form.Label>
                <Form.Control
                  type="number"
                  name="weight"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group controlId="description">
                <Form.Label>Descrição</Form.Label>
                <TextEditor
                  initialValue=""
                  onChange={handleDescriptionChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Criar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProcedureFormModal;

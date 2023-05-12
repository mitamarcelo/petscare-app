import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { GenderEnum, Pet, SpeciesEnum } from "@/types/pets";
import useForm from "@/hooks/useForm";
import useToastify from "@/hooks/useToastify";
import { useMutation, useQueryClient } from "react-query";
import queryNames from "@/constants/queryNames";
import { usePetsOptionsQuery } from "@/hooks/usePetQueries";
import { registerLocale } from "react-datepicker";
import ptBr from "date-fns/locale/pt-BR";
import styles from "@/styles/PetFormModal.module.scss";
import { usePost } from "@/hooks/usePost";

registerLocale("pt-BR", ptBr);

type PetFormModalProps = {
  open: boolean;
  onClose: () => void;
};

const PetFormModal: React.FC<PetFormModalProps> = ({ open, onClose }) => {
  const initialPet: Pet = {
    name: "",
    bio: "",
    gender: "male",
    species: "dog",
    dob: new Date(),
    procedure_records: [],
    breed: "",
  };
  const { values, handleInputChange, setValues } = useForm<Pet>(initialPet);
  const queryClient = useQueryClient();
  const { error, success } = useToastify();
  const { data: options, isLoading: optionsLoading } = usePetsOptionsQuery();

  const handleDateChange = (date: Date) =>
    setValues((prev) => ({ ...prev, dob: date || new Date() }));

  const { post: createPet } = usePost<Pet>("/pets", values);

  const { mutate } = useMutation(createPet, {
    mutationKey: queryNames.createPet,
    onError: () => {
      error("Ops, houve um erro ao criar o Pet, tente novamente.");
    },
    onSuccess: () => {
      success("Seu pet foi criado com sucesso!");
      queryClient.invalidateQueries([queryNames.petsIndex]);
    },
  });
  const handleClose = () => {
    setValues(initialPet);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
    handleClose();
  };

  return (
    <Modal show={open} onHide={handleClose} fullscreen>
      <Modal.Header closeButton>Criar Pet</Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className={styles.modalWrapper}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              onChange={handleInputChange}
              autoFocus
            />
          </Form.Group>
          <Form.Group controlId="bio" className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="bio"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="dob" className="mb-3">
            <Form.Label>Data de Nascimento</Form.Label>
            <DatePicker
              selected={values.dob}
              locale="pt-BR"
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              onChange={handleDateChange}
              onSelect={handleDateChange}
              className="form-control"
            />
          </Form.Group>
          <Form.Group controlId="species" className="mb-3">
            <Form.Label>Espécie</Form.Label>
            <Form.Select
              name="species"
              disabled={optionsLoading}
              value={values.species}
              onChange={handleInputChange}
            >
              {!!options &&
                options.species.map((option) => (
                  <option key={option} value={option}>
                    {SpeciesEnum[option]}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="breed" className="mb-3">
            <Form.Label>Raça</Form.Label>
            <Form.Control
              type="text"
              name="breed"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="gender" className="mb-3">
            <Form.Label>Gênero</Form.Label>
            <Form.Select
              name="gender"
              disabled={optionsLoading}
              value={values.gender}
              onChange={handleInputChange}
            >
              {!!options &&
                options.genders.map((option) => (
                  <option key={option} value={option}>
                    {GenderEnum[option]}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Criar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PetFormModal;

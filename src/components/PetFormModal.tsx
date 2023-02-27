import React, { useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Pet } from "@/types/pets";
import useForm from "@/hooks/useForm";
import { useApplicationContext } from "@/context";
import { useAuthenticationContext } from "@/context/AuthenticationContext";
import useToastify from "@/hooks/useToastify";
import { useMutation, useQueryClient } from "react-query";
import queryNames from "@/constants/queryNames";
import { usePetsOptionsQuery } from "@/hooks/usePetQueries";
import { registerLocale } from "react-datepicker";
import ptBr from "date-fns/locale/pt-BR";
import styles from "@/styles/PetFormModal.module.scss";

registerLocale("pt-BR", ptBr);

type PetFormModalProps = {
  open: boolean;
  onClose: () => void;
};

const PetFormModal = ({ open, onClose }: PetFormModalProps) => {
  const SpeciesTranslation: { [key: string]: string } = {
    dog: "Cachorro",
    cat: "Gato",
    other: "Outros",
  };
  const GendersTranslation: { [key: string]: string } = {
    male: "Macho",
    female: "Femea",
  };
  const initialPet: Pet = {
    name: "",
    bio: "",
    gender: "male",
    species: "dog",
    dob: new Date(),
    breed: "",
  };
  const { values, handleInputChange, setValues } = useForm<Pet>(initialPet);
  const queryClient = useQueryClient();
  const { axiosClient } = useApplicationContext();
  const { getToken } = useAuthenticationContext();
  const { error, success } = useToastify();
  const { data: options, isLoading: optionsLoading } = usePetsOptionsQuery();
  const translateSpeciesName = (option: string) => {
    if (Object.keys(SpeciesTranslation).includes(option))
      return SpeciesTranslation[option];

    return "Desconhecido";
  };

  const translateGenderName = (option: string) => {
    if (Object.keys(GendersTranslation).includes(option))
      return GendersTranslation[option];

    return "Desconhecido";
  };

  const handleDateChange = (date: Date) =>
    setValues((prev) => ({ ...prev, dob: date || new Date() }));

  const createPet = async () => {
    return await axiosClient.post("/pets", values, {
      headers: { Authorization: getToken() },
    });
  };

  const { mutate } = useMutation(createPet, {
    mutationKey: queryNames.createPet,
    onError: () => {
      debugger;
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
    <Modal show={open} onHide={handleClose} centered>
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
                  <option value={option}>{translateSpeciesName(option)}</option>
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
                  <option value={option}>{translateGenderName(option)}</option>
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

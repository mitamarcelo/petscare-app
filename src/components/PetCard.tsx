import React from "react";
import { Card, Col } from "react-bootstrap";
import { Pet } from "@/types/pets";
import styles from "@/styles/PetCard.module.scss";

type PetCardProps = {
  pet: Pet;
};

const PetCard = ({ pet: { name, bio } }: PetCardProps) => (
  <Col className={styles.wrapper} md={6}>
    <Card>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{bio}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

export default PetCard;

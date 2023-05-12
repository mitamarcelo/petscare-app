import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { TbEdit } from "react-icons/tb";
import { Pet } from "@/types/pets";
import { getAge } from "@/utils/dates";
import Link from "next/link";

type PetCardProps = {
  pet: Pet;
};

const PetCard = ({ pet: { id, name, bio, dob } }: PetCardProps) => (
  <Card>
    <Card.Body>
      <Card.Title>
        <Row>
          <Col xs={5}>{name}</Col>
          <Col xs={6}>Idade: {getAge(new Date(dob))}</Col>
          <Col xs={1} className="ms-auto">
            <Link href={`/pet/${id}`}>
              <TbEdit />
            </Link>
          </Col>
        </Row>
      </Card.Title>
      <Card.Text>{bio}</Card.Text>
    </Card.Body>
  </Card>
);

export default PetCard;

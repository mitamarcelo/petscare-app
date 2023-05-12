import { ProcedureRecord } from "./procedureRecords";

export enum SpeciesEnum {
  dog = "Cão",
  cat = "Gato",
  other = "Outros",
}

export enum GenderEnum {
  male = "Macho",
  female = "Fêmea",
}

export type Species = keyof typeof SpeciesEnum;
export type Gender = keyof typeof GenderEnum;

export type Pet = {
  id?: number;
  name: string;
  bio: string;
  gender: string;
  breed: string;
  species: string;
  dob: Date;
  procedure_records: ProcedureRecord[];
};

export type Options = {
  species: Species[];
  genders: Gender[];
};

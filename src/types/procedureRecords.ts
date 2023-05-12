export enum CategoryEnum {
  annotation = "Anotação",
  appointment = "Consulta",
  deworming = "Vermifugação",
  flea_and_tick = "Remedio Pulga e Carrapato",
  medicine = "Remédios",
  other = "Outros Registros",
  vaccination = "Vacinação",
}

export type Category = keyof typeof CategoryEnum;

export type ProcedureRecord = {
  id?: number;
  category: Category;
  title: string;
  description: string;
  procedure_on: Date;
  next_procedure_date?: Date | null;
  weight?: number | null;
};

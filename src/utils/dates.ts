import formatDuration from "date-fns/formatDuration";
import { ptBR } from "date-fns/locale";
import { intervalToDuration, format } from "date-fns";

export const getAge = (date: Date) => {
  const distanceInDuration = intervalToDuration({
    start: date,
    end: new Date(),
  });
  return formatDuration(distanceInDuration, {
    format: ["years", "months"],
    delimiter: " e ",
    locale: ptBR,
  });
};

export const formatDate = (date: string | Date) => {
  const actualDate = new Date(new Date(date).toISOString().slice(0, -1));
  return format(actualDate, "dd/MM/yyyy", { locale: ptBR });
};

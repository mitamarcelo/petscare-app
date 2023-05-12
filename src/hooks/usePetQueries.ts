import { useQuery } from "react-query";
import queryNames from "@/constants/queryNames";
import { Options, Pet } from "@/types/pets";
import { useFetch } from "./useFetch";

const usePetsIndexQuery = () => {
  const { fetch: fetchPets } = useFetch("/pets");
  return useQuery<Pet[]>(queryNames.petsIndex, fetchPets);
};

const usePetsOptionsQuery = () => {
  const { fetch: fetchPetsOptions } = useFetch("/pets/options");
  return useQuery<Options>(queryNames.petsOptions, fetchPetsOptions);
};

const usePetQuery = (id: string, enabled: boolean) => {
  const { fetch: fetchPet } = useFetch(`/pets/${id}`);
  return useQuery<Pet>([queryNames.getPet, id], fetchPet, { enabled });
};

export { usePetsIndexQuery, usePetsOptionsQuery, usePetQuery };

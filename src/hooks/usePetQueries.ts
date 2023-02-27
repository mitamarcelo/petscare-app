import { useQuery } from "react-query";
import { useApplicationContext } from "@/context";
import useToastify from "@/hooks/useToastify";
import queryNames from "@/constants/queryNames";
import { useAuthenticationContext } from "@/context/AuthenticationContext";
import { Options, Pet } from "@/types/pets";

const usePetsIndexQuery = () => {
  const { axiosClient } = useApplicationContext();
  const { getToken, contextLogout } = useAuthenticationContext();
  const { error } = useToastify();

  const fetchPets = () => {
    return axiosClient
      .get("/pets", {
        headers: { Authorization: getToken() },
      })
      .then((response) => {
        return response.data;
      })
      .catch(({ response }) => {
        error(response.data.details.join(" | "));
        if (response.status === 401) contextLogout();
      });
  };

  return useQuery<Pet[]>(queryNames.petsIndex, fetchPets);
};

const usePetsOptionsQuery = () => {
  const { axiosClient } = useApplicationContext();
  const { getToken, contextLogout } = useAuthenticationContext();
  const { error } = useToastify();

  const fetchPetsOptions = () => {
    return axiosClient
      .get("/pets/options", {
        headers: { Authorization: getToken() },
      })
      .then((response) => {
        return response.data;
      })
      .catch(({ response }) => {
        error(response.data.details.join(" | "));
        if (response.status === 401) contextLogout();
      });
  };

  return useQuery<Options>(queryNames.petsOptions, fetchPetsOptions);
};

export { usePetsIndexQuery, usePetsOptionsQuery };

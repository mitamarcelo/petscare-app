import { useQuery } from "react-query";
import { useApplicationContext } from "@/context";
import useToastify from "@/hooks/useToastify";
import queryNames from "@/constants/queryNames";
import { useAuthenticationContext } from "@/context/AuthenticationContext";

const usePetsIndexQuery = () => {
  const { axiosClient } = useApplicationContext();
  const { getToken } = useAuthenticationContext();
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
      });
  };

  return useQuery(queryNames.petsIndex, fetchPets);
};

export { usePetsIndexQuery };

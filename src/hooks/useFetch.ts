import { useApplicationContext } from "@/context";
import { useAuthenticationContext } from "@/context/AuthenticationContext";
import useToastify from "./useToastify";

export const useFetch = (url: string) => {
  const { axiosClient } = useApplicationContext();
  const { getToken, contextLogout } = useAuthenticationContext();
  const { error } = useToastify();

  const fetch = () => {
    return axiosClient
      .get(url, {
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

  return { fetch };
};

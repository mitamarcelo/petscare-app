import { useApplicationContext } from "@/context";
import { useAuthenticationContext } from "@/context/AuthenticationContext";
import useToastify from "./useToastify";

export const usePost = <T>(url: string, data: T) => {
  const { axiosClient } = useApplicationContext();
  const { getToken, contextLogout } = useAuthenticationContext();
  const { error } = useToastify();

  const post = async () => {
    return await axiosClient.post(url, data, {
      headers: { Authorization: getToken() },
    });
  };

  return { post };
};

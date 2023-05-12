import { Category } from "@/types/procedureRecords";
import { useFetch } from "./useFetch";
import { useQuery } from "react-query";
import queryNames from "@/constants/queryNames";

const useProcedureCategoriesQuery = () => {
  const { fetch: fetchProcedureCategories } = useFetch("/procedure_categories");
  return useQuery<Category[]>(
    queryNames.procedureCategories,
    fetchProcedureCategories
  );
};

export { useProcedureCategoriesQuery };

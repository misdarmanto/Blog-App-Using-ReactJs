import { ContextApi } from "../helpers/ContextApi";
import { useContext } from "react";

export const useContextApi = () => {
  return useContext(ContextApi);
};
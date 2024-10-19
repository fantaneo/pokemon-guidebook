import { useContext } from "react";
import { TypeContext } from "../contexts/TypeContext";

export function useTypeContext() {
  return useContext(TypeContext);
}

import { useParamContext } from './ParamContext';

export const useParams = <T extends Record<string, unknown> = Record<string, unknown>>() => {
  const { params } = useParamContext();
  return params as T;
};

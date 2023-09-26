import React, { createContext, useState } from 'react';

type ParamContextProps = {
  params: Record<string, string>;
  setParams: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

export const ParamContext = createContext<ParamContextProps | undefined>(undefined);

export const ParamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [params, setParams] = useState<Record<string, string>>({});
  return <ParamContext.Provider value={{ params, setParams }}>{children}</ParamContext.Provider>;
};

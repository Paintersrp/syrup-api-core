import { useState } from 'react';
import React, { createContext } from 'react';

type LayoutContextType = {
  layouts: { [key: string]: React.ReactNode };
  setLayouts: React.Dispatch<React.SetStateAction<{ [key: string]: React.ReactNode }>>;
};

export const LayoutContext = createContext<LayoutContextType>({
  layouts: {},
  setLayouts: () => {},
});

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layouts, setLayouts] = useState<{ [key: string]: React.ReactNode }>({});

  return (
    <LayoutContext.Provider value={{ layouts, setLayouts }}>{children}</LayoutContext.Provider>
  );
};

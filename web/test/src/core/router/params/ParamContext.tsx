import { useContext } from 'react';
import { ParamContext } from './ParamProvider';

export const useParamContext = () => {
  const context = useContext(ParamContext);
  if (!context) {
    throw new Error('useParamContext must be used within a ParamProvider');
  }
  return context;
};

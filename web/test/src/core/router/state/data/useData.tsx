import { useContext } from 'react';
import { DataState } from './types';
import { DataContext } from './DataProvider';

export const useData = (): DataState => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context as DataState;
};

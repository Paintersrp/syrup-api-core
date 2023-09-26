/* eslint-disable @typescript-eslint/no-explicit-any */
export type DataState = {
  data: any | null;
  setData: React.Dispatch<React.SetStateAction<unknown | null>>;
  isLoading: boolean;
  error: unknown | null;
};

export interface DataProviderInterface {
  children: React.ReactNode;
  loadPath: string;
}

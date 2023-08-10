export type PathType = string | null | BasePathStructure;

export interface BasePathStructure {
  [key: string]: PathType;
}

export type PathResolverFunction = (currentPath: string, key: string, value: any) => string;

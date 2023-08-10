import { Options } from 'multer';

export interface FileManagerOptions extends Options {
  uploadDir?: string;
  allowedFileTypes?: string[];
}

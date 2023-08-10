import * as fs from 'fs-extra';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { FileManagerOptions } from './types';
import { Context } from 'koa';

/**
 * Class to manage file operations such as uploading, downloading, deleting, and listing files.
 */
export class FileManager {
  private uploadDir: string;
  private multerHandler: multer.Multer;

  /**
   * Constructs a FileManager instance.
   * @param options Configuration options for file handling.
   */
  constructor(options: FileManagerOptions = {}) {
    this.uploadDir = options.uploadDir || 'uploads/';
    fs.ensureDirSync(this.uploadDir);

    const storage: multer.StorageEngine = multer.diskStorage({
      destination: (_, __, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (_, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    });

    const fileFilter: multer.Options['fileFilter'] = (req, file, cb: FileFilterCallback) => {
      if (options.allowedFileTypes && !options.allowedFileTypes.includes(file.mimetype)) {
        return cb(new Error('File type not allowed') as any, false);
      }
      cb(null, true);
    };

    this.multerHandler = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: options.limits,
    });
  }

  /**
   * Middleware for uploading a single file.
   * @param fieldName The field name for the file input.
   */
  public getSingleFileUploader(fieldName: string) {
    return this.multerHandler.single(fieldName);
  }

  /**
   * Middleware for uploading multiple files.
   * @param fieldName The field name for the file input.
   * @param maxCount The maximum number of files allowed.
   */
  public getMultipleFileUploader(fieldName: string, maxCount: number) {
    return this.multerHandler.array(fieldName, maxCount);
  }

  /**
   * Middleware for uploading files based on specific fields.
   * @param fields An array defining the fields and file count.
   */
  public getFieldFileUploader(fields: multer.Field[]) {
    return this.multerHandler.fields(fields);
  }

  /**
   * Sends a file to the client for download.
   * @param filePath The path of the file to download.
   * @param ctx The Koa context.
   */
  public async downloadFile(filePath: string, ctx: Context): Promise<void> {
    ctx.attachment(filePath);
    ctx.body = fs.createReadStream(filePath);
  }

  /**
   * Deletes a file from the file system.
   * @param filePath The path of the file to delete.
   */
  public async deleteFile(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }

  /**
   * Lists the files in a given directory.
   * @param directory The directory path to list files from.
   * @returns An array of filenames.
   */
  public async listFiles(directory: string = this.uploadDir): Promise<string[]> {
    return await fs.readdir(path.join(__dirname, directory));
  }

  /**
   * Constructs the file path for a given filename and directory.
   * @param filename The name of the file.
   * @param directory The directory path (optional).
   * @returns The constructed file path.
   */
  public getFilePath(filename: string, directory: string = this.uploadDir): string {
    return path.join(__dirname, directory, filename);
  }

  /**
   * Moves a file from the upload directory to a specified destination.
   * @param filename The name of the file.
   * @param destination The destination path (optional).
   * @returns The destination path of the stored file.
   */
  public async storeFile(filename: string, destination: string = this.uploadDir): Promise<string> {
    const srcPath = this.getFilePath(filename);
    const destPath = path.join(destination, filename);

    try {
      await fs.move(srcPath, destPath);
      return destPath;
    } catch (error: any) {
      throw new Error('Failed to store file: ' + error.message);
    }
  }
}

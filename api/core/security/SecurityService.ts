import crypto from 'crypto';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

/**
 * `SecurityService` class provides methods for security-related tasks,
 * including 2FA token generation and verification, encryption and decryption,
 * and secure random token generation.
 */
export class SecurityService {
  /**
   * Generates a 2FA secret using speakeasy.
   * @returns The generated 2FA secret as a base32 string.
   */
  static generate2FASecret(): string {
    return speakeasy.generateSecret().base32;
  }

  /**
   * Generates a QR code for the provided 2FA secret.
   * @param secret The 2FA secret.
   * @returns A promise that resolves with the QR code data URL.
   */
  static generate2FAQrCode(secret: string): Promise<string> {
    return qrcode.toDataURL(speakeasy.otpauthURL({ secret, label: 'YourApp' }));
  }

  /**
   * Verifies a 2FA token against the provided secret.
   * @param secret The 2FA secret.
   * @param token The 2FA token to verify.
   * @returns True if the token is valid, otherwise false.
   */
  static verify2FAToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({ secret, token });
  }

  /**
   * Encrypts the given data using AES-256-GCM algorithm.
   * @param data The data to encrypt.
   * @param key The encryption key.
   * @returns The encrypted data as a hex string.
   */
  static encrypt(data: string, key: Buffer): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('hex');
  }

  /**
   * Decrypts the given data using AES-256-GCM algorithm.
   * @param data The data to decrypt.
   * @param key The decryption key.
   * @returns The decrypted data as a string.
   */
  static decrypt(data: string, key: Buffer): string {
    const buffer = Buffer.from(data, 'hex');
    const iv = buffer.subarray(0, 12);
    const authTag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  /**
   * Generates a secure random token.
   * @param length Optional length of the token. Defaults to 32.
   * @returns The generated token as a hex string.
   */
  static generateSecureRandomToken(length = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}

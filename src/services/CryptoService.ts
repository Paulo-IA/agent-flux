import { createCipheriv, createDecipheriv } from "node:crypto";
import type { ICryptography } from "../interfaces/ICryptography.js";
import { env } from "../env.js";
import { injectable } from "tsyringe";

@injectable()
export class CryptoService implements ICryptography {  
  private secretKey = Buffer.from(env.CRYPTO_SECRET_KEY as string, "hex")
  private iv = Buffer.from(env.CRYPTO_IV as string, "hex")

  encrypt(rawValue: string): string {
    const cipher = createCipheriv('aes-256-cbc', this.secretKey, this.iv);
    let encrypted = cipher.update(rawValue, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
  }

  decrypt(encryptedValue: string): string {
    const decipher = createDecipheriv('aes-256-cbc', this.secretKey, this.iv);
    let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

}
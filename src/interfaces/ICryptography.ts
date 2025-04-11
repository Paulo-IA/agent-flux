export interface ICryptography {
  encrypt(rawValue: string): string
  decrypt(encryptedValue: string): string
}
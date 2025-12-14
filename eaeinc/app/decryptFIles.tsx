/* DECRYPT FILES */
/* Uses AES-256 Decryption to decrypt our files
while in storage. Fairly simple overall. */

// IMPORTS
import crypto from 'crypto';
import fs from 'fs';

// ESTABLISHED CONSTANTS
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Appropriate size for GCM

export function decryptFileBuffer(
  encryptedBuffer: Buffer,
  key: Buffer
): Buffer {
  // 1. Extract IV, auth tag, and ciphertext
  const iv = encryptedBuffer.subarray(0, IV_LENGTH);
  const authTag = encryptedBuffer.subarray(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = encryptedBuffer.subarray(IV_LENGTH + 16);

  // 2. Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  // 3. Decrypt
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted;
}

/* EXAMPLE CALL FOR DECRYPTION: */
/*const encryptedFile = await fs.readFile("stored/encrypted_file.bin");

const decrypted = decryptFileBuffer(encryptedFile, ENCRYPTION_KEY);

await fs.writeFile("restored.pdf", decrypted); */

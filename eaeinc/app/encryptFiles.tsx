/* ENCRYPT FILES */
/* Uses AES-256 Encryption to encrypt our files
while in storage. Fairly simple overall. */

// IMPORTS
import crypto from 'crypto';
import fs from 'fs';

// ESTABLISHED CONSTANTS
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Appropriate size for GCM

// ENCRYPT FUNCTION
export function encryptFileBuffer(fileBuffer: Buffer, key: Buffer): Buffer {
    // GENERATE RANDOM IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // CREATE CIPHER
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // ENCRYPT DATA
    const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);

    const authTag = cipher.getAuthTag();

    // COMBINE IV, AUTH TAG, AND ENCRYPTED DATA
    return Buffer.concat([iv, authTag, encrypted]);
}

/* EXAMPLE CALL FOR ENCRYPTION: */
/* const file = await fs.readFile("downloaded.pdf");

const encrypted = encryptFileBuffer(file, ENCRYPTION_KEY);

await fs.writeFile("stored/encrypted_file.bin", encrypted);*/
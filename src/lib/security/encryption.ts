import crypto from "crypto";

const ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY;

function getEncryptionKey(): Buffer {
  if (!ENCRYPTION_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("TOTP_ENCRYPTION_KEY environment variable is not defined");
    }
    return crypto.createHash("sha256").update("default-dev-totp-encryption-key-please-change").digest();
  }
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted text format");
  }
  
  const iv = Buffer.from(parts[0], "hex");
  const encrypted = Buffer.from(parts[1], "hex");
  const authTag = Buffer.from(parts[2], "hex");
  
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, undefined, "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

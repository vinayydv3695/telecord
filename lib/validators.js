import fs from "fs";
import path from "path";

/**
 * Ensure the token “looks” like a Telegram bot token: number:alphanumeric
 */
export function validateToken(token) {
  if (typeof token !== "string" || token.split(":").length !== 2) {
    console.error(
      'Invalid Telegram bot token. Should be like "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"',
    );
    process.exit(1);
  }
}

/**
 * Ensure the given file exists and is a regular file
 */
export function validateFile(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    console.error(` JSON file not found or not a file: ${resolved}`);
    process.exit(1);
  }
}

/**
 * Ensure the given folder exists and is a directory
 */
export function validateFolder(folderPath) {
  const resolved = path.resolve(folderPath);
  if (!fs.existsSync(resolved)) {
    console.error(` Media folder not found: ${resolved}`);
    process.exit(1);
  }
  if (!fs.statSync(resolved).isDirectory()) {
    console.error(`The specified media folder is not a directory: ${resolved}`);
    process.exit(1);
  }
}

/**
 * Ensure chatId is an integer (Telegram uses numeric IDs, sometimes negative for channels)
 */
export function validateChatId(chatId) {
  if (!/^-?\d+$/.test(chatId)) {
    console.error(
      ` Invalid chat ID: ${chatId}. Must be a number (e.g. -1001234567890).`,
    );
    process.exit(1);
  }
}

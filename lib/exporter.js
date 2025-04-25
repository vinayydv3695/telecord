import fs from "fs";
import axios from "axios";
import path from "path";
import mime from "mime-types";
import cliProgress from "cli-progress";
import FormData from "form-data";
import { info, warn, error } from "./logger.js";

export async function runTelecord({
  file,
  media,
  token,
  chatId,
  delay,
  reverse,
}) {
  const rawData = JSON.parse(fs.readFileSync(file, "utf-8"));
  const messages = Array.isArray(rawData) ? rawData : rawData.messages;

  if (!Array.isArray(messages)) {
    throw new Error(
      "The input JSON must be an array or contain a 'messages' array.",
    );
  }

  const sortedMessages = reverse ? messages.reverse() : messages;

  const progressBar = new cliProgress.SingleBar({
    format: "Sending [{bar}] {percentage}% | {value}/{total} messages",
    barCompleteChar: "\u2588",
    barIncompleteChar: "-",
    hideCursor: true,
  });

  progressBar.start(sortedMessages.length, 0);

  for (let i = 0; i < sortedMessages.length; i++) {
    const msg = sortedMessages[i];

    try {
      if (msg.content) {
        await sendMessage(token, chatId, msg.content);
        await wait(delay);
      }

      if (Array.isArray(msg.attachments)) {
        for (const attachment of msg.attachments) {
          const filePath = path.join(media, path.basename(attachment.url));
          if (fs.existsSync(filePath)) {
            await sendPhoto(token, chatId, filePath);
            await wait(delay);
          } else {
            warn("Skipping missing media file: " + filePath);
          }
        }
      }

      progressBar.update(i + 1);
    } catch (err) {
      error("Failed to send message:", err.message);
    }
  }

  progressBar.stop();
}

async function sendMessage(token, chatId, text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await axios.post(url, {
    chat_id: chatId,
    text,
  });

  if (!res.data.ok) {
    throw new Error(res.data.description);
  }
}

async function sendPhoto(token, chatId, filePath) {
  const url = `https://api.telegram.org/bot${token}/sendPhoto`;
  const formData = new FormData();
  const fileStream = fs.createReadStream(filePath);
  formData.append("chat_id", chatId);
  formData.append("photo", fileStream, {
    contentType: mime.lookup(filePath) || "application/octet-stream",
  });

  const res = await axios.post(url, formData, {
    headers: formData.getHeaders(),
  });

  if (!res.data.ok) {
    throw new Error(res.data.description);
  }
}

function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

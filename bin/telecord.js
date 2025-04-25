#!/usr/bin/env node

import path from "path";
import { Command } from "commander";
import inquirer from "inquirer";
import {
  validateToken,
  validateFile,
  validateFolder,
  validateChatId,
} from "../lib/validators.js";
import { runTelecord } from "../lib/exporter.js";
import { configureLogger, info, error } from "../lib/logger.js";

const program = new Command();

program
  .name("telecord")
  .description("Export Discord chat (from JSON) to Telegram")
  .version("1.0.0")
  .option("-i, --interactive", "Run in interactive mode")
  .option("-f, --file <path>", "Path to Discord export JSON file")
  .option(
    "-m, --media <path>",
    "Folder containing media files (e.g. media.json_Files)",
  )
  .option("-t, --token <string>", "Telegram Bot token")
  .option("-c, --chat <id>", "Discord Channel ID")
  .option("-d, --delay <seconds>", "Delay between messages (default: 1)", "1")
  .option(
    "-r, --reverse",
    "Send newest messages first instead of oldest first",
    false,
  )
  .option("-v, --verbose", "Enable verbose (debug) logging", false)
  .addHelpText(
    "after",
    `
Examples:
  $ telecord --interactive
  $ telecord -f media.json -m media.json_Files -t 123:abc -c 987654321 --verbose
`,
  );

program.parse(process.argv);

/**
 * If interactive mode is enabled, prompt the user for each option.
 * Otherwise, just return the parsed flags.
 */
async function getOptions() {
  const opts = program.opts();

  if (!opts.interactive) {
    // Non-interactive: return what's on the command line
    return opts;
  }

  // Interactive: ask for each value, with defaults from any flags
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "file",
      message: "Path to Discord JSON file:",
      default: opts.file,
      validate: (i) => (i ? true : "Please enter a file path."),
    },
    {
      type: "input",
      name: "media",
      message: "Folder containing media files:",
      default: opts.media,
      validate: (i) => (i ? true : "Please enter a media folder."),
    },
    {
      type: "input",
      name: "token",
      message: "Telegram Bot token:",
      default: opts.token,
      validate: (i) =>
        i.split(":").length === 2
          ? true
          : "Token must be in the form number:letters",
    },
    {
      type: "input",
      name: "chat",
      message: "Discord  Chat ID:",
      default: opts.chat,
      validate: (i) => (/^-?\d+$/.test(i) ? true : "Chat ID must be numeric"),
    },
    {
      type: "input",
      name: "delay",
      message: "Delay between messages (seconds):",
      default: opts.delay,
      validate: (i) =>
        !isNaN(parseFloat(i)) ? true : "Delay must be a number",
    },
    {
      type: "confirm",
      name: "reverse",
      message: "Send newest messages first?",
      default: opts.reverse,
    },
    {
      type: "confirm",
      name: "verbose",
      message: "Enable verbose logging?",
      default: opts.verbose,
    },
  ]);

  return answers;
}

(async () => {
  try {
    // Gather flags or interactive answers
    const opts = await getOptions();

    // In non-interactive mode, ensure required flags are present
    if (!opts.interactive) {
      const missing = [];
      if (!opts.file) missing.push("--file");
      if (!opts.media) missing.push("--media");
      if (!opts.token) missing.push("--token");
      if (!opts.chat) missing.push("--chat");
      if (missing.length) {
        console.error(`❌ Missing required options: ${missing.join(", ")}`);
        process.exit(1);
      }
    }

    // Validate inputs
    validateToken(opts.token);
    validateFile(path.resolve(opts.file));
    validateFolder(path.resolve(opts.media));
    validateChatId(opts.chat);

    // Configure verbose logger
    configureLogger(opts.verbose);
    if (opts.verbose) info("Verbose logging enabled");

    // Build config
    const config = {
      file: path.resolve(opts.file),
      media: path.resolve(opts.media),
      token: opts.token,
      chatId: opts.chat,
      delay: parseFloat(opts.delay),
      reverse: opts.reverse,
    };

    // Run the export
    await runTelecord(config);
    info("✅ Finished without errors.");
    process.exit(0);
  } catch (err) {
    error(`Telecord error: ${err.message}`);
    process.exit(1);
  }
})();

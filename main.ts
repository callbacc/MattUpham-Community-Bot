if (Number(process.version.slice(1).split(".")[0]) < 12) {
  throw new Error(
    "Node 12.0.0 or higher is required. Update Node on your system."
  );
}

import dotenv from "dotenv";
if (!process.env.DISCORD_API_KEY) {
  dotenv.config({ path: __dirname + "/.env" });
}

import { promisify } from "util";
import ClientBot from "./types/clientbot.types";
import { Command } from "./types/command.types";
import glob from "glob";

const globReaddir = promisify(glob);

const client = new ClientBot();

const init = async function () {
  const commandFiles: string[] = await globReaddir("commands/**/*.ts");
  client.logger.info(`Loading a total of ${commandFiles.length} Commands`);
  commandFiles.forEach(async (f) => {
    // console.log(f);
    const groups = /(?<category>\w+)\/(?<commandName>\w+).ts$/.exec(f)?.groups;
    if (!groups || !groups.commandName || !groups.category) return;
    const { commandName } = groups;
    client.logger.info(`Loading Command: ${commandName}`);
    try {
      const command: Command = (await import(`./${f}`)).default;
      client.commands.set(commandName, command);
    } catch (error) {
      client.logger.info(
        `Loading command ${commandName} gave an error: ${error}`
      );
    }
  });

  const eventFiles: string[] = await globReaddir("events/*.ts", {
    cwd: __dirname,
  });
  client.logger.info(`Loading a total of ${eventFiles.length} Events`);
  eventFiles.forEach(async (f) => {
    // console.log(f);
    const groups = /events\/(?<eventName>\w+).ts$/.exec(f)?.groups;
    if (!groups || !groups.eventName) return;
    const eventName = groups.eventName;
    client.logger.info(`Loading Event: ${eventName}`);
    try {
      const event = (await import(`./${f}`)).default;
      client.on(eventName, event.bind(null, client));
    } catch (error) {
      client.logger.info(`Loading event ${eventName} gave an error: ${error}`);
    }
  });
};

init();

client.login(process.env.DISCORD_API_KEY);

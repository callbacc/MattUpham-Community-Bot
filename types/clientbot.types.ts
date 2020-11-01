import { Client, ClientOptions, Message, MessageEmbed } from "discord.js";
import { Command } from "./command.types";
import winston from "winston";
import Logger from "../config/winston";
import { promisify } from "util";
import { SettingsModel } from "../models/settings.model";
import {
  ISettingsDocument,
  ISettings,
} from "../models/settings.types";
import config, { defaultSettings } from "../config/config.json";
import { connect } from "../config/db";

export default class ClientBot extends Client {
  commands: Map<string, Command> = new Map();

  defaultSettings: ISettings = {
    guildId: "default",
    ...defaultSettings,
  };

  logger: winston.Logger = Logger;
  mode: "MAINTENANCE" | "ACTIVE" = "MAINTENANCE";
  wait = promisify(setTimeout);

  constructor(options?: ClientOptions | undefined) {
    super(options);
    connect();

    process.on("uncaughtException", (err: Error) => {
      // Replaces absolute file ardress with relative file address
      const errrorMsg: string = err.stack?.replace(
        new RegExp(`${__dirname}/`, "g"),
        "./"
      ) as string;
      this.logger.error(`Uncaught exception ${errrorMsg}`);
      console.error(err);

      process.exit(1);
    });

    process.on("unhandledRejection", (err: Error) => {
      this.logger.error(`Unhandled rejection: ${err}`);
      console.log(err);
    });
  }

  async getOrCreateGuildSettings(guildID: string): Promise<ISettings> {
    const settingsDoc: ISettingsDocument = await SettingsModel.findOneOrCreate(
      guildID
    );
    if (!settingsDoc) return this.defaultSettings;
    const settings: ISettings = {
      guildId: settingsDoc.guildId,
      prefix: settingsDoc.prefix,
      enabledCommands: settingsDoc.enabledCommands,
      welcomeEnabled: settingsDoc.welcomeEnabled,
      welcomeChannelId: settingsDoc.welcomeChannelId,
    };
    return settings;
  }

  newMessageEmbed(
    title: string,
    content?: string,
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>
  ): MessageEmbed {
    const embed: MessageEmbed = new MessageEmbed()
      .setColor(config.embedColor)
      .setAuthor(this.user?.username.toUpperCase())
      .setTitle(title)
      .setDescription(content)

    if (fields) {
      embed.addFields(...fields);
    }

    embed
      .setTimestamp()
      .setFooter("Some footer text here", "https://i.imgur.com/wSTFkRM.png");
    return embed;
  }
}
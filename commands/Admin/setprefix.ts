import { SettingsModel } from "../../models/settings.model";
import { Command } from "../../types/command.types";

const Ping: Command = {
  conf: {
    guildOnly: true,
    permLevel: "User",
    enabledDefault: true,
  },
  help: {
    name: "Setprefix",
    category: "Admin",
    description: "Change the bot prefix for your server.",
    usage: "setprefix [prefix]"
  },
  run: async function(client, message, args) {
    if (!args[0]) return message.reply("No prefix specified. Try again!");

    const prefix: string = args[0];

    try {
      await SettingsModel.updateOne(
        { guildId: message.guild?.id },
        {
          $set: {
            prefix: prefix
          }
        }
      )
      return message.reply("Guild Settings have been updated");
    } catch (error) {
      client.logger.error(error);
    }
  }
}

export default Ping;
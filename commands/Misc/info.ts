import { Message, MessageEmbed } from "discord.js";
import ClientBot from "../../types/clientbot.types";
import { Command, CommandConf, CommandHelp } from "../../types/command.types";

const Ping: Command = {
  conf: {
    enabledDefault: true,
    guildOnly: false,
    permLevel: "User"
  },
  help: {
    name: "info",
    category: "Misc",
    description: "The classic ping! Returns network and API latency",
    usage: "ping"
  },
  run: async function (client, message, args: string[]) {
    const guildCount: number = client.guilds.cache.size;
    const userCount: number = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    const _ = new MessageEmbed()
      .setColor("151415")
      .setTitle("Community Bot's Info")
      //@ts-ignore
      .setImage(client.user.displayAvatarURL())
      .setDescription(`Bot in **${guildCount}** guilds.
      Currently serving **${userCount}** users :)`);
    message.channel.send(_)
  }
}

export default Ping;
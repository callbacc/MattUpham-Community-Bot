import { Command } from "../../types/command.types";
import { MessageEmbed } from "discord.js";
import { isGetAccessor } from "typescript";

const Ban: Command = {
  conf: {
    guildOnly: true,
    permLevel: "Admin",
    enabledDefault: true,
  },
  help: {
    name: "ban",
    category: "Misc",
    description: "Help command displays all available commands and their usage",
    usage: "help",
  },
  run: async function (client, message, args: string[]) {
    console.log("!")
    if (!message.guild?.me?.hasPermission('BAN_MEMBERS'))
      return message.reply('No permisson.')

    const user = await message.mentions.users.first();
    var reason = args.slice(1).join(" ");
    if (!reason) reason = "Default reason";
  
    if (!user)
        return message.reply("Couldn't fetch user.");

    const member = await message.guild.members
        .fetch(user)
        .catch(() => null);

    if (member && !member.bannable)
        return message.reply("Can't ban him.");

    //message.guild.members.ban(user, { reason: reason });

    const embed = new MessageEmbed()
        .setColor(0xff0000)
        .setFooter('Community Bot')
        .setTitle("BAN")
        .setDescription(`Ban in ${message.guild.name}`)
        .addFields([
            {
                name: "Moderator",
                value: message.author.tag
            }
        ]);
    if (args[1])
        embed.addFields([
            {
                name: "Reason",
                value: args[1]
            }
        ]);

    await user.send(embed).catch(() => null);

    await message.guild.members
        .ban(user)
        .catch((err) => {
            if (err === "Error: Couldn't resolve the user ID to ban.")
                return message.reply("User not found.");
            return message.reply("Error");
        });
    return message.reply(`Banned ${user.tag}, for ${reason}.`);
  },
};

export default Ban;
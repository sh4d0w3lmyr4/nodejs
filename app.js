import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.once("ready", () => {
  console.log("Hardground BOT ONLINE 💀");
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("PONG 🔊 HARDGROUND LIVE");
  }
});

client.login(process.env.TOKEN);

import { EmbedBuilder } from "discord.js";

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.find(
    ch => ch.name === "welcome"
  );

  if (!channel) return;

  const welcomeEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("💀 WELCOME TO HARDGROUND 💀")
    .setDescription(
      `Welkom ${member}!\n\n` +
      `Dit is geen soft server.\n` +
      `**DIT IS BETON. BASS. TEMPO.**\n\n` +
      `⚡ Check **#regels**\n` +
      `⚡ Kies je rollen in **#rollen**\n` +
      `⚡ Drop je eerste banger in **#track-drops**\n\n` +
      `**HAK HARD. LUISTER HARDER.**`
    )
    .setImage(https://cdn.discordapp.com/attachments/1101254205492179015/1458905150746787965/Hardground_welcome_banner_500x350_1.png?ex=696156cd&is=6960054d&hm=fe8ec55d7ec8c2bdbe5885731de800477d0384a2965f18b249b8812c89b57da1&)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: "Hardground • Underground Hardcore" })
    .setTimestamp();

  channel.send({ embeds: [welcomeEmbed] });
});

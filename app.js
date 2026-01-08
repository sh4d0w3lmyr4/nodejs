import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.once("ready", () => {
  console.log("Hardground BOT ONLINE 💀");
});

// Test commands
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    return message.reply("PONG 🔊 HARDGROUND LIVE");
  }

  if (message.content === "!status") {
    return message.reply("Ik leef 💀");
  }
});

// Welcome message bij join
client.on("guildMemberAdd", async (member) => {
  const channelName = "welkom"; // <-- jouw kanaal
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === channelName
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
    .setImage(
      "https://cdn.discordapp.com/attachments/1101254205492179015/1458905150746787965/Hardground_welcome_banner_500x350_1.png"
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: "Hardground • BETON • BASS • TEMPO" })
    .setTimestamp();

  await channel.send({ embeds: [welcomeEmbed] });
});

client.login(process.env.TOKEN);

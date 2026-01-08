import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Partials
} from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,      // join events
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions // reaction roles
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// ===== SETTINGS (pas dit aan als je kanaal anders heet) =====
const WELCOME_CHANNEL_NAME = "welkom";
const ROLES_CHANNEL_NAME = "rollen";

// Welcome banner link (Discord CDN link)
const WELCOME_BANNER_URL =
  "https://cdn.discordapp.com/attachments/1101254205492179015/1458905150746787965/Hardground_welcome_banner_500x350_1.png";

// Reaction roles mapping
const roleMap = {
  // OUDE
  "🔵": "Millennium",
  "🟡": "Uptempo",
  "🔴": "Oldschool Gabber",
  "🟣": "Industrial",
  "🎧": "Producer",

  // HARDCORE
  "💀": "Hardcore",
  "🟢": "Early Hardcore",
  "🔷": "Millennium Hardcore",
  "🖤": "Darkcore",
  "🔥": "Terror",
  "💥": "Speedcore",
  "🪓": "Doomcore",

  // HARDSTYLE
  "⚡": "Hardstyle",
  "🧬": "Rawstyle",
  "🎵": "Euphoric Hardstyle",

  // OVERIG
  "💣": "Frenchcore",
  "⚙️": "Hardcore Techno"
};

// ===== READY =====
client.once("ready", () => {
  console.log("Hardground BOT ONLINE 💀");
});

// ===== COMMANDS =====
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    return message.reply("PONG 🔊 HARDGROUND LIVE");
  }

  if (message.content === "!status") {
    return message.reply("Ik leef 💀");
  }

  // Admin command: maak reaction-roles bericht in #rollen
  if (message.content === "!rolesetup") {
    // basic admin check (werkt als je Administrator hebt)
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ Alleen admins kunnen dit doen.");
    }

    const channel = message.guild.channels.cache.find(
      (ch) => ch.name === ROLES_CHANNEL_NAME
    );
    if (!channel) return message.reply(`❌ Kanaal #${ROLES_CHANNEL_NAME} niet gevonden.`);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("💀 KIES JE EIGEN ROL 💀")
.setDescription(
  "**🎭 KIES JE EIGEN ROL – HARDGROUND**\n\n" +

  "**🧱 BASIS**\n" +
  "🔵 Millennium\n" +
  "🟡 Uptempo\n" +
  "🔴 Oldschool Gabber\n" +
  "🟣 Industrial\n" +
  "🎧 Producer\n\n" +

  "**🔥 HARDCORE**\n" +
  "💀 Hardcore\n" +
  "🟢 Early Hardcore\n" +
  "🔷 Millennium Hardcore\n" +
  "🖤 Darkcore\n" +
  "🔥 Terror\n" +
  "💥 Speedcore\n" +
  "🪓 Doomcore\n\n" +

  "**⚡ HARDSTYLE**\n" +
  "⚡ Hardstyle\n" +
  "🧬 Rawstyle\n" +
  "🎵 Euphoric Hardstyle\n\n" +

  "**💣 OVERIG**\n" +
  "💣 Frenchcore\n" +
  "⚙️ Hardcore Techno"
)

      .setFooter({ text: "Hardground • BETON • BASS • TEMPO" });

    const sent = await channel.send({ embeds: [embed] });

    for (const emoji of Object.keys(roleMap)) {
      await sent.react(emoji);
    }

    return message.reply("✅ Rollen-bericht geplaatst in #rollen.");
  }
});

// ===== WELCOME ON JOIN =====
client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === WELCOME_CHANNEL_NAME
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
    .setImage(WELCOME_BANNER_URL)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: "Hardground • BETON • BASS • TEMPO" })
    .setTimestamp();

  await channel.send({ embeds: [welcomeEmbed] });
});

// ===== REACTION ROLES (ADD) =====
client.on("messageReactionAdd", async (reaction, user) => {
  try {
    if (user.bot) return;

    // partial fix
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    const emoji = reaction.emoji.name;
    const roleName = roleMap[emoji];
    if (!roleName) return;

    const guild = reaction.message.guild;
    if (!guild) return;

    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.find((r) => r.name === roleName);
    if (!role) return;

    await member.roles.add(role);
  } catch (err) {
    console.log("ReactionAdd error:", err);
  }
});

// ===== REACTION ROLES (REMOVE) =====
client.on("messageReactionRemove", async (reaction, user) => {
  try {
    if (user.bot) return;

    // partial fix
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    const emoji = reaction.emoji.name;
    const roleName = roleMap[emoji];
    if (!roleName) return;

    const guild = reaction.message.guild;
    if (!guild) return;

    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.find((r) => r.name === roleName);
    if (!role) return;

    await member.roles.remove(role);
  } catch (err) {
    console.log("ReactionRemove error:", err);
  }
});

client.login(process.env.TOKEN);

// ===== REGELS FOTO =====
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!regels") {
    const channel = message.guild.channels.cache.find(
      (ch) => ch.name === "regels"
    );
    if (!channel) return message.reply("❌ Kanaal #regels niet gevonden.");

await channel.send("https://media.discordapp.net/attachments/1101254205492179015/1458922559314591925/ChatGPT_Image_8_jan_2026_21_09_03.png?ex=69616703&is=69601583&hm=678467d3aed4684aa2ee012e488c5cb334da572c505f89c1326fdaf705f51fb7&=&format=webp&quality=lossless&width=640&height=960");


    await channel.send({ embeds: [embed] });
    return message.reply("✅ Regels geplaatst.");
  }
});

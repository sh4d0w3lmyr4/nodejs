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
// ===== LEVEL SYSTEM (Hardground) =====
import fs from "fs";

const LEVELS_FILE = "./levels.json";

// anti-spam: max 1x XP per 30 sec per persoon
const xpCooldown = new Map();

function loadLevels() {
  try {
    if (!fs.existsSync(LEVELS_FILE)) fs.writeFileSync(LEVELS_FILE, "{}");
    return JSON.parse(fs.readFileSync(LEVELS_FILE, "utf8") || "{}");
  } catch (e) {
    console.log("levels.json error:", e);
    return {};
  }
}

function saveLevels(data) {
  fs.writeFileSync(LEVELS_FILE, JSON.stringify(data, null, 2));
}

// JOUW ROLNAMEN (zoals in Discord) + levels
const levelRoles = [
  { level: 1, role: "New Blood" },
  { level: 2, role: "Concrete Kid" },
  { level: 3, role: "Underground" },
  { level: 4, role: "Beat Seeker" },
  { level: 5, role: "Listener" },
  { level: 7, role: "Basshead" },
  { level: 9, role: "Tempo Hunter" },
  { level: 10, role: "Raver" },
  { level: 12, role: "Party Starter" },
  { level: 15, role: "Hardcore Minded" },
  { level: 18, role: "Kickdrum Warrior" },
  { level: 20, role: "Industrial Soul" },
  { level: 22, role: "Concrete Soldier" },
  { level: 25, role: "Hardcore Crew" },
  { level: 30, role: "Gabber" },
  { level: 35, role: "Riot Mode" },
  { level: 40, role: "No Mercy" },
  { level: 45, role: "Danger Zone" },
  { level: 50, role: "Beton Beuker" },
  { level: 60, role: "Underground Legend" },
  { level: 70, role: "Hardground Veteran" },
  { level: 80, role: "Tempo Machine" },
  { level: 90, role: "Boss of Bass" },
  { level: 100, role: "Hardground Elite" }
];

function getRoleForLevel(lvl) {
  // hoogste role waarvan level <= lvl
  const sorted = [...levelRoles].sort((a, b) => a.level - b.level);
  let pick = null;
  for (const r of sorted) if (lvl >= r.level) pick = r;
  return pick;
}

client.on("messageCreate", async (message) => {
 

  // XP cooldown
  const now = Date.now();
  const last = xpCooldown.get(message.author.id) || 0;
  if (now - last < 30_000) return; // 30s
  xpCooldown.set(message.author.id, now);

  // XP + level
  const data = loadLevels();
  const id = message.author.id;

  if (!data[id]) data[id] = { xp: 0, level: 1 };

  const gain = Math.floor(Math.random() * 11) + 5; // 5-15
  data[id].xp += gain;

  const need = data[id].level * 100;

  if (data[id].xp >= need) {
    data[id].level += 1;
    data[id].xp = 0;

    // 1 level-rol tegelijk: oude weg, nieuwe erbij
    const member = await message.guild.members.fetch(id);

    // haal alle level-rollen weg
    for (const lr of levelRoles) {
      const roleObj = message.guild.roles.cache.find(r => r.name === lr.role);
      if (roleObj && member.roles.cache.has(roleObj.id)) {
        await member.roles.remove(roleObj).catch(() => {});
      }
    }

    // geef nieuwe passende rol
    const newRoleData = getRoleForLevel(data[id].level);
    if (newRoleData) {
      const newRole = message.guild.roles.cache.find(r => r.name === newRoleData.role);
      if (newRole) {
        await member.roles.add(newRole).catch(() => {});
      }
    }

   const lvl = data[id].level;

const embed = new EmbedBuilder()
  .setTitle("💀 LEVEL UP 💀")
  .setDescription(`🔥 **${message.author.username}** is nu **LEVEL ${lvl}**!`)
  .setFooter({ text: "Hardground • BETON • BASS • TEMPO" })
  .setTimestamp();

// (optioneel) als je een level-rol hebt gekregen, toon die
const got = getRoleForLevel(lvl):
if (got?.role) embed.addFields({ name: "🎖️ Nieuwe Rank", value: got.role, inline: true });

// (optioneel) banner in je embed (plak jouw regels/welcome banner link hier)
embed.setImage("https://media.discordapp.net/attachments/1101254205492179015/1458961598373695589/ChatGPT_Image_9_jan_2026_00_11_59.png?ex=69618b5f&is=696039df&hm=db2d4489ae5a660c9dae2fb51278498f60de13567e8a092d729cb0d5618ba01f&=&format=webp&quality=lossless&width=525&height=350");

await message.channel.send({ embeds: [embed] });
);
  }

  saveLevels(data);
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

await channel.send("https://media.discordapp.net/attachments/1101254205492179015/1458933507442085929/ChatGPT_Image_8_jan_2026_22_20_41.png?ex=69617135&is=69601fb5&hm=574a26f9773a56170db15db53a31dfecc8bda9bed95c221aad781a143edf8cd3&=&format=webp&quality=lossless&width=525&height=350");


    await channel.send({ embeds: [embed] });
    return message.reply("✅ Regels geplaatst.");
  }
});

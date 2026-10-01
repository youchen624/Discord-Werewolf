const path = require('path');
const Log = require('./Logger');
const Modules = require('./BotModules');
const {
    Client,
    Events,
    GatewayIntentBits,
    PermissionsBitField,
    MessageFlags,
    ChannelType,
    ButtonStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    EmbedBuilder,
    REST,
    Routes,
    Integration
} = require('discord.js');

class Bot {
    constructor(config) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        });
        this.client.config = config;
    };
    async begin() {
        await Modules(this.client);
        /*
        // this.client.config = await Config.load(configPath);
        // 執行指令handler
        this.client.on(Events.InteractionCreate, async (interaction) => {
            await Commands.run(interaction);
            // await Modal.handle(interaction);
            // await Buttons.handel(interaction);
        });
        // 成員更新
        this.client.on(Events.GuildMemberUpdate, async (oldM, newM) => {
            // 加成伺服器捕捉
            // if ((oldM.premiumSince !== newM.premiumSince) && newM.premiumSince) {
            //     try {
            //         const channel = await this.client.channels.fetch(this.client.config.data.boostedChannel);
            //         await channel.send({
            //             embeds: await require('./src/embeds/boosted')(this.client, newM),
            //         });
            //     } catch (e) { Log.error(e); }
            // }
        });
        */
        // 啟動執行項
        this.client.once(Events.ClientReady, async () => {
            Log.info(`[Bot] 🟢 Online.`);
            // const guild = this.client.guilds.cache.get(this.client.config.id.guild);
            this.client.user.setPresence({
                activities: [{ name: '歪喵團隊製作', type: 0 }],
                status: 'online',
            });
            // Commands.register(this.client, guild);
        });
        // 關閉執行項
        process.on('SIGINT', async () => {
            Log.info(`[Bot] 🔴 Offline.`);
            if (!this.client || !this.client.isReady()) { process.exit(0); }
            setTimeout(() => process.exit(0), 1000);
        });
        // 登入Bot
        this.client.login(this.client.config.token);
    };
};

module.exports = Bot
const Log = require('../Logger');
const {
    GameBuilder,
    GameEvent
} = require('../Werewolf'); // the freaking error error (not a error, just erroring showing error)

const {
    StringSelectMenuOptionBuilder,
    StringSelectMenuBuilder,
    SlashCommandBuilder,
    AttachmentBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    ButtonBuilder,
    ModalBuilder,
    Component,
    ButtonStyle,
    ChannelType,
    TextInputStyle,
    MessageFlags,
    PermissionFlagsBits,
} = require("discord.js");
// const componentsB = [
//     new ActionRowBuilder().addComponents(
//         new ButtonBuilder()
//             .setCustomId(`test`)
//             .setLabel('測試表單')
//             .setStyle(ButtonStyle.Primary),
//     ),
// ];

// command sample
{
    const CommandExample =
        new SlashCommandBuilder()
            /* interaction.options.getUser('user');
            */
            // 布林值參數
            .addBooleanOption(option =>
                option.setName('confirm')
                    .setDescription('確認操作')
                    .setRequired(true)
            )

            // 整數參數
            .addIntegerOption(option =>
                option.setName('amount')
                    .setDescription('金額')
                    .setRequired(true)
            )

            // 小數參數
            .addNumberOption(option =>
                option.setName('rating')
                    .setDescription('評分 (1.0 - 5.0)')
                    .setRequired(true)
            )

            // 字串參數
            .addStringOption(option =>
                option.setName('item')
                    .setDescription('商品名稱')
                    .setRequired(true)
            )

            // "使用者"參數
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('選擇用戶')
                    .setRequired(true)
            )

            // "身分組"參數
            .addRoleOption(option =>
                option.setName('role')
                    .setDescription('選擇身分組')
                    .setRequired(false)
            )

            // "頻道"參數
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('選擇頻道')
                    .setRequired(true)
            )
            // 各式頻道(包括類別)參數
            .addChannelOption(option =>
                option.setName('category')
                    .setDescription('選擇一個頻道分類')
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildCategory) // 限制只能選擇分類
            )
            /**
            ChannelType.GuildText	0	文字頻道
            ChannelType.GuildVoice	2	語音頻道
            ChannelType.GuildCategory	4	分類
            ChannelType.GuildAnnouncement	5	公告頻道
            ChannelType.PublicThread	11	公開討論串
            ChannelType.PrivateThread	12	私人討論串
            ChannelType.GuildStageVoice	13	舞台頻道
             */

            // "可標註"參數
            .addMentionableOption(option =>
                option.setName('mention')
                    .setDescription('選擇提及對象')
                    .setRequired(false)
            )

            // "附件"參數
            .addAttachmentOption(option =>
                option.setName('file')
                    .setDescription('上傳檔案')
                    .setRequired(false)
            )

            // 預設選項參數
            .addStringOption(option =>
                option.setName('type')
                    .setDescription('選擇類型')
                    .setRequired(true)
                    .addChoices(
                        { name: '文字', value: 'text' },
                        { name: '圖片', value: 'image' },
                        { name: '影片', value: 'video' }
                    )
            );
}

/**
 * #TODO
 * default games from file when bot begin/online
 * by using new GameBuilder().....
 */

const defaultConfig = {
    name: '',
    channels: {
        seat: [],
        main: '',
        voice: '',
        wolf: '', // only for night
    },
    roles: [],
    playerCounts: 9,
    discuss: false,
    healSelf: true,
};
const commands = [
    {
        data: new SlashCommandBuilder()
            .setName('創建遊戲')
            .setDescription('Create a game')
            .addChannelOption(option =>
                option.setName('category')
                    .setDescription('選擇一個頻道分類')
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildCategory)
            )
            .addStringOption(option =>
                option.setName('name')
                    .setDescription('場地名稱')
                    .setRequired(true)
            ),
        permissions: {
            roles: [],
            ids: [],
        },
        async execute(interaction, params) {
            const category = interaction.options.getChannel('category');
            if(interaction.client.games[category.id]) {
                await interaction.reply({
                    content: 'Game already exist.'
                })
                return;
            }
            interaction.client.games[category.id] = category;
            category.game = new GameBuilder(interaction.client, defaultConfig);
            await interaction.reply({
                // components: componentsB,
                content: "Game created.",
            });
        },
    },
    {
        data: new SlashCommandBuilder()
            .setName('測試2')
            .setDescription('測試用'),
        permissions: {
            roles: [],
            ids: [],
        },
        async execute(interaction, params) {
            await interaction.reply({
                components: componentsB,
                content: "test2 done",
            });
        },
    }
];


// button sample
/*
ButtonStyle.
主要按鈕	Primary	藍色 🔵
次要按鈕	Secondary	灰色 ⚪️
成功按鈕	Success	綠色 🟢
危險按鈕	Danger	紅色 🔴
連結按鈕	Link	透明（藍字）🔗
*/
const buttons = {
    "test": async function (interaction, params) {
        const modal = new ModalBuilder()
            .setCustomId(`test`)
            .setTitle('test表單')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('t')
                        .setLabel('測試')
                        .setStyle(TextInputStyle.Short)
                )
            );
        interaction.showModal(modal);
    }
};
const modals = {
    "test": async function (interaction, params) {
        const tt = interaction.fields.getTextInputValue('t');
        await interaction.reply({
            content: `modal test done>${tt}<`,
        });
    }
};

// select menu sample
{
    const selectMenu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('選擇一個選項')
                .addOptions([
                    {
                        label: '選項 1',
                        value: 'option_1',
                    },
                    {
                        label: '選項 2',
                        value: 'option_2',
                    },
                    {
                        label: '選項 3',
                        value: 'option_3',
                    },
                ]),
        );
    const selectMenu2 = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('service')
            .setPlaceholder('進行選擇')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('💵購買商品')
                    .setValue('buy'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('🫡售後服務')
                    .setValue('after'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('⚠️檢舉')
                    .setValue('report')
            )
    );
}
const menus = {
    "test": async function (interaction, params) {
        const tt = interaction.values[0];
        await interaction.reply({
            content: `modal test done>${tt}<`,
        });
    }
};
async function custom(client) {};
module.exports = {
    commands,
    buttons,
    menus,
    modals,
    custom,
};
const Path = require('path');
const fs = require('fs');
const Log = require('./Logger');
const {
    Events,
    Collection,
    MessageFlags,
} = require('discord.js');

const modulesPath = Path.join(process.rootPath, 'src/modules');

async function inProblem(interaction, msg) {
    /**
     * @name inProblem
     * @param interaction :interaction
     * @param msg :string "when" happen
     * @description used to reply for error.
     */
    const raw = {
        content: `${msg}時發生錯誤`,
        embeds: [],
        flags: [MessageFlags.Ephemeral],
    };
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp(raw);
    } else {
        await interaction.reply(raw);
    }
}

async function register(client) {
    client.commands = new Collection();
    client.buttons = {}; // id : handle
    client.menus = {}; // id : handle
    client.modals = {}; // id : handle
    // const commandsAll = [];
    const moduleFiles = fs.readdirSync(modulesPath).filter((file) => file.endsWith('.js') && !file.startsWith('.'));
    for (const file of moduleFiles) {
        // modules loader
        const filePath = Path.join(modulesPath, file);
        const {
            commands, buttons, menus, modals, custom
        } = require(filePath);
        // #TODO like messages { "key": { mode: 'theMode' } }
        // // the mode like 'include' 'start-with' 'end-with'
        if (custom) try {
            await custom(client);
        } catch (e) { Log.error(e); }
        if (!(commands || buttons || menus || modals)) continue;
        commands.forEach((cmd) => {
            // commandsAll.push(cmd.data.toJSON())
            client.commands.set(cmd.data.name, cmd);
        });
        for (const key in buttons) {
            if (key in client.buttons)
                Log.warn(`[Bot] Button "${key}" already exist, overwrite it...`);
            client.buttons[key] = buttons[key];
        }
        for (const key in menus) {
            if (key in client.menus)
                Log.warn(`[Bot] Menu "${key}" already exist, overwrite it...`);
            client.menus[key] = menus[key];
        }
        for (const key in modals) {
            if (key in client.modals)
                Log.warn(`[Bot] Modals "${key}" already exist, overwrite it...`);
            client.modals[key] = modals[key];
        }
        // #TODO add more function here, like "Event.GuildMemberUpdate" or something else...
    }
    client.on(Events.InteractionCreate, async (interaction) => {
        // interaction handlers
        const commandName = interaction.commandName;
        const customId = interaction.customId;
        const rawId = commandName?.split('.') || customId?.split('.');
        const id = rawId[0];
        const params = rawId.slice(1);
        switch (true) {
            case (interaction.isChatInputCommand()): {
                const command = interaction.client.commands.get(id);
                if (!command) {
                    Log.error(`[Bot] Command "${commandName}" not exist.`);
                    return;
                }
                try {
                    await command.execute(interaction, params);
                } catch (e) {
                    Log.error(`[Bot] Command ${commandName} executing ${e}`);
                    await inProblem(interaction, "執行指令");
                }
                break;
            }
            case (interaction.isButton()): {
                const button = interaction.client.buttons[id];
                if (!button) {
                    Log.error(`[Bot] Button "${customId}" not exist.`);
                    return;
                }
                try {
                    await button(interaction, params);
                } catch (e) {
                    Log.error(`[Bot] Button ${customId} running ${e}`);
                    await inProblem(interaction, "處理按鈕");
                }
                break;
            }
            case (interaction.isStringSelectMenu()): {
                const menu = interaction.client.menus[id];
                if (!menu) {
                    Log.error(`[Bot] Menu "${customId}" not exist.`);
                    return;
                }
                try {
                    await menu(interaction, params);
                } catch (e) {
                    Log.error(`[Bot] Menu ${customId} running ${e}`);
                    await inProblem(interaction, "處理下拉選單");
                }
                break;
            }
            case (interaction.isModalSubmit()): {
                const modal = interaction.client.modals[id];
                if (!modal) {
                    Log.error(`[Bot] Modal "${customId}" not exist.`);
                    return;
                }
                try {
                    await modal(interaction, params);
                } catch (e) {
                    Log.error(`[Bot] Modal ${customId} submitting ${e}`);
                    await inProblem(interaction, "提交表單");
                }
                break;
            }
            default: {
                break;
            }
        }
    });
    client.once(Events.ClientReady, async () => {
        // register cmds
        try {
            if (client.application) {
                const commands = [];
                client.commands.forEach((cmd) => commands.push(cmd.data.toJSON()));
                Log.info(`[Bot] ${commands.length} Commands are registering...`);
                const guild = await client.guilds.fetch(client.config.id.guild);
                let data;
                if (guild) {
                    // console.debug(commandsAll);
                    data = await guild.commands.set(commands);
                } else {
                    throw new Error('Can not reach Guild.');
                    //data = await client.application.commands.set(commands);
                }
                Log.info(`[Bot] ${data.size} Commands registered successfully.`);
            } else { throw new Error("Can not reach application"); }
        } catch (e) {
            Log.error(`[Bot] Commands Registering ${e}`);
        }
    });
}
module.exports = register;
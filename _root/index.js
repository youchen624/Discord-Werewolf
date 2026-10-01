const Path = require('node:path');
process.rootPath = Path.dirname(
    process.pkg ? process.execPath : require.main.filename
);
const Log = require('./src/Logger');
const Bot = require('./src/Bot');
const Config = require('./src/Config');
const configPath = Path.join(process.rootPath, 'config.json');
const config = Config.load(configPath);
const bot = new Bot(config.data.Bot);
bot.begin();

const {
    GameBuilder,
    GameEvent
} = require('./src/Werewolf'); // the freaking error error (not a error, just erroring showing error)

const game = new GameBuilder(bot);
const player = game.start();
const a = [];
player.forEach(role => {
    a.push(role.constructor.name);
});
Log.info(a);
/*
for (let ii = 0; ii < 1; ii++) {
    let v3w4 = 0;
    let v4w3 = 0;
    for (let i = 0; i < 1; i++) {
        // const game = new GameBuilder(bot);
        // const player = game.start();
        const player = new GameBuilder(bot).start();
        let v = 0, w = 0;
        for (const role of player) {
            const name = role.constructor.name; // 僅存字串，避免引用整個物件
            if (name === 'Villager') v++;
            if (name === 'Werewolf') w++;
        }
        // player.forEach(role => {
        //     // a.push(role.constructor.name);
        //     if (role.constructor.name === 'Villager') v++;
        //     if (role.constructor.name === 'Werewolf') w++;
        // });
        // Log.info(a);
        if (v == 3 && w == 4) v3w4++;
        if (v == 4 && w == 3) v4w3++;
    }
    Log.info(`3V4W: ${v3w4}, 4V3W: ${v4w3}`);
}
*/
// Log.info(player);
/*
*/
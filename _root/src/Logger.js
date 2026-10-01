// V1.1
const Path = require('path');
const fs = require('fs');
const LOGGER_PATH = Path.join(process.rootPath, 'log');
const FontColor = {
    Reset: 0,
    Black: 30,
    Red: 31,
    Green: 32,
    Yellow: 33,
    Blue: 34,
    Purple: 35,
    Cyan: 36,
    White: 37,
    Gray: 90,
    Light: {
        Red: 91,
        Green: 92,
        Yellow: 93,
        Blue: 94,
        Purple: 95,
        Cyan: 96,
        White: 97,
    },
};
const FontBGColor = {
    Reset: 0,
    Black: 40,
    Red: 41,
    Green: 42,
    Yellow: 43,
    Blue: 44,
    Purple: 45,
    Cyan: 46,
    White: 47,
    Gray: 100,
    Light: {
        Red: 101,
        Green: 102,
        Yellow: 103,
        Blue: 104,
        Purple: 105,
        Cyan: 106,
        White: 107,
    },
};
function colorful(content, color = 0, bColor = color) {
    return `\x1b[${color}m\x1b[${bColor}m${content}\x1b[0m`;
}
function getTime() {
    const now = new Date();
    const date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    return { date, time };
}
class Logger {
    static #raw(content) {
        const time = getTime();
        const filePath = Path.join(LOGGER_PATH, `${time.date}.log`);
        try {
            const raw = content.replace(/\x1b\[[0-9;]*m/g, '');
            fs.mkdirSync(LOGGER_PATH, { recursive: true });
            fs.appendFileSync(filePath, `\n[${time.time}] ${raw}`);
            console.log(`[${time.time}] ${content}`);
        } catch(err) {
            const em = "[WARN] THIS ERROR WILL NOT LOG IN FILE.";
            console.error(`${em}\n${colorful('[Error]', FontColor.Red)} Logger ${err}\n${em}`);
        }
        /* // old version
        fs.mkdir(
            LOGGER_PATH,
            { recursive: true },
            (err) => {
                // then
                fs.appendFile(
                    Path.join(LOGGER_PATH, `${time.date}.log`),
                    `\n[${time.time}] ${content.replace(/\x1b\[[0-9;]*m/g, '')}`,
                    (err) => {
                        if (err) console.error(`${colorful('[Error]', FontColor.Red)} Logger ${err}`);
                    }
                );
                console.log(`[${time.time}] ${content}`);
            }
        );
        */
        return Logger;
    }
    static exitPreFunction() {}
    static exit(code = 1) {
        Logger.exitPreFunction();
        process.exit(code);
    }
    static kill(pid = 1) { process.kill(pid); }
    static custom(msg, title) {
        const t = colorful(`${title}`, FontColor.Light.Cyan);
        return Logger.#raw(`[${t}] ${msg}`);
    }
    static info(msg) {
        return Logger.#raw(`[Info] ${msg}`);
    }
    static debug(msg) {
        const debug = colorful('[Debug]', FontColor.Light.Purple);
        return Logger.#raw(`${debug} ${msg}`);
    }
    static warn(msg) {
        const warn = colorful('[Warn]', FontColor.Yellow);
        msg = colorful(msg, FontColor.Light.Yellow);
        return Logger.#raw(`${warn} ${msg}`);
    }
    static error(msg) {
        const error = colorful('[Error]', FontColor.Red);
        msg = colorful(msg, FontColor.Red);
        return Logger.#raw(`${error} ${msg}`);
    }
    static fatal(msg) {
        const fatal = colorful('\x1b[1m\x1b[6m[FATAL]', FontColor.White, FontBGColor.Light.Red);
        msg = colorful(`\x1b[6m${msg}`, FontColor.Reset, FontBGColor.Light.Red);
        return Logger.#raw(`${fatal} ${msg}`);
    }
    static c = Logger.custom;
    static i = Logger.info;
    static d = Logger.debug;
    static w = Logger.warn;
    static e = Logger.error;
    static f = Logger.fatal;
    static FATAL = Logger.fatal;
};

module.exports = Logger
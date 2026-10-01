// V2.0
const Path = require('path');
const fs = require('fs');
const Log = require('./Logger');
const DefaultConfigPath = Path.join(process.rootPath, 'config.json');

let path = DefaultConfigPath;
let cache = {};
function load(newPath) {
    /**
     * @name load
     * @ignore original cache data will be covered.
     * @returns cache :Object
     */
    if (newPath) path = newPath;
    try {
        fs.mkdirSync(Path.dirname(path), { recursive: true });
        const raw = fs.readFileSync(path, 'utf-8');
        cache = JSON.parse(raw);
        Log.info('[Config] Loaded Config.');
        return { data: cache };
    } catch (e) { Log.FATAL(`[Config] Reading "${path}" ${e}`).exit(1); }
}
function save() {
    /**
     * @name load
     * @ignore cover original config with cache data
     * @returns none
     */
    Log.info('[Config] Saving Config.');
    try {
        const raw = JSON.stringify(cache, null, 4);
        fs.writeFileSync(path, raw, 'utf-8');
    } catch (e) { Log.error(e); }
    Log.info('[Config] Saved Config.');
}
module.exports = {
    get data() {
        return cache;
    },
    load,
    save
};
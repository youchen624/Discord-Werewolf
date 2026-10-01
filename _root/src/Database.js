const Path = require('path');
const Log = require('./Logger');
const SQL = require('sqlite3');
const dbPath = Path.join(process.rootpath, 'data');

class DataBase {
    static cache = {};
    /*
    cache: {
        "name": {
            db: {}(db),
            opening: num()
        }
    }
    */
    db;
    constructor(fileName) {
        if(!fileName) throw new Error('Database: fileName is required');
        this.name = fileName;
        if(fileName in DataBase.cache) {
            db = DataBase.cache[fileName].db;
            DataBase.cache[fileName].opening++;
            return this;
        }
        const file = Path.join(dbPath, `${fileName}.db`);
        try {
            DataBase.cache[fileName].db = new SQL.Database(file);
            this.db = DataBase.cache[fileName].db;
            // // // #TODO // // #TODO // // #TODO // // #TODO
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                age INTEGER
            )`); // // // #TODO // // #TODO // // #TODO // // #TODO
            DataBase.cache[fileName].opening = 1;
            return this;
        } catch (e) { Log.error(e); }
    }
    #raw() {}
    get(key) {}
    set(key, value) {}
    del(key) {}
    close() {
        const openings = DataBase.cache[this.name].opening;
        openings--;
        this.db = null;
        if(openings) return;
        Log.info(`[DB] Database "${this.name}" is closing...`);
        DataBase.cache[this.name].db.close((e)=>{
            if(e) Log.error(`[DB] Database "${this.name}" closing: ${e}`);
            else Log.info(`[DB] "${this.name}" database closed.`)
        });
    }
    forceClose() {
        Log.info(`[DB] Database "${this.name}" is forcing closing...`);
        DataBase.cache[this.name].db.close((e)=>{
            if(e) Log.error(`[DB] Database "${this.name}" forcing closing: ${e}`);
            else Log.info(`[DB] Database "${this.name}" forced closing completed.`)
        });
    }
};

module.exports = DataBase;
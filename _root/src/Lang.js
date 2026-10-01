/*
l("test.abc.abaa.asf")
test.aa = aaaa
test.tt.bb = bbbb
{
    "test": {
        "aa": "aaaa",
        "tt": {
            "bb": "bbbb"
        }
    }
}
*/
class Lang {
    static cache = {};
    /*
    cache = {
        'en':{
            key : value,
        },
        'zh-tw':{
            key : value,
        },
    }
    */
    constructor() {};
    static async begin(lang, data) {
        this.cache[lang] = data;
    };
    static get(keyPath, lang = 'en') {
        return this.cache[lang]?.[keyPath] ?? keyPath;
    };
};
module.exports = function L(keyPath, lang) {
    return Lang.get(keyPath, lang);
};
module.exports.Lang = Lang;
module.exports.begin = Lang.begin;
module.exports.get = Lang.get;
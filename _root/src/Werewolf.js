const EventBuilder = require('events');
const Log = require('./Logger');
const GameEvent = {
    Game: {
        Start: "game.start",
        Stop: "game.stop",
    },
    Day: {
        Vote: {
            PK: {
                Begin: "day.vote.pk.begin"
            },
            Begin: "day.vote.begin"
        },
        Begin: "day.begin",
    },
    Night: {
        // Choice: {
        //     WolfsKilling: "night.choice.wolfsKilling",
        //     WitchUsePotion: "night.choice.witchUsePotion",
        //     SeerUseSkill: "night.choice.see.useSkill",
        // },
        Begin: "night.begin"
    },
    Player: {
        Dead: {
            Before: "player.dead.before",
            After: "player.dead.after"
        },
        Wolf: {
            Kill: (number) => `player.wolf.kill.${number}`,
            Killing: "player.wolf.killing",
            // Killings: "player.wolf.killings"
        },
        Seer: {
            Skill: "player.seer.skill"
        },
        Guard: {
            Skill: "player.guard.skill"
        },
        Witch: {
            Skill: {
                Save: "player.witch.potion.save",
                Poison: "player.witch.potion.poison"
            }
        },
    },
    Vote: {}
};
const DeadType = {
    Wolf: {
        Kill: "wolf.kill",
        Skill: "wolf.skill"
    },
    Gun: "gun",
    Vote: "vote",
    Poison: "poison",
    Unknown: "unknown",
};
const RoleCamp = {
    Villagers: "villagers",     // 🟩
    Wolfs: "wolfs",               // 🟥
    ThirdParty: "thirdParty" // 🟧
};
function arrayKnuthShuffle(array) {
    // using that -> https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
function timeReject(ms) {
    // after ms, returns a reject Promise.
    return new Promise((_, reject) => {
        setTimeout(reject, ms);
    });
};
function randomArray(array) {
    if (!Array.isArray(array)) return array;
    const index = Math.floor(Math.random() * array.length);
    return array[index];
};
const GameRoles = {         //🟩🟥🟧
    Villager: "Villager",          // 🟩平民
    Werewolf: "Werewolf",    // 🟥狼人
    Seer: "Seer",                  // 🟩預言家
    Witch: "Witch",               // 🟩女巫
    Hunter: "Hunter",           // 🟩獵人
    Guard: "guard",                // 🟩守衛
    Knight: "Knight",            // 🟩騎士
    Idiot: "Idiot",                  // 🟩白癡
    BearTamer: "Bear"       // 🟩馴熊人
};
const PlayerState = {

};
class Player extends EventBuilder {
    constructor(game, num) {
        super();
        this.game = game;
        this.number = num;
        this.isAlive = true;
        this.camp = undefined;
        this.deadType = undefined;
    };
    isRole(role) { return (this instanceof role); };
    isCamp(camp) { return (this.camp === camp); };
    vote(num) { };
    async onDead(deadType) { };
    async inNight(awaiting) { }; // until that 'awaiting' Promise solve
    // getThisString() { return ();};
    // deadBefore() { };
    // deadAfter() { };
};
class Villager extends Player { // 村民
    constructor(game, num) {
        super(game, num);
        this.camp = RoleCamp.Villagers;
        // game.on()
    };
};
class Werewolf extends Player { // 狼人
    constructor(game, num) {
        super(game, num);
        this.game = game;
        this.camp = RoleCamp.Wolfs;
        this.canKnife = true;
        // game.on()
        const debugFunc = (max = 10) => {
            // #TODO debug usage #TODO \
            const pool = [];
            for (let i = 0; i < max; i++) {
                pool.push(i);
            }
            // pool.push(undefined);
            const rndChoice = pool[Math.floor(Math.random() * pool.length)];
            Log.debug(`debugFunc: ${rndChoice}`);
            if (typeof rndChoice === 'number')
                this.voteKill(rndChoice);
        };
        this.game.on(GameEvent.Night.Begin, () => {
            // #TODO debug usage #TODO \
            setTimeout(() => {
                debugFunc();
                Log.debug(`rnd chosen`);
            }, (5000 + Math.random() * 1000));
            Log.debug(`rnd choosing`);
            // debugFunc();
        });
    };
    voteKill(num) { this.game.emit(GameEvent.Player.Wolf.Kill(this.number), num, undefined, this); };
    selfDestruct() { };
};
const Roles = {
    build: function (game, role) { return new this[role](game); },
    Villager,
    Werewolf,
    Seer: class extends Villager { // 預言家
        constructor(game, num) {
            super(game, num);
            // game.on()
            game.on(GameEvent.Night.Begin, () => { });
        };
        useSkill() { };
    },
    Witch: class extends Villager { // 女巫
        constructor(game, num) {
            super(game, num);
            // game.on()
            game.on(GameEvent.Player.Wolf.Killing, () => { });
        };
    },
    Hunter: class extends Villager { // 獵人
        constructor(game, num) {
            super(game, num);
            // game.on()
        };
    },
};
const DEFAULT_CONFIG = {
    name: 'Werewolf',
    // channels: {
    //     seat: [],
    //     main: '',
    //     voice: '',
    //     wolf: '', // only for night
    // },
    roles: ["Seer", "Witch", "Hunter"],
    playerCounts: 10,
    discuss: false,
    healSelf: true,
};
class GameBuilder extends EventBuilder {
    constructor(bot, config = DEFAULT_CONFIG) {
        /*
        _.config: {
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
            electingSheriff: false,
        },
        _.cache: {};
        */
        super();
        this.config = config;
        this._resolve = {};
        this.cache = {
            seats: [],
            players: [],
            sheriff: undefined,
            day: 0
        };
        this.bot = bot;
        // this.on('start', (data) => {
        //     // show players, roles, mode
        //     // random roles for players
        //     // default permissions
        // });
    };
    getPlayers(conditions = (player) => { return (player instanceof Player); }) {
        const players = this.cache.players.filter((player) => conditions(player));
        // Log.debug(`getPLayers returns:${players}`);
        return players;
    };
    getPlayer(conditions = (player) => { return (player instanceof Player); }) {
        const player = randomArray(this.getPlayers(conditions));
        // Log.debug(`getPLayer returns:${player}`);
        return player;
    };
    async waitChoice(event, ms = 20000, defaultChoice = undefined, response) {
        /**
         * @param {GameEvent} event
         * @param {Number} ms - timeout time
         * @param {Any} defaultChoice - resolve it when timeout
         * @param {function} response - event.emit(choice, callback(response(choice)))
         * @returns {Promise<Any>}
         */
        let listener;
        return Promise.race([
            new Promise((resolve, reject) => {
                listener = (choice, callback, that) => {
                    callback?.(response?.(choice, that));
                    resolve(choice);
                };
                this.once(event, listener);
            }),
            new Promise((resolve, reject) => setTimeout(() => {
                this.off(event, listener);
                resolve(defaultChoice);
            }, ms)),
        ]);
    };
    async waitChoices(events, ms = 20000, defaultChoice = undefined, response) {
        /**
         * @description please reference waitChoice()
         * @returns {Promise<[Any]>} - the choices by every events
         */
        const promises = events.map((event) => this.waitChoice(event, ms, defaultChoice, response));
        return Promise.all(promises);
    };
    start() {
        Log.info(`game starting...`);
        this.cache.day = 1;
        // random the roles
        const rawRoles = [];
        const usingRoles = [];
        this.config.roles.forEach((roleName) => {
            // get all using roles
            const role = Roles.build(this, roleName);
            rawRoles.push(role);
        });
        const roleNum = {
            // using floor, when the number is not divisible, remainder of role will be random
            [RoleCamp.Villagers]: Math.floor(this.config.playerCounts * 2 / 3),
            [RoleCamp.Wolfs]: Math.floor(this.config.playerCounts / 3),
            [RoleCamp.ThirdParty]: rawRoles.filter((v) => v.isCamp(RoleCamp.ThirdParty))?.length || 0,
        };
        const totalNum = roleNum[RoleCamp.Villagers] + roleNum[RoleCamp.Wolfs] + roleNum[RoleCamp.ThirdParty];
        const difNum = this.config.playerCounts - totalNum;
        if (difNum === 2) {
            roleNum[RoleCamp.Villagers]++;
            roleNum[RoleCamp.Wolfs]++;
        }
        if (difNum === 1) {
            if (Math.floor(Math.random() * 2))
                roleNum[RoleCamp.Villagers]++;
            else
                roleNum[RoleCamp.Wolfs]++;
        }
        if (difNum < 0) {
            // #TODO does ThirdParty all use?
            roleNum[RoleCamp.Villagers] += difNum;
        }
        // RoleCamp.ThirdParty All use
        /*
        const rolesPool = new Map([
            [RoleCamp.Villagers, []],
            [RoleCamp.Wolfs, []],
            [RoleCamp.ThirdParty, []],
        ]);
        */
        const rolesPool = {
            [RoleCamp.Villagers]: [],
            [RoleCamp.Wolfs]: [],
            [RoleCamp.ThirdParty]: [],
        }
        Object.values(RoleCamp).forEach((camp) => {
            rawRoles.forEach((role) => {
                if (role.isCamp(camp)) {
                    rolesPool[camp].push(role);
                }
            });
            if (rolesPool[camp].length > roleNum[camp]) {
                arrayKnuthShuffle(rolesPool[camp]);
                rolesPool[camp].splice(0, (rolesPool[camp].length - roleNum[camp])); // #TODO may bug
            }
            if (camp !== RoleCamp.ThirdParty) {
                while (rolesPool[camp].length < roleNum[camp]) {
                    const RoleClass = (camp === RoleCamp.Villagers) ? Roles.Villager : Roles.Werewolf;
                    rolesPool[camp].push(new RoleClass(this));
                }
            }
            usingRoles.push(...rolesPool[camp]);
        });
        arrayKnuthShuffle(usingRoles);
        this.cache.players = usingRoles.slice(0, this.config.playerCounts); // the roles
        this.cache.players.forEach((player, number) => { player.number = number; }); // give seat number
        // players begin or some else?? #TODO \
        this.cache.day = 1;
        this.emit(GameEvent.Game.Start, {});
        setTimeout(() => this.night(), 5000);
        return this.cache.players;
    };
    stop() {
        // remove all player's game.on by using game.off()
        this.removeAllListeners();
    };
    async night() {
        Log.info(`night, day ${this.cache.day}`);
        this.emit(GameEvent.Night.Begin, {});
        const nightDead = [];
        const wolfs = this.getPlayers((player) => player.isCamp(RoleCamp.Wolfs) && player.canKnife);
        const wolfsChoiceEvents = wolfs.map((wolf) => GameEvent.Player.Wolf.Kill(wolf.number));
        const wolfChoices = this.waitChoices(wolfsChoiceEvents, 20000, undefined, undefined);
        const wolfKillDecide = (raw) => {
            const temp = {};
            raw.forEach((v) => {
                if (!temp[v]) temp[v] = 1;
                else temp[v]++;
            });
            const entries = Object.entries(temp);
            if (!entries.length) return null;
            entries.sort(([, valueA], [, valueB]) => valueB - valueA); // >>>
            const dying = Number(entries[0][0]);
            this.emit(GameEvent.Player.Wolf.Killing, { dying });
            return dying;
        };

        const seerChoice = this.waitChoice(GameEvent.Player.Seer.Skill, 30000, undefined, (choice) => {
            // response isWolf?
            if (!choice) return undefined;
            return this.cache.players[choice].isCamp(RoleCamp.Wolfs);
        });
        const wGuardChoice = this.waitChoice(GameEvent.Player.Guard.Skill, 20000, undefined, undefined);
        const wolfsKilling = wolfKillDecide(await wolfChoices);
        Log.debug(`wolfsKilling:${wolfsKilling}`); // DEBUG
        const witchChoice = await this.waitChoice(GameEvent.Player.Witch.Skill.Save, 15000, { save: false, poison: undefined }, undefined);
        const guardChoice = await wGuardChoice;
        if ((typeof wolfsKilling === 'number') && !(witchChoice.save ^ (guardChoice == wolfsKilling))) {
            // werewolf kill
            const dying = this.cache.players[wolfsKilling];
            dying.isAlive = false;
            dying.deadType = DeadType.Wolf.Kill;
            Log.d(`dying by wolf (test):${dying}(${dying.number})`);
            nightDead.push(dying);
            // this.emit(GameEvent.Player.Dead.Before, {
            //     player: dying,
            // });
        }
        if (witchChoice.poison) { //kill by witch poison
            const dying = this.cache.players[witchChoice.poison];
            dying.isAlive = false;
            dying.deadType = DeadType.Poison;
            nightDead.push(dying);
            // this.emit(GameEvent.Player.Dead.Before, {
            //     player: this.cache.players[wolfKilling],
            // });
        }
        await seerChoice;
        setTimeout(() => {
            Log.debug(nightDead);
            this.day(nightDead);
        }, 5000);
    };
    async day(death) {
        Log.info(`day`);
        const deathNumber = death.map((v, i) => v.number);
        Log.debug(`deaths: ${deathNumber.join(',')}`);
        this.emit(GameEvent.Day.Begin, { death });

        this.cache.day++;
        setTimeout(() => this.night(), 5000);
    };
};

module.exports = {
    GameBuilder,
    GameEvent,
    GameRoles,
};
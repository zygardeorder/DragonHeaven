/*

Ratings and how they work:

-2: Extremely detrimental
	  The sort of ability that relegates Pokemon with Uber-level BSTs into NU.
	ex. Slow Start, Truant

-1: Detrimental
	  An ability that does more harm than good.
	ex. Defeatist, Normalize

 0: Useless
	  An ability with no net effect during a singles battle.
	ex. Healer, Illuminate

 1: Ineffective
	  An ability that has a minimal effect. Should not be chosen over any other ability.
	ex. Damp, Shell Armor

 2: Situationally useful
	  An ability that can be useful in certain situations.
	ex. Blaze, Insomnia

 3: Useful
	  An ability that is generally useful.
	ex. Infiltrator, Sturdy

 4: Very useful
	  One of the most popular abilities. The difference between 3 and 4 can be ambiguous.
	ex. Protean, Regenerator

 5: Essential
	  The sort of ability that defines metagames.
	ex. Desolate Land, Shadow Tag

*/

'use strict';

exports.BattleAbilities = {
	innovate: {
		id: 'innovate',
		name: 'Innovate',
		onStart: function(pokemon) {
			if(pokemon.calculateStat("spa",pokemon.boosts.spa) > pokemon.calculateStat("atk",pokemon.boosts.atk)) {
				this.add('-activate', pokemon, 'ability: Innovate');
				this.add('-formechange', pokemon, 'Infineer-spc', '[msg]');
				pokemon.formeChange('Infineer-spc');
				pokemon.forme = "Special";
				this.add('-start', pokemon, "Special", '[silent]');
				return;
			}
			pokemon.forme = "Physical";
		},
		onModifyMove: function(move, pokemon) {
			if(move.category === "Status") return;
			move.category = pokemon.forme || "Physical";
		},
		onBoost: function(boost, pokemon) {
			if(pokemon.calculateStat("spa",pokemon.boosts.spa+(boost.spa||0)) > pokemon.calculateStat("atk",pokemon.boosts.atk+(boost.atk||0))) {
				this.add('-activate', pokemon, 'ability: Innovate');
				this.add('-formechange', pokemon, 'Infineer-spc', '[msg]');
				pokemon.formeChange('Infineer-spc');
				pokemon.forme = "Special";
				this.add('-start', pokemon, "Special", '[silent]');
				return;
			}
			if(pokemon.calculateStat("spa",pokemon.boosts.spa+(boost.spa||0)) < pokemon.calculateStat("atk",pokemon.boosts.atk+(boost.atk||0))) {
				this.add('-activate', pokemon, 'ability: Innovate');
				this.add('-formechange', pokemon, 'Infineer', '[msg]');
				pokemon.formeChange('Infineer');
				pokemon.forme = "Physical";
				this.add('-start', pokemon, "Physical", '[silent]');
				return;
			}
		}
	},
	"infernalscales": {
		desc: "This Pokemon's Fire-type attacks have their power doubled, the power of Ice-type attacks against this Pokemon is halved, and this Pokemon cannot be frozen. Gaining this Ability while frozen cures it.",
		shortDesc: "This Pokemon's Water power is 2x; it can't be burned; Fire power against it is halved.",
		onBasePowerPriority: 7,
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Ice') {
				return this.chainModify(0.5);
			}
		},
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(2);
			}
		},
		onUpdate: function (pokemon) {
			if (pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'ability: Water Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'frz') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Water Bubble');
			return false;
		},
		id: "infernalscales",
		name: "Infernal Scales",
		rating: 4,
		num: 10001,
	},
	"antigravity": {
		desc: "This Pokemon disables Ground-type attacks from being used.",
		shortDesc: "This Pokemon disables Ground-type attacks from being used.",
		onTryMove: function (target, source, effect) {
			if (effect.type === 'Ground') {
				this.debug('Anti-Gravity Ground supress');
				this.add('-fail', source, effect, '[from] Anti-Gravity');
				return null;
			}
		},
		id: "antigravity",
		name: "Anti-Gravity",
		rating: 4,
		num: 10002,
	},
	"extremeentry": {
		shortDesc: "If this Pokemon switches in for the first time, its moves have their priority increased by 1.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (pokemon.entered) return priority;
			pokemon.entered = true;
			return priority + 1;
		},
		id: "extremeentry",
		name: "Extreme Entry",
		rating: 3,
		num: 177,
	},
	"magicalemanation": {
		shortDesc: "On switch-in, this Pokemon summons Magic Room.",
		onStart: function (source, effect) {
			this.addPseudoWeather('magicroom', source, effect, '[of] ' + source);
		},
		id: "magicalemanation",
		name: "Magical Emanation",
		rating: 4.5,
		num: 11002,
	},
	"trickyemanation": {
		shortDesc: "On switch-in, this Pokemon summons Trick Room.",
		onStart: function (source, effect) {
			this.addPseudoWeather('trickroom', source, effect, '[of] ' + source);
		},
		id: "trickyemanation",
		name: "Tricky Emanation",
		rating: 4.5,
		num: 11003,
	},
	"wondrousemanation": {
		shortDesc: "On switch-in, this Pokemon summons Wonder Room.",
		onStart: function (source, effect) {
			this.addPseudoWeather('wonderroom', source, effect, '[of] ' + source);
		},
		id: "wondrousemanation",
		name: "Wondrous Emanation",
		rating: 4.5,
		num: 11004,
	},
};

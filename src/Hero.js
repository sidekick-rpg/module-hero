import lodash from 'lodash'
import Roll from 'roll'
import Rules from './Rules.js'

class Hero {
	constructor(rules) {
		this.rules = rules ? rules : new Rules(new Roll())
	}

	static getDetails() {
		console.log({'foo': 'bar'})
	}

	attack(config) {
		const defaultConfig = {
			attacker: {
				ocv: null,
				damage: {
					dice: null,
					modifier: null,
					killing: true,
				},
				advantages: {
					autofire: 0,
					/*armourPiercing: 0,
					penetrating: 0,*/
				},
			},
			defender: {
				dcv: null,
				def: null,
				rDef: null,
				advantages: {
					/*hardened: 0,
					impenetrable: 0,*/
				},
				knockbackResistance: 0,
			},
			locations: true,
			knockback: true,
			kbModifiers: {
				martialManeuver: false,
				air: false,
				rolled: false,
				underwater: false,
				clinging: false,
				zeroGrav: false,
			},
		}

		config = lodash.merge({}, defaultConfig, config)

		const hit = this.rules.hit(
			config.attacker.ocv,
			config.defender.dcv,
			config.attacker.advantages.autofire
		)

		let locations = null

		if (config.locations === true) {
			locations = []
			for (let i = 0; i < hit.hits; i++) {
				locations.push(this.rules.hitLocation())
			}
		}

		let damage = null

		if (config.attacker.damage.dice !== null) {
			damage = []
			for (let i = 0; i < hit.hits; i++) {
				damage.push(this.rules.damage(
					config.attacker.damage.dice,
					config.attacker.damage.modifier,
					config.attacker.damage.killing,
					config.defender.def,
					config.defender.rDef,
					locations[i].location,
				))
			}
		}

		let knockback = null

		if (config.knockback === true && config.attacker.damage.dice !== null) {
			knockback = []
			for (let i = 0; i < hit.hits; i++) {
				knockback.push(this.rules.knockback(
					damage[i].taken.body,
					config.attacker.killing,
					config.defender.knockbackResistance,
					config.kbModifiers.martialManeuver,
					config.kbModifiers.air,
					config.kbModifiers.rolled,
					config.kbModifiers.underwater,
					config.kbModifiers.clinging,
					config.kbModifiers.zeroGrav,
				))
			}
		}

		return {
			hit,
			locations,
			damage,
			knockback,
		}
	}
}

export default Hero

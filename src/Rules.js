import Constants from './Constants.js'
import Locations from './Locations.js'

function numHits(rollResult, targetDcv, hitDcv, autofire) {
	// 18 always misses
	if (rollResult === 18) {
		return 0
	}

	if (autofire > 0) {
		const delta = Math.floor(hitDcv - targetDcv)
		let hits

		// No Hits (eg. target was 3, got a 2)
		if (delta < 0) {
			hits = 0
		} else if (delta === 0) {
			hits = 1
		} else {
			hits = Math.min(1 + Math.floor(delta / 2), autofire)
		}

		// On a 3, we hit a minimum of 1 times
		return rollResult === 3 && hits === 0 ? 1 : hits
	} else {
		// Nasty nested ternaries, basically:
		// 1. Check against the hit vs target and see if we hit
		// 2. If we did, great, 1 hit
		// 3. If we didn't, check if they rolled a 3, which is still 1 hit
		// 4. Otherwise 0 hits
		return (hitDcv >= targetDcv) ? 1 : (rollResult === 3 ? 1: 0)
	}
}

function determineDamage(roller, numDice, modifier, killing, location = null) {
	let mod = ''
	let halfRoll

	if (killing === true) {
		switch (modifier) {
			case Constants.DMG_MOD_HALF:
				halfRoll = roller.roll('1d6')
				break
			case Constants.DMG_MOD_PLUS:
				mod = '+1'
				break
			case Constants.DMG_MOD_MINUS:
				mod = '-1'
				break
			default:
				mod = ''
				break
		}
	} else {
		switch (modifier) {
			case Constants.DMG_MOD_HALF:
				halfRoll = roller.roll('1d6')
				break
			case undefined:
			case null:
				halfRoll = null
				break
			default:
				throw new Error('Normal damage cannot use +1 or -1 for damage classes')
		}
	}

	const rolls = {}
	const dmgRoll = roller.roll(numDice + 'd6' + mod)
	rolls['damage'] = dmgRoll

	if (halfRoll) {
		rolls['half'] = halfRoll
	}

	if (killing === true) {
		const totalBody = halfRoll ? dmgRoll.result + Math.ceil(halfRoll.result / 2) : dmgRoll.result
		let stunXRoll
		if (!location) {
			stunXRoll = roller.roll('1d3')
			rolls['stunX'] = stunXRoll
		}
		const stunX = location ? location.stunX : stunXRoll.result
		return {
			body: totalBody,
			stun: totalBody * stunX,
			rolls: rolls,
		}
	} else {
		const totalStun = halfRoll ? dmgRoll.result + Math.ceil(halfRoll.result / 2) : dmgRoll.result
		return {
			body: countBody(dmgRoll, halfRoll),
			stun: totalStun,
			rolls: rolls,
		}
	}
}

function determineDamageAfterDefences(dmg, killing, def, rDef) {
	const afterDefences = {
		body: 0,
		stun: 0,
	}

	if (killing === true) {
		afterDefences.body = Math.max(0, dmg.body - rDef)
		afterDefences.stun = Math.max(0, dmg.stun - (def + rDef))
	} else {
		afterDefences.body = Math.max(0, dmg.body - (def + rDef))
		afterDefences.stun = Math.max(0, dmg.stun - (def + rDef))
	}

	return afterDefences
}

function determineDamageAfterLocation(dmg, killing, location) {
	const afterLocation = {
		body: 0,
		stun: 0,
	}

	if (killing === true) {
		afterLocation.body = dmg.afterDefences.body * location.bodyX
		afterLocation.stun = dmg.afterDefences.stun
	} else {
		afterLocation.body = dmg.afterDefences.body * location.bodyX
		afterLocation.stun = (dmg.afterDefences.stun * location.nstun)
	}

	return afterLocation
}

function determineDamageTaken(dmg) {
	const taken = {
		body: 0,
		stun: 0,
	}

	// Calculate final damage taken
	if (dmg.afterLocation) {
		taken.body = dmg.afterLocation.body
		taken.stun = dmg.afterLocation.body + dmg.afterLocation.stun
	} else {
		taken.body = dmg.afterDefences.body
		taken.stun = dmg.afterDefences.body + dmg.afterDefences.stun
	}

	return taken
}

function countBody(dmgRoll, halfRoll) {
	let body = 0

	dmgRoll.rolled.forEach(next => {
		switch (next) {
			case 1:
				body += 0
				break
			case 6:
				body += 2
				break
			default:
				body += 1
				break
		}
	})

	// Counting Normal BODY increases BODY by 1 if the result is 4, 5, or 6
	if (halfRoll && halfRoll.result >= 4) {
		body += 1
	}

	return body
}

class Rules {
	constructor(roller) {
		this.roller = roller
	}

	hit(ocv = 0, targetDcv = 0, autofire = 0) {
		const roll = this.roller.roll('3d6')
		const hitDcv = 11 + ocv - roll.result

		return {
			dcv: hitDcv,
			target: targetDcv,
			hits: numHits(roll.result, targetDcv, hitDcv, autofire),
			rolled: roll,
		}
	}

	hitLocation() {
		const rolls = {}
		const locRoll = this.roller.roll('3d6')
		rolls.location = locRoll
		const loc = Locations.Indexed[locRoll.result]
		let side = null

		if (loc.side === true) {
			const sideRoll = this.roller.roll('1d2')
			rolls.side = sideRoll
			if (sideRoll.result === 1) {
				side = 'left'
			} else {
				side = 'right'
			}
		}

		return {
			location: loc,
			side: side,
			rolls: rolls,
		}
	}

	damage(
		numDice,
		modifier = null,
		killing = true,
		def = 0,
		rDef = 0,
		location = null
	) {
		let dmg = determineDamage(this.roller, numDice, modifier, killing, location)

		dmg.afterDefences = determineDamageAfterDefences(dmg, killing, def, rDef)

		if (location !== null) {
			dmg.afterLocation = determineDamageAfterLocation(dmg, killing, location)
		}

		dmg.taken = determineDamageTaken(dmg)

		return dmg
	}

	knockback(
		body,
		killing = false,
		knockbackResistance = 0,
		martialManeuver = false,
		air = false,
		rolled = false,
		underwater = false,
		clinging = false,
		zeroGrav = false) {
		// Base dice roll for knockback is 2d6
		let dice = 2

		if (air === true) {
			dice -= 1
		}

		if (rolled === true) {
			dice -= 1
		}

		if (underwater === true) {
			dice += 1
		}

		if (killing === true) {
			dice += 1
		}

		if (martialManeuver === true) {
			dice += 1
		}

		if (clinging === true) {
			dice += 1
		}

		if (zeroGrav === true) {
			dice -= 1
		}

		dice = Math.max(0, dice)

		const knockbackRoll = this.roller.roll(dice + 'd6')
		const total = body - knockbackRoll.result
		const distance = (total > 0) ? (total * 2) - knockbackResistance : 0

		return {
			down: (distance >= 0),
			distance: Math.max(0, distance),
		}
	}
}

export default Rules

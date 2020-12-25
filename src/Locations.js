const HEAD = {
	name: 'Head',
	stunX: 5,
	nstun: 2,
	bodyX: 2,
	toHit: -8,
	side: false,
}

const HANDS = {
	name: 'Hands',
	stunX: 1,
	nstun: 0.5,
	bodyX: 0.5,
	toHit: -6,
	side: true,
}

const ARMS = {
	name: 'Arms',
	stunX: 2,
	nstun: 0.5,
	bodyX: 0.5,
	toHit: -5,
	side: true,
}

const SHOULDERS = {
	name: 'Shoulders',
	stunX: 3,
	nstun: 1,
	bodyX: 1,
	toHit: -5,
	side: true,
}

const CHEST = {
	name: 'Chest',
	stunX: 3,
	nstun: 1,
	bodyX: 1,
	toHit: -3,
	side: false,
}

const STOMACH = {
	name: 'Stomach',
	stunX: 4,
	nstun: 1.5,
	bodyX: 1,
	toHit: -7,
	side: false,
}

const VITALS = {
	name: 'Vitals',
	stunX: 4,
	nstun: 1.5,
	bodyX: 2,
	toHit: -7,
	side: false,
}

const THIGHS = {
	name: 'Thighs',
	stunX: 2,
	nstun: 1,
	bodyX: 1,
	toHit: -4,
	side: true,
}

const LEGS = {
	name: 'Legs',
	stunX: 2,
	nstun: 0.5,
	bodyX: 0.5,
	toHit: -6,
	side: true,
}

const FEET = {
	name: 'Feet',
	stunX: 1,
	nstun: 0.5,
	bodyX: 0.5,
	toHit: -8,
	side: true,
}

const Indexed = {
	3: HEAD,
	4: HEAD,
	5: HEAD,
	6: HANDS,
	7: HANDS,
	8: ARMS,
	9: SHOULDERS,
	10: CHEST,
	11: CHEST,
	12: STOMACH,
	13: VITALS,
	14: THIGHS,
	15: LEGS,
	16: LEGS,
	17: FEET,
	18: FEET,
}

export default {
	Indexed,
	HEAD,
	HANDS,
	ARMS,
	SHOULDERS,
	CHEST,
	STOMACH,
	VITALS,
	THIGHS,
	LEGS,
	FEET,
}

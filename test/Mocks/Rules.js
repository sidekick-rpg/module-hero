function nextTarget(index, targets, expects, args) {
	const next = targets[index].shift()

	if (expects && expects.length && expects[index] && expects[index].length) {
		const nextExpect = expects[index].shift()

		if (nextExpect !== args) {
			throw new Error(`Rules expected '${index}':'${nextExpect}' but received '${args}'`)
		}
	}

	return next
}

class Rules {
	constructor(targets) {
		this.targets = targets
	}

	hit() {
		return nextTarget('hit', this.targets, this.expects, arguments)
	}

	hitLocation() {
		return nextTarget('hitLocation', this.targets, this.expects, arguments)
	}

	damage() {
		return nextTarget('damage', this.targets, this.expects, arguments)
	}

	knockback() {
		return nextTarget('knockback', this.targets, this.expects, arguments)
	}

	expect(targets) {
		this.expects = targets

		return this
	}
}

export default Rules

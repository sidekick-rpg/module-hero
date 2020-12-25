function formatResult(result) {
	if (Array.isArray(result)) {
		return {
			rolled: result,
			result: result.reduce((total, next) => total + next),
		}
	} else {
		return {
			result: result,
		}
	}
}

class Roller {
	constructor(...targets) {
		this.targets = targets
	}

	roll() {
		const next = this.targets.shift()

		if (this.expects && this.expects.length) {
			const nextExpect = this.expects.shift()

			if (nextExpect !== arguments[0]) {
				throw new Error(`Roller expected '${nextExpect}' but received '${arguments[0]}'`)
			}
		}

		return formatResult(next)
	}

	static mockResult(result) {
		return formatResult(result)
	}

	expect(...targets) {
		this.expects = targets

		return this
	}
}

export default Roller

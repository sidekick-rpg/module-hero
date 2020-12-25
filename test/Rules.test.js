import Constants from '../src/Constants.js'
import Locations from '../src/Locations.js'
import MockRoller from './Mocks/Roller.js'
import Rules from '../src/Rules.js'
import { RunProvider } from './RunProvider.js'

describe('Rules', () => {
	describe('hit', () => {
		function runner(expected, data, roller) {
			const rules = new Rules(roller)
			const actual = rules.hit(data.ocv, data.targetDcv, data.autofire)

			expect(actual).toStrictEqual(expected)
		}

		describe('basic hits', () => {
			const dataProvider = {
				'11 is a hit with equal ocv/dcv': [
					{
						dcv: 3,
						target: 3,
						hits: 1,
						rolled: {
							result: 11,
						},
					},
					{
						ocv: 3,
						targetDcv: 3,
						autofire: 0,
					},
					new MockRoller(11),
				],
				'3 always hits': [
					{
						dcv: 8,
						target: 40,
						hits: 1,
						rolled: {
							result: 3,
						},
					},
					{
						ocv: 0,
						targetDcv: 40,
						autofire: 0,
					},
					new MockRoller(3),
				],
				'18 always misses': [
					{
						dcv: 33,
						target: 0,
						hits: 0,
						rolled: {
							result: 18,
						},
					},
					{
						ocv: 40,
						targetDcv: 0,
						autofire: 0,
					},
					new MockRoller(18),
				],
			}

			RunProvider(dataProvider, runner)
		})

		describe('autofire', () => {
			const dataProvider = {
				'11 is a hit with equal ocv/dcv': [
					{
						dcv: 3,
						target: 3,
						hits: 1,
						rolled: {
							result: 11,
						},
					},
					{
						ocv: 3,
						targetDcv: 3,
						autofire: 2,
					},
					new MockRoller(11),
				],
				'3 always hits': [
					{
						dcv: 8,
						target: 40,
						hits: 1,
						rolled: {
							result: 3,
						},
					},
					{
						ocv: 0,
						targetDcv: 40,
						autofire: 2,
					},
					new MockRoller(3),
				],
				'18 always misses': [
					{
						dcv: 33,
						target: 0,
						hits: 0,
						rolled: {
							result: 18,
						},
					},
					{
						ocv: 40,
						targetDcv: 0,
						autofire: 2,
					},
					new MockRoller(18),
				],
				'miss target means 0 hits': [
					{
						dcv: -3,
						target: 3,
						hits: 0,
						rolled: {
							result: 17,
						},
					},
					{
						ocv: 3,
						targetDcv: 3,
						autofire: 2,
					},
					new MockRoller(17),
				],
				'up by 2 on target means 2 hits': [
					{
						dcv: 5,
						target: 3,
						hits: 2,
						rolled: {
							result: 9,
						},
					},
					{
						ocv: 3,
						targetDcv: 3,
						autofire: 2,
					},
					new MockRoller(9),
				],
				'up by 4 on target with autofire 2 still means 2 hits': [
					{
						dcv: 7,
						target: 3,
						hits: 2,
						rolled: {
							result: 7,
						},
					},
					{
						ocv: 3,
						targetDcv: 3,
						autofire: 2,
					},
					new MockRoller(7),
				],
				'up by 3 on target means 2 hits (need to be up by full increment of 2)': [
					{
						dcv: 6,
						target: 3,
						hits: 2,
						rolled: {
							result: 8,
						},
					},
					{
						ocv: 3,
						targetDcv: 3,
						autofire: 2,
					},
					new MockRoller(8),
				],
				'lots of autofire': [
					{
						dcv: 20,
						target: 3,
						hits: 9,
						rolled: {
							result: 11,
						},
					},
					{
						ocv: 20,
						targetDcv: 3,
						autofire: 10,
					},
					new MockRoller(11),
				],
			}

			RunProvider(dataProvider, runner)
		})
	})

	describe('hit location', () => {
		function runner(expected, roller) {
			const rules = new Rules(roller)
			const actual = rules.hitLocation()

			expect(actual).toStrictEqual(expected)
		}

		const dataProvider = {
			'3 is Head': [
				{
					location: Locations.Indexed[3],
					side: null,
					rolls: {
						location: MockRoller.mockResult([1, 1, 1])
					},
				},
				new MockRoller([1, 1, 1]),
			],
			'4 is Head': [
				{
					location: Locations.Indexed[4],
					side: null,
					rolls: {
						location: MockRoller.mockResult([1, 1, 2]),
					}
				},
				new MockRoller([1, 1, 2]),
			],
			'5 is Head': [
				{
					location: Locations.Indexed[5],
					side: null,
					rolls: {
						location: MockRoller.mockResult([1, 2, 2]),
					}
				},
				new MockRoller([1, 2, 2]),
			],
			'6 is Hands (left)': [
				{
					location: Locations.Indexed[6],
					side: 'left',
					rolls: {
						location: MockRoller.mockResult([2, 2, 2]),
						side: MockRoller.mockResult(1),
					}
				},
				new MockRoller([2, 2, 2], 1),
			],
			'6 is Hands (right)': [
				{
					location: Locations.Indexed[6],
					side: 'right',
					rolls: {
						location: MockRoller.mockResult([2, 2, 2]),
						side: MockRoller.mockResult(2),
					}
				},
				new MockRoller([2, 2, 2], 2),
			],
			'7 is Hands (left)': [
				{
					location: Locations.Indexed[7],
					side: 'left',
					rolls: {
						location: MockRoller.mockResult([3, 2, 2]),
						side: MockRoller.mockResult(1),
					}
				},
				new MockRoller([3, 2, 2], 1),
			],
			'7 is Hands (right)': [
				{
					location: Locations.Indexed[7],
					side: 'right',
					rolls: {
						location: MockRoller.mockResult([3, 2, 2]),
						side: MockRoller.mockResult(2),
					}
				},
				new MockRoller([3, 2, 2], 2),
			],
			'8 is Arms (left)': [
				{
					location: Locations.Indexed[8],
					side: 'left',
					rolls: {
						location: MockRoller.mockResult([3, 3, 2]),
						side: MockRoller.mockResult(1),
					}
				},
				new MockRoller([3, 3, 2], 1),
			],
			'8 is Arms (right)': [
				{
					location: Locations.Indexed[8],
					side: 'right',
					rolls: {
						location: MockRoller.mockResult([3, 3, 2]),
						side: MockRoller.mockResult(2),
					}
				},
				new MockRoller([3, 3, 2], 2),
			],
			'9 is Shoulders (left)': [
				{
					location: Locations.Indexed[9],
					side: 'left',
					rolls: {
						location: MockRoller.mockResult([3, 3, 3]),
						side: MockRoller.mockResult(1),
					}
				},
				new MockRoller([3, 3, 3], 1),
			],
			'9 is Shoulders (right)': [
				{
					location: Locations.Indexed[9],
					side: 'right',
					rolls: {
						location: MockRoller.mockResult([3, 3, 3]),
						side: MockRoller.mockResult(2),
					}
				},
				new MockRoller([3, 3, 3], 2),
			],
			'10 is Chest': [
				{
					location: Locations.Indexed[10],
					side: null,
					rolls: {
						location: MockRoller.mockResult([4, 3, 3]),
					}
				},
				new MockRoller([4, 3, 3]),
			],
			'11 is Chest': [
				{
					location: Locations.Indexed[11],
					side: null,
					rolls: {
						location: MockRoller.mockResult([4, 4, 3]),
					}
				},
				new MockRoller([4, 4, 3]),
			],
			'12 is Stomach': [
				{
					location: Locations.Indexed[12],
					side: null,
					rolls: {
						location: MockRoller.mockResult([4, 4, 4]),
					}
				},
				new MockRoller([4, 4, 4]),
			],
			'13 is Vitals': [
				{
					location: Locations.Indexed[13],
					side: null,
					rolls: {
						location: MockRoller.mockResult([5, 4, 4]),
					}
				},
				new MockRoller([5, 4, 4]),
			],
			'14 is Thighs (left)': [
				{
					location: Locations.Indexed[14],
					side: 'left',
					rolls: {
						location: MockRoller.mockResult([5, 5, 4]),
						side: MockRoller.mockResult(1),
					}
				},
				new MockRoller([5, 5, 4], 1),
			],
			'14 is Thighs (right)': [
				{
					location: Locations.Indexed[14],
					side: 'right',
					rolls: {
						location: MockRoller.mockResult([5, 5, 4]),
						side: MockRoller.mockResult(2),
					}
				},
				new MockRoller([5, 5, 4], 2),
			],
			'15 is Legs (left)': [
				{
					location: Locations.Indexed[15],
					side: 'left',
					rolls: {
						location: MockRoller.mockResult([5, 5, 5]),
						side: MockRoller.mockResult(1),
					}
				},
				new MockRoller([5, 5, 5], 1),
			],
			'15 is Legs (right)': [
				{
					location: Locations.Indexed[15],
					side: 'right',
					rolls: {
						location: MockRoller.mockResult([5, 5, 5]),
						side: MockRoller.mockResult(2),
					}
				},
				new MockRoller([5, 5, 5], 2),
			],
			'16 is Legs (left)': [
				{
					location: Locations.Indexed[16],
					side: 'left',
					rolls: {
						location: MockRoller.mockResult([6, 5, 5]),
						side: MockRoller.mockResult(1),
					}
				},
				new MockRoller([6, 5, 5], 1),
			],
			'16 is Legs (right)': [
				{
					location: Locations.Indexed[16],
					side: 'right',
					rolls: {
						location: MockRoller.mockResult([6, 5, 5]),
						side: MockRoller.mockResult(2),
					}
				},
				new MockRoller([6, 5, 5], 2),
			],
			'17 is Feet (left)': [
				{
					location: Locations.Indexed[17],
					side: 'left',
					rolls: {
						location: MockRoller.mockResult([6, 6, 5]),
						side: MockRoller.mockResult(1),
					}
				},
				new MockRoller([6, 6, 5], 1),
			],
			'17 is Feet (right)': [
				{
					location: Locations.Indexed[17],
					side: 'right',
					rolls: {
						location: MockRoller.mockResult([6, 6, 5]),
						side: MockRoller.mockResult(2),
					}
				},
				new MockRoller([6, 6, 5], 2),
			],
			'18 is Feet (left)': [
				{
					location: Locations.Indexed[18],
					side: 'left',
					rolls: {
						location: MockRoller.mockResult([6, 6, 6]),
						side: MockRoller.mockResult(1),
					}
				},
				new MockRoller([6, 6, 6], 1),
			],
			'18 is Feet (right)': [
				{
					location: Locations.Indexed[18],
					side: 'right',
					rolls: {
						location: MockRoller.mockResult([6, 6, 6]),
						side: MockRoller.mockResult(2),
					}
				},
				new MockRoller([6, 6, 6], 2),
			],
		}

		RunProvider(dataProvider, runner)
	})

	describe('damage', () => {
		function runner(expected, data, roller) {
			const rules = new Rules(roller)
			const actual = rules.damage(
				data.numDice,
				data.modifier,
				data.killing,
				data.def,
				data.rDef,
				data.location
			)

			expect(actual).toStrictEqual(expected)
		}

		describe('killing', () => {
			describe('no hit locations', () => {
				const dataProvider = {
					'basic 2d6 no defences': [
						{
							body: 7,
							stun: 14,
							afterDefences: {
								body: 7,
								stun: 14,
							},
							taken: {
								body: 7,
								stun: 21,
							},
							rolls: {
								damage: MockRoller.mockResult(7),
								stunX: MockRoller.mockResult(2),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: true,
							def: 0,
							rDef: 0,
							location: null,
						},
						new MockRoller(7, 2),
					],
					'basic 2d6 minimal defences': [
						{
							body: 7,
							stun: 14,
							afterDefences: {
								body: 4,
								stun: 6,
							},
							taken: {
								body: 4,
								stun: 10,
							},
							rolls: {
								damage: MockRoller.mockResult(7),
								stunX: MockRoller.mockResult(2),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: true,
							def: 5,
							rDef: 3,
							location: null,
						},
						new MockRoller(7, 2),
					],
					'basic 2d6 max defences': [
						{
							body: 7,
							stun: 14,
							afterDefences: {
								body: 0,
								stun: 0,
							},
							taken: {
								body: 0,
								stun: 0,
							},
							rolls: {
								damage: MockRoller.mockResult(7),
								stunX: MockRoller.mockResult(2),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: true,
							def: 10,
							rDef: 10,
							location: null,
						},
						new MockRoller(7, 2),
					],
					'2d6 half no defences': [
						{
							body: 9,
							stun: 18,
							afterDefences: {
								body: 9,
								stun: 18,
							},
							taken: {
								body: 9,
								stun: 27,
							},
							rolls: {
								damage: MockRoller.mockResult(7),
								half: MockRoller.mockResult(4),
								stunX: MockRoller.mockResult(2),
							}
						},
						{
							numDice: 2,
							modifier: Constants.DMG_MOD_HALF,
							killing: true,
							def: 0,
							rDef: 0,
							location: null,
						},
						new MockRoller(4, 7, 2),
					],
					'2d6+1 no defences': [
						{
							body: 8,
							stun: 16,
							afterDefences: {
								body: 8,
								stun: 16,
							},
							taken: {
								body: 8,
								stun: 24,
							},
							rolls: {
								damage: MockRoller.mockResult(8),
								stunX: MockRoller.mockResult(2),
							}
						},
						{
							numDice: 2,
							modifier: Constants.DMG_MOD_PLUS,
							killing: true,
							def: 0,
							rDef: 0,
							location: null,
						},
						new MockRoller(8, 2),
					],
					'2d6-1 no defences': [
						{
							body: 6,
							stun: 12,
							afterDefences: {
								body: 6,
								stun: 12,
							},
							taken: {
								body: 6,
								stun: 18,
							},
							rolls: {
								damage: MockRoller.mockResult(6),
								stunX: MockRoller.mockResult(2),
							}
						},
						{
							numDice: 2,
							modifier: Constants.DMG_MOD_MINUS,
							killing: true,
							def: 0,
							rDef: 0,
							location: null,
						},
						new MockRoller(6, 2),
					],
				}

				RunProvider(dataProvider, runner)
			})

			describe('hit locations', () => {
				const dataProvider = {
					'2d6 no defences to head': [
						{
							body: 7,
							stun: 35,
							afterDefences: {
								body: 7,
								stun: 35,
							},
							afterLocation: {
								body: 14,
								stun: 35,
							},
							taken: {
								body: 14,
								stun: 49,
							},
							rolls: {
								damage: MockRoller.mockResult(7),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: true,
							def: 0,
							rDef: 0,
							location: Locations.HEAD,
						},
						new MockRoller(7),
					],
					'2d6 some defences to chest': [
						{
							body: 7,
							stun: 21,
							afterDefences: {
								body: 2,
								stun: 13,
							},
							afterLocation: {
								body: 2,
								stun: 13,
							},
							taken: {
								body: 2,
								stun: 15,
							},
							rolls: {
								damage: MockRoller.mockResult(7),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: true,
							def: 3,
							rDef: 5,
							location: Locations.CHEST,
						},
						new MockRoller(7),
					],
					'2d6 max defences to vitals': [
						{
							body: 7,
							stun: 28,
							afterDefences: {
								body: 0,
								stun: 0,
							},
							afterLocation: {
								body: 0,
								stun: 0,
							},
							taken: {
								body: 0,
								stun: 0,
							},
							rolls: {
								damage: MockRoller.mockResult(7),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: true,
							def: 20,
							rDef: 20,
							location: Locations.VITALS,
						},
						new MockRoller(7),
					],
				}

				RunProvider(dataProvider, runner)
			})
		})

		describe('normal', () => {
			describe('no hit locations', () => {
				const dataProvider = {
					'basic 2d6 no defences': [
						{
							body: 2,
							stun: 7,
							afterDefences: {
								body: 2,
								stun: 7,
							},
							taken: {
								body: 2,
								stun: 9,
							},
							rolls: {
								damage: MockRoller.mockResult([1, 6]),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: false,
							def: 0,
							rDef: 0,
							location: null,
						},
						new MockRoller(
							[1, 6],
						),
					],
					'basic 2d6 minimal defences': [
						{
							body: 2,
							stun: 7,
							afterDefences: {
								body: 0,
								stun: 4,
							},
							taken: {
								body: 0,
								stun: 4,
							},
							rolls: {
								damage: MockRoller.mockResult([1, 6]),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: false,
							def: 2,
							rDef: 1,
							location: null,
						},
						new MockRoller(
							[1, 6],
						),
					],
					'basic 2d6 max defences': [
						{
							body: 2,
							stun: 7,
							afterDefences: {
								body: 0,
								stun: 0,
							},
							taken: {
								body: 0,
								stun: 0,
							},
							rolls: {
								damage: MockRoller.mockResult([1, 6]),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: false,
							def: 10,
							rDef: 10,
							location: null,
						},
						new MockRoller(
							[1, 6],
						),
					],
					'2d6 half no defences': [
						{
							body: 2,
							stun: 9,
							afterDefences: {
								body: 2,
								stun: 9,
							},
							taken: {
								body: 2,
								stun: 11,
							},
							rolls: {
								damage: MockRoller.mockResult([1, 6]),
								half: MockRoller.mockResult([3]),
							}
						},
						{
							numDice: 2,
							modifier: Constants.DMG_MOD_HALF,
							killing: false,
							def: 0,
							rDef: 0,
							location: null,
						},
						new MockRoller(
							[3], [1, 6],
						),
					],
					'2d6 half counts body correctly no defences': [
						{
							body: 3,
							stun: 9,
							afterDefences: {
								body: 3,
								stun: 9,
							},
							taken: {
								body: 3,
								stun: 12,
							},
							rolls: {
								damage: MockRoller.mockResult([1, 6]),
								half: MockRoller.mockResult([4]),
							}
						},
						{
							numDice: 2,
							modifier: Constants.DMG_MOD_HALF,
							killing: false,
							def: 0,
							rDef: 0,
							location: null,
						},
						new MockRoller(
							[4], [1, 6],
						),
					],
				}

				RunProvider(dataProvider, runner)
			})

			describe('hit locations', () => {
				const dataProvider = {
					'2d6 no defences to head': [
						{
							body: 2,
							stun: 7,
							afterDefences: {
								body: 2,
								stun: 7,
							},
							afterLocation: {
								body: 4,
								stun: 14,
							},
							taken: {
								body: 4,
								stun: 18,
							},
							rolls: {
								damage: MockRoller.mockResult([1, 6]),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: false,
							def: 0,
							rDef: 0,
							location: Locations.HEAD,
						},
						new MockRoller([1, 6]),
					],
					'2d6 some defences to chest': [
						{
							body: 2,
							stun: 7,
							afterDefences: {
								body: 0,
								stun: 3,
							},
							afterLocation: {
								body: 0,
								stun: 3,
							},
							taken: {
								body: 0,
								stun: 3,
							},
							rolls: {
								damage: MockRoller.mockResult([1, 6]),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: false,
							def: 2,
							rDef: 2,
							location: Locations.CHEST,
						},
						new MockRoller([1, 6]),
					],
					'2d6 max defences to vitals': [
						{
							body: 2,
							stun: 7,
							afterDefences: {
								body: 0,
								stun: 0,
							},
							afterLocation: {
								body: 0,
								stun: 0,
							},
							taken: {
								body: 0,
								stun: 0,
							},
							rolls: {
								damage: MockRoller.mockResult([1, 6]),
							}
						},
						{
							numDice: 2,
							modifier: null,
							killing: false,
							def: 20,
							rDef: 20,
							location: Locations.VITALS,
						},
						new MockRoller([1, 6]),
					],
				}

				RunProvider(dataProvider, runner)
			})
		})
	})

	describe('knockback', () => {
		function runner(expected, data, roller) {
			const rules = new Rules(roller)
			const actual = rules.knockback(
				data.body,
				data.killing,
				data.knockbackResistance,
				data.martialManeuver,
				data.air,
				data.rolled,
				data.underwater,
				data.clinging,
				data.zeroGrav
			)

			expect(actual).toStrictEqual(expected)
		}

		const dataProvider = {
			'basic knockback': [
				{
					down: true,
					distance: 4,
				},
				{
					body: 7,
					knockbackResistance: 0,
					killing: false,
					martialManeuver: false,
					air: false,
					rolled: false,
					underwater: false,
					clinging: false,
					zeroGrav: false,
				},
				new MockRoller([3, 2]).expect('2d6'),
			],
			'air': [
				{
					down: true,
					distance: 8,
				},
				{
					body: 7,
					knockbackResistance: 0,
					killing: false,
					martialManeuver: false,
					air: true,
					rolled: false,
					underwater: false,
					clinging: false,
					zeroGrav: false,
				},
				new MockRoller([3]).expect('1d6'),
			],
			'rolled with punch': [
				{
					down: true,
					distance: 8,
				},
				{
					body: 7,
					knockbackResistance: 0,
					killing: false,
					martialManeuver: false,
					air: false,
					rolled: true,
					underwater: false,
					clinging: false,
					zeroGrav: false,
				},
				new MockRoller([3]).expect('1d6'),
			],
			'underwater': [
				{
					down: true,
					distance: 2,
				},
				{
					body: 7,
					knockbackResistance: 0,
					killing: false,
					martialManeuver: false,
					air: false,
					rolled: false,
					underwater: true,
					clinging: false,
					zeroGrav: false,
				},
				new MockRoller([3, 2, 1]).expect('3d6'),
			],
			'killing': [
				{
					down: true,
					distance: 2,
				},
				{
					body: 7,
					knockbackResistance: 0,
					killing: true,
					martialManeuver: false,
					air: false,
					rolled: false,
					underwater: false,
					clinging: false,
					zeroGrav: false,
				},
				new MockRoller([3, 2, 1]).expect('3d6'),
			],
			'martial maneuver': [
				{
					down: true,
					distance: 2,
				},
				{
					body: 7,
					knockbackResistance: 0,
					killing: false,
					martialManeuver: true,
					air: false,
					rolled: false,
					underwater: false,
					clinging: false,
					zeroGrav: false,
				},
				new MockRoller([3, 2, 1]).expect('3d6'),
			],
			'clinging': [
				{
					down: true,
					distance: 2,
				},
				{
					body: 7,
					knockbackResistance: 0,
					killing: false,
					martialManeuver: false,
					air: false,
					rolled: false,
					underwater: false,
					clinging: true,
					zeroGrav: false,
				},
				new MockRoller([3, 2, 1]).expect('3d6'),
			],
			'zeroGrav': [
				{
					down: true,
					distance: 8,
				},
				{
					body: 7,
					knockbackResistance: 0,
					killing: false,
					martialManeuver: false,
					air: false,
					rolled: false,
					underwater: false,
					clinging: false,
					zeroGrav: true,
				},
				new MockRoller([3]).expect('1d6'),
			],
			'knockback with resistance': [
				{
					down: true,
					distance: 3,
				},
				{
					body: 7,
					knockbackResistance: 1,
					killing: false,
					martialManeuver: false,
					air: false,
					rolled: false,
					underwater: false,
					clinging: false,
					zeroGrav: false,
				},
				new MockRoller([3, 2]).expect('2d6'),
			],
			'knockback with lots of resistance': [
				{
					down: false,
					distance: 0,
				},
				{
					body: 7,
					knockbackResistance: 10,
					killing: false,
					martialManeuver: false,
					air: false,
					rolled: false,
					underwater: false,
					clinging: false,
					zeroGrav: false,
				},
				new MockRoller([3, 2]).expect('2d6'),
			],
			'knocked down': [
				{
					down: true,
					distance: 0,
				},
				{
					body: 7,
					knockbackResistance: 4,
					killing: false,
					martialManeuver: false,
					air: false,
					rolled: false,
					underwater: false,
					clinging: false,
					zeroGrav: false,
				},
				new MockRoller([3, 2]).expect('2d6'),
			],
			'everything': [
				{
					down: true,
					distance: 1,
				},
				{
					body: 7,
					knockbackResistance: 1,
					killing: true,
					martialManeuver: true,
					air: true,
					rolled: true,
					underwater: true,
					clinging: true,
					zeroGrav: true,
				},
				new MockRoller([3, 2, 1]).expect('3d6'),
			],
		}

		RunProvider(dataProvider, runner)
	})
})

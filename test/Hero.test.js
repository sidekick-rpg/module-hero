import Constants from '../src/Constants.js'
import Hero from '../src/Hero.js'
import Locations from '../src/Locations.js'
import MockRoller from './Mocks/Roller.js'
import MockRules from './Mocks/Rules.js'
import { RunProvider } from './RunProvider.js'

describe('Hero', () => {
	describe('attack', () => {
		function runner(expected, config, mockRules) {
			const hero = new Hero(mockRules)
			const actual = hero.attack(config)

			expect(actual).toStrictEqual(expected)
		}

		describe('basic attacks', () => {
			const dataProvider = {
				'only ocv/dcv': [
					{
						hit: {
							dcv: 3,
							target: 3,
							hits: 1,
							rolled: MockRoller.mockResult([5, 5, 1]),
						},
						locations: [
							{
								location: Locations.CHEST,
								side: null,
								rolls: MockRoller.mockResult([5, 4, 1]),
							},
						],
						damage: null,
						knockback: null,
					},
					{
						attacker: {
							ocv: 3,
						},
						defender: {
							dcv: 3,
						},
					},
					new MockRules({
						hit: [
							{
								dcv: 3,
								target: 3,
								hits: 1,
								rolled: MockRoller.mockResult([5, 5, 1]),
							}
						],
						hitLocation: [
							{
								location: Locations.CHEST,
								side: null,
								rolls: MockRoller.mockResult([5, 4, 1]),
							},
						],
					}).expect({
						hit: [
							[
								3,
								3,
								0,
							],
						],
					}),
				],
				'with damage and kb': [
					{
						hit: {
							dcv: 3,
							target: 3,
							hits: 1,
							rolled: MockRoller.mockResult([5, 5, 1]),
						},
						locations: [
							{
								location: Locations.CHEST,
								side: null,
								rolls: MockRoller.mockResult([5, 4, 1]),
							},
						],
						damage: [
							{
								body: 7,
								stun: 21,
								afterDefences: {
									body: 7,
									stun: 21,
								},
								afterLocation: {
									body: 7,
									stun: 21,
								},
								taken: {
									body: 7,
									stun: 28,
								},
							},
						],
						knockback: [
							{
								down: true,
								distance: 4,
							},
						],
					},
					{
						attacker: {
							ocv: 3,
							damage: {
								dice: 2,
							},
						},
						defender: {
							dcv: 3,
						},
					},
					new MockRules({
						hit: [
							{
								dcv: 3,
								target: 3,
								hits: 1,
								rolled: MockRoller.mockResult([5, 5, 1]),
							},
						],
						hitLocation: [
							{
								location: Locations.CHEST,
								side: null,
								rolls: MockRoller.mockResult([5, 4, 1]),
							},
						],
						damage: [
							{
								body: 7,
								stun: 21,
								afterDefences: {
									body: 7,
									stun: 21,
								},
								afterLocation: {
									body: 7,
									stun: 21,
								},
								taken: {
									body: 7,
									stun: 28,
								},
							},
						],
						knockback: [
							{
								down: true,
								distance: 4,
							},
						],
					}).expect({
						hit: [
							[
								3,
								3,
								0,
							],
						],
						damage: [
							[
								2,
								null,
								true,
								0,
								0,
								Locations.CHEST,
							],
						],
						knockback: [
							[
								7,
								true,
								0,
								false,
								false,
								false,
								false,
								false,
							],
						],
					}),
				],
			}

			RunProvider(dataProvider, runner)
		})
	})
})

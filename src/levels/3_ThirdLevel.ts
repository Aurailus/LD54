import { Level } from './Level';
import { PART_REGISTRY } from '../Parts';

export default function* level(): Level {
	yield { type: 'delay', time: 0.5 }

	yield {
		type: 'phone',
		width: 5,
		height: 7
	}

	yield {
		type: 'action',
		action: 'show_phone'
	}

	yield {
		type: 'delay',
		time: 0.5
	}

	yield {
		type: 'part',
		part: {
			...PART_REGISTRY.cpu[0],
			state: 'valid',
			pos: [ 2, 1 ],
			orientation: 0,
			immobile: true
		}
	}

	yield {
		type: 'delay',
		time: 0.05
	}


	yield {
		type: 'part',
		part: {
			...PART_REGISTRY.wire[1],
			state: 'valid',
			pos: [ 0, 1 ],
			orientation: 3,
			immobile: true
		}
	}

	yield {
		type: 'delay',
		time: 0.05
	}


	yield {
		type: 'part',
		part: {
			...PART_REGISTRY.misc[1],
			state: 'valid',
			pos: [ 0, 0 ],
			orientation: 3,
			immobile: true
		}
	}

	yield {
		type: 'delay',
		time: 0.05
	}


	yield {
		type: 'part',
		part: {
			...PART_REGISTRY.misc[1],
			state: 'valid',
			pos: [ 1, 0 ],
			orientation: 3,
			immobile: true
		}
	}

	yield {
		type: 'delay',
		time: 0.05
	}


	yield {
		type: 'part',
		part: {
			...PART_REGISTRY.misc[1],
			state: 'valid',
			pos: [ 1, 2 ],
			orientation: 3,
			immobile: true
		}
	}

	// yield {
	// 	type: 'part',
	// 	part: {
	// 		...PART_REGISTRY.misc[1],
	// 		state: 'valid',
	// 		pos: [ 3, 3 ],
	// 		orientation: 0,
	// 		immobile: true
	// 	}
	// }

	// yield {
	// 	type: 'delay',
	// 	time: 0.05
	// }

	// yield {
	// 	type: 'part',
	// 	part: {
	// 		...PART_REGISTRY.misc[1],
	// 		state: 'valid',
	// 		pos: [ 4, 6 ],
	// 		orientation: 0,
	// 		immobile: true
	// 	}
	// }

	// yield {
	// 	type: 'delay',
	// 	time: 0.05
	// }

	// yield {
	// 	type: 'part',
	// 	part: {
	// 		...PART_REGISTRY.input[0],
	// 		state: 'valid',
	// 		pos: [ -1, 1 ],
	// 		orientation: 0,
	// 		immobile: true
	// 	}
	// }

	// yield {
	// 	type: 'delay',
	// 	time: 0.05
	// }

	// yield {
	// 	type: 'part',
	// 	part: {
	// 		...PART_REGISTRY.wire[2],
	// 		state: 'valid',
	// 		pos: [ 4, 2 ],
	// 		orientation: 1,
	// 		immobile: true
	// 	}
	// }

	yield {
		type: 'blueprints',
		level: 4
	}

	yield {
		type: 'score_min',
		score: 9500
	};

	yield {
		type: 'message',
		messages: [
			'Hey, remember that 5000 mAh battery?',
			'Yeah it kinda had a little bit of an[u]...[/u]',
			'[w]exploding problem...[/w]',
			'In light of that unforseen consquence,',
			'Corporate has asked all of their designers to [u][i]please[/i][/u] include heatsinks in their models.',
			'The more, the better.',
			'[u](my latest design is going to feature water cooling.)[/u]',
			'[u](I figure just letting it splash around in there will be good.)[/u]'
		]
	}

	yield {
		type: 'completion_requirements',
		requirements: [
			[ 'all_valid', 0 ],
			[ 'has_cpu', 0 ],
			[ 'has_power', 0 ],
			[ 'has_battery', 5000 ],
			[ 'has_storage', 0 ],
			[ 'has_camera', 0 ],
			[ 'has_misc', 10 ],
			[ 'budget_limit', 190 ],
			[ 'time_limit', 60*2 ],
		]
	}

	let res = yield { type: 'wait', until: [ 'ship', 'time' ] };

	if (res.type === 'ship') yield {
		type: 'message',
		messages: [
			'[w]Oh s#!t![/w]',
			'The water got loose and fried my design!',
			'Back to the drawing board.',
			'[w]But it got all soaked too!!![/w]'
		]
	}
}


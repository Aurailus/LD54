// import { Level } from './Level';
// import { PART_REGISTRY } from '../Parts';

// export default function* level(): Level {
// 	yield { type: 'delay', time: 0.5 }

// 	yield {
// 		type: 'phone',
// 		width: 5,
// 		height: 7
// 	}

// 	yield {
// 		type: 'action',
// 		action: 'show_phone'
// 	}

// 	yield {
// 		type: 'delay',
// 		time: 0.5
// 	}

// 	yield {
// 		type: 'part',
// 		part: {
// 			...PART_REGISTRY.misc[1],
// 			state: 'valid',
// 			pos: [ 0, 3 ],
// 			orientation: 0,
// 			immobile: true
// 		}
// 	}

// 	yield {
// 		type: 'delay',
// 		time: 0.05
// 	}

// 	yield {
// 		type: 'part',
// 		part: {
// 			...PART_REGISTRY.misc[1],
// 			state: 'valid',
// 			pos: [ 3, 3 ],
// 			orientation: 0,
// 			immobile: true
// 		}
// 	}

// 	yield {
// 		type: 'delay',
// 		time: 0.05
// 	}

// 	yield {
// 		type: 'part',
// 		part: {
// 			...PART_REGISTRY.misc[1],
// 			state: 'valid',
// 			pos: [ 4, 6 ],
// 			orientation: 0,
// 			immobile: true
// 		}
// 	}

// 	yield {
// 		type: 'delay',
// 		time: 0.05
// 	}

// 	yield {
// 		type: 'part',
// 		part: {
// 			...PART_REGISTRY.input[0],
// 			state: 'valid',
// 			pos: [ -1, 1 ],
// 			orientation: 0,
// 			immobile: true
// 		}
// 	}

// 	yield {
// 		type: 'delay',
// 		time: 0.05
// 	}

// 	yield {
// 		type: 'part',
// 		part: {
// 			...PART_REGISTRY.wire[2],
// 			state: 'valid',
// 			pos: [ 4, 2 ],
// 			orientation: 1,
// 			immobile: true
// 		}
// 	}

// 	yield {
// 		type: 'blueprints',
// 		level: 3
// 	}

// 	yield {
// 		type: 'score_min',
// 		score: 10500
// 	};

// 	yield {
// 		type: 'message',
// 		messages: [
// 			'Back at it again, huh?',
// 			'I\'ve been seeing you around more and more,',
// 			'Corporate must like what you\'re making, if they\'re giving you so many hours.',
// 			'[w]What are your secrets???[/w]',
// 			'Haha! Just kidding. (definitely...)',
// 			'Uh, company policy changed last weekend,',
// 			'all of our phones are now required to have at least a [w]5000 mAh battery[/w].',
// 			'Oh, and we\'re trying to release a new high-tech line of camera-phone Cameras.',
// 			'Personally, I\'ve been struggling to fit all that together while still maintaining my [u]signature flair~[/u].',
// 			'With that big of a battery, how will I fit the confetti dispenser?'
// 		]
// 	}

// 	yield {
// 		type: 'completion_requirements',
// 		requirements: [
// 			[ 'all_valid', 0 ],
// 			[ 'has_cpu', 0 ],
// 			[ 'has_power', 0 ],
// 			[ 'has_battery', 5000 ],
// 			[ 'has_storage', 0 ],
// 			[ 'has_camera', 0 ],
// 			[ 'budget_limit', 190 ],
// 			[ 'time_limit', 60*2 ]
// 		]
// 	}

// 	let res = yield { type: 'wait', until: [ 'ship', 'time' ] };

// 	if (res.type === 'ship') yield {
// 		type: 'message',
// 		messages: [
// 			'[u](No confetti dispenser... tisk, tisk)[/u]',
// 			'[u](They don\'t got nothing on me.)[/u]'
// 		]
// 	}
// }


import { Level } from './Level';
import { PART_REGISTRY } from '../Parts';

export default function* level(): Level {
	yield { type: 'delay', time: 0.5 }

	// yield {
	// 	type: 'message',
	// 	messages: [
	// 		'Hey there, [u]new hire[/u]!',
	// 		'The name\'s Sophia.',
	// 		'I thought I\'d introduce myself, given you\'re new and all.',
	// 		'And probably lonely.',
	// 		'And sad.',
	// 		'So tell me... do [i]you[/i] know how to [w]build a phone?[/w]',
	// 		'[u]Haha! Just kidding![/u]',
	// 		'Of course you do, otherwise you would\'ve [i]never[/i] got this job.',
	// 		'Unless you lied on your resume.',
	// 		'[u]...[/u]',
	// 		'But people don\'t do that!',
	// 		// 'I can actually see you from here.',
	// 		// '[w]STOP SLOUCHING![/w]',
	// 		'Anyways, I just wanted to say hi.',
	// 		'I\'ve been working here for a [u]lonnnggggggggggg[/u] time...',
	// 		'So give me a ring if you\'re ever confused about anything.',
	// 	],
	// 	answers: {
	// 		help: 'Actually...'
	// 	}
	// };

	// yield {
	// 	type: 'message',
	// 	messages: [
	// 		'Oh no.',
	// 		'[i]No no no no.[/i]',
	// 		'Don\'t tell me.',
	// 		'[w]You don\'t know what\'s going on at all, do you?[/w]',
	// 		'[u]Ooooookayyyyy[/u]. I\'ll give you the rundown...'
	// 	]
	// };

	yield {
		type: 'phone',
		width: 4,
		height: 6,
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
			...PART_REGISTRY.wire[1],
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
			...PART_REGISTRY.cpu[0],
			state: 'valid',
			pos: [ 2, 3 ],
			orientation: 0,
			immobile: true
		}
	}

	// yield {
	// 	type: 'delay',
	// 	time: 0.5
	// }

	// yield {
	// 	type: 'message',
	// 	messages: [
	// 		'Here, take a look at this phone.',
	// 		'You [i]might[/i] notice that it\'s got [u]pretty[/u] much nothing in it.',
	// 		'It\'s your job to put things there.',
	// 		'[u](seriously, how did this person even [i]get[/i] here?)[/u]',
	// 	]
	// }

	// yield {
	// 	type: 'part',
	// 	part: {
	// 		...PART_REGISTRY.battery[1],
	// 		pos: [ -4, 1 ],
	// 		orientation: 0,
	// 		state: 'out-of-bounds'
	// 	}
	// }

	// yield {
	// 	type: 'message',
	// 	messages: [
	// 		'Here, now take this battery, and connect it to the CPU.'
	// 	]
	// }

	// while ((yield { type: 'placement' }).state !== 'valid') {}

	// yield { type: 'action', action: 'lock_all' };

	// yield {
	// 	type: 'message',
	// 	messages: [
	// 		'[u](okay, phew, they have some kind of brain at least...)[/u]',
	// 		'[w]gReaT jOb[/w]',
	// 		'Unfortunately, a phone isn\'t a phone with just a battery.',
	// 		'We also need some memory in there.',
	// 	]
	// }

	// yield {
	// 	type: 'part',
	// 	part: {
	// 		...PART_REGISTRY.storage[1],
	// 		state: 'out-of-bounds',
	// 		pos: [ -4, 1 ],
	// 		orientation: 1
	// 	}
	// }

	// yield {
	// 	type: 'message',
	// 	messages: [
	// 		'Here, try to fit this memory card in.'
	// 	]
	// }

	// let earlySuccess = false;
	// while (true) {
	// 	let res = (yield { type: 'placement' }).state;
	// 	if (res === 'unconnected' || res === 'invalid') {
	// 		yield {
	// 			type: 'message',
	// 			messages: [
	// 				'Yeah, sorry. That\'s not gonna fit there.',
	// 				'Maybe try rotating it?',
	// 				'(Rotate with Right Mouse Button)'
	// 			]
	// 		}
	// 		break;
	// 	}
	// 	else if (res === 'valid') {
	// 		yield { type: 'action', action: 'lock_all' };
	// 		yield {
	// 			type: 'message',
	// 			messages: [
	// 				'Aight, cool.'
	// 			]
	// 		}
	// 		earlySuccess = true;
	// 		break;
	// 	}
	// }

	// if (!earlySuccess) {
	// 	while (true) {
	// 		let res = (yield { type: 'placement' }).state;
	// 		if (res === 'disconnected' || res === 'invalid') {
	// 			yield {
	// 				type: 'message',
	// 				messages: [
	// 					'Yeah, so that\'s not gonna fit like [i]thatttttttt[/i].',
	// 					'[u](they seem like they\'d be the type to try and fit the rectangle into the circle hole)[/u]',
	// 					'Try rotating it?',
	// 					'(Rotate with Right Mouse Button)'
	// 				]
	// 			}
	// 		}
	// 		else if (res === 'valid') {
	// 			yield { type: 'action', action: 'lock_all' };
	// 			yield {
	// 				type: 'message',
	// 				messages: [
	// 					'[u](finally...)[/u]'
	// 				]
	// 			}
	// 			break;
	// 		}
	// 	}
	// }

	// yield {
	// 	type: 'message',
	// 	messages: [
	// 		'Now we just need a way to charge the thing, and then we can ship it.'
	// 	]
	// }

	yield {
		type: 'blueprints',
		level: 0
	}

	// yield {
	// 	type: 'message',
	// 	messages: [
	// 		'Just grab whichever assembly will fit and shove it in.',
	// 		'It doesn\'t have to be pretty, it just has to work.'
	// 	]
	// }

	// while (true) {
	// 	let res = (yield { type: 'placement' }).state;
	// 	if (res === 'valid') break;
	// }

	// yield { type: 'action', action: 'lock_all' };
	yield { type: 'delay', time: 0.3 }

	yield {
		type: 'message',
		messages: [
			'You really took the whole [u]\'doesn\'t have to be pretty\'[/u] thing to heart, huh?',
			'Alright, whatever. Let\'s ship it out.'
		]
	};

	yield {
		type: 'action',
		action: 'hide_phone'
	};

	yield {
		type: 'blueprints',
		level: -1
	}

	yield {
		type: 'delay',
		time: 1
	}

	yield {
		type: 'action',
		action: 'remove_all'
	}

	yield {
		type: 'message',
		messages: [
			'Alright, I have to get to work, so you\'re on your own now.',
			'Hopefully my comprehensive ten-second program was enough to get you on your way.',
			'Try making your own phone and shipping it yourself.',
			'You\'ll want to make sure that it at least has [w]CPU[/w], [w]memory[/w], [w]a charger[/w], and [w]a battery[/w].',
			'Just look around your junk drawer, I\'m sure you\'ll find something.'
		]
	}

	yield {
		type: 'action',
		action: 'show_phone'
	}


	yield {
		type: 'delay',
		time: 0.3
	}

	yield {
		type: 'blueprints',
		level: 1
	}


}

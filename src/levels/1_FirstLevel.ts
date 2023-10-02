import { Level } from './Level';
import { PART_REGISTRY } from '../Parts';

export default function* level(): Level {
	yield { type: 'delay', time: 0.5 }

	yield {
		type: 'phone',
		width: 5,
		height: 6
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
			...PART_REGISTRY.misc[1],
			state: 'valid',
			pos: [ 4, 0 ],
			orientation: 1,
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
			pos: [ 4, 1 ],
			orientation: 2,
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
			pos: [ 4, 2 ],
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
			...PART_REGISTRY.misc[1],
			state: 'valid',
			pos: [ 0, 4 ],
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
			pos: [ 0, 5 ],
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
			pos: [ 0, 2 ],
			orientation: 2,
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
			pos: [ 3, 3 ],
			orientation: 0,
			immobile: true
		}
	}

	yield {
		type: 'delay',
		time: 0.05
	}

	yield {
		type: 'blueprints',
		level: 2
	}

	yield {
		type: 'score_min',
		score: 2200
	};

	yield {
		type: 'message',
		messages: [
			'Hey, hope you had a great weekend!',
			'I spent mine here, creating this new phone design.',
			'It crosses the convenience of smartphones with the fluffiness of small animals.',
			'I\'m not quite done yet, but it\'s going to be [w]crazy!!![/w]',
			'Anyways, we\'ve been given some new parts to work with, so check your blueprints.',
			'Also, corporate has started limiting the time we have to make phones.',
			'I think it\'s so we can\'t rack up hours in the bathroom anymore.',
			'But it makes it hard to [u]iterate[/u].',
			'It\'s harshing my vibe, how am I supposed to make the [u]DogPhone (tm)[/u] under these conditions?!'
		]
	}

	yield {
		type: 'completion_requirements',
		requirements: [
			[ 'all_valid', 0 ],
			[ 'has_cpu', 0 ],
			[ 'has_power', 0 ],
			[ 'has_battery', 0 ],
			[ 'has_storage', 0 ],
			[ 'budget_limit', 190 ],
			[ 'time_limit', 60*2 ]
		]
	}

	let res = yield { type: 'wait', until: [ 'ship', 'time' ] };

	if (res.type === 'ship') yield {
		type: 'message',
		messages: [
			'Ooh, I [i]love[/i] what you\'ve got going on over there!',
			'It\'s no DogPhone, though... (tm)',
			'Oh well, we can\'t all be visionaries.',
			'[u]See you tomorrow![/u]'
		]
	}
}


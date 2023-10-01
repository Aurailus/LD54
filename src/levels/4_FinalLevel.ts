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
		type: 'message',
		messages: [
			'Hey, you made it through your first month at the company!',
			'You know, we have a 90% drop-out rate for new employees.',
			'So you did [u]pretty good[/u]!',
			'You know, I [i]kinda[/i] wasn\'t sure about you at the beginning,',
			'Given you didn\'t really seem to know [w]at all[/w] what you were doing.',
			'But now, with three phones under your belt,',
			'Only one of which has [w]exploded,[/w]',
			'I think you\'ve well proven your worth.',
			'And that\'s why I\'ve been fired.',
			'[u]...[/u]',
			'Yeah, Corporate decided to cut costs and get rid of the [w]\'under performers\'[/w].',
			'I don\'t know how they could say that about [i]me[/i], I\'ve created so many iconic designs!',
			'The [u]DogPhone (tm)...[/u],',
			'The [u]CatPhone (tm)...[/u],',
			'The [u]WaterPhone (tm)... (that one didn\'t really turn out)[/u],',
			'The [u]ExplodingPhone (tm)...[/u] Wait never mind, that was you.',
			'But apparently I wasn\'t enough.',
			'So I\'m taking my talents elsewhere, I\'ve got a line on a new job.',
			'And I\'m gonna make the most [i][u]stylish[/u][/i] medical equipment in the industry!',
			'So see you around, [w]sucker[/w]!',
			'...',
			'[u]THANKS FOR PLAYING MY GAME! (this text is non-diagetic)[/u]',
			'[u]Hope you enjoyed it very much~[/u]',
			'Made by [u]Auri Collings (@Aurailus)[/u] in 48 hours for the [w]Ludum Dare 54 Compo![/w]',
			'You should like, join my Discord :3'
		]
	}
}


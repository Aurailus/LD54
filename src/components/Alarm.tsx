import { h } from 'preact';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../Constants';

import img_desk_alarm from '@res/desk_alarm.png';
import { classes } from '../Util';

interface Props {
	pixelScale: number;
	price: number;
	budget: number;
	timeLeft: number;
}

export default function Status(props: Props) {
	return (
		<div
			class='absolute w-max h-max z-10 grid'
			style={{
				right: Math.floor((SCREEN_WIDTH / 2) - (window.innerWidth / props.pixelScale / 2)),
				top: Math.floor((SCREEN_HEIGHT / 2) - (window.innerHeight / props.pixelScale / 2)) - 20
			}}
		>
			<img src={img_desk_alarm} class='pointer-events-none'/>
			<div
				class='absolute flex flex-col w-[130px] h-[42px] top-[68px] left-[10px] skew-y-[15deg]'
				style={{

				}}
			>
				<p class='text-red-500 text-lg font-mono px-1 pt-1 leading-none [text-shadow:0px_0px_4px_#D34359]'>
					{Math.floor(props.timeLeft / 60)}:{(props.timeLeft % 60).toString().padStart(2, '0')}

				</p>
				<p class={classes(props.price >= props.budget ? 'text-red-300 [text-shadow:0px_0px_4px_#D34359]' : 'text-gray-500',
					'text-[10px] font-mono px-1 pt-1 leading-none')}>
					${props.price.toLocaleString('en-US', { currency: 'CAD', maximumFractionDigits: 0, useGrouping: true })}
					<span class='inline-block w-px'/>
					{'/'}
					<span class='inline-block w-px'/>
					${props.budget.toLocaleString('en-US', { currency: 'CAD', maximumFractionDigits: 0, useGrouping: true })}
				</p>
			</div>
		</div>
	);
}

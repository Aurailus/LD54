import { Fragment, h } from 'preact';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../Constants';

import img_desk_alarm from '@res/desk_alarm.png';
import img_desk_button from '@res/desk_button_pressable.png';
import img_desk_button_down from '@res/desk_button_down.png';

import { classes } from '../Util';

interface Props {
	pixelScale: number;
	price: number;
	budget: number;
	timeLeft: number;

	canShip: boolean;
	onShip: () => void;
}

export default function Status(props: Props) {
	return (
		<div
			class='absolute w-max h-max z-10 grid'
			style={{
				right: Math.floor((SCREEN_WIDTH / 2) - (window.innerWidth / props.pixelScale / 2)),
				top: Math.floor((SCREEN_HEIGHT / 2) - (window.innerHeight / props.pixelScale / 2)) - 20,
			}}
			onClick={props.canShip ? props.onShip : undefined}
		>
			<img src={img_desk_alarm} class='pointer-events-none'/>

			<div class='contents'>
				{props.canShip && <div class='click-target w-32 h-5 skew-x-[-60deg] skew-y-[10.5deg] top-[24px] left-[30px] absolute cursor-pointer'/>}
				<img src={props.canShip ? img_desk_button : img_desk_button_down} class={classes('pointer-events-none absolute',
					props.canShip ? '' : 'brightness-50 saturate-[50%]')}/>
				{props.canShip && <img src={img_desk_button_down} class={classes('pointer-events-none absolute')}/>}
			</div>

			<div
				class='absolute flex flex-col w-[130px] h-[42px] top-[68px] left-[10px] skew-y-[15deg]'
				style={{

				}}
			>
				<p class='text-red-500 text-lg font-mono px-1 pt-1 leading-none [text-shadow:0px_0px_4px_#D34359]'>
					{props.timeLeft === -1
						? <span class='text-gray-700 [text-shadow:0px_0px_0px_black]'>--:--</span>
						: <Fragment>{Math.floor(props.timeLeft / 60)}:{(props.timeLeft % 60).toString().padStart(2, '0')}</Fragment>
					}
				</p>
				<p class={classes(props.price >= props.budget && props.budget !== -1 ? 'text-red-300 [text-shadow:0px_0px_4px_#D34359]' : 'text-gray-500',
					'text-[10px] font-mono px-1 pt-1 leading-none')}>
					${props.price.toLocaleString('en-US', { currency: 'CAD', maximumFractionDigits: 0, useGrouping: true })}
					{props.budget > -1 && <Fragment>
						<span class='inline-block w-px'/>
						{'/'}
						<span class='inline-block w-px'/>
						${props.budget.toLocaleString('en-US', { currency: 'CAD', maximumFractionDigits: 0, useGrouping: true })}
					</Fragment>}
				</p>
			</div>
		</div>
	);
}

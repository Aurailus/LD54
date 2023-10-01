import { h } from 'preact';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../Constants';

import img_desk_landline from '@res/desk_landline.png';
import img_desk_landline_reciever from '@res/desk_landline_receiver.png';
import { classes } from '../Util';

interface Props {
	pixelScale: number;
	ringing: boolean;
	onClick: () => void;
}

export default function Status(props: Props) {
	return (
		<div
			class='absolute w-max h-max z-10 grid'
			style={{
				right: Math.floor((SCREEN_WIDTH / 2) - (window.innerWidth / props.pixelScale / 2)),
				bottom: Math.floor((SCREEN_HEIGHT / 2) - (window.innerHeight / props.pixelScale / 2)) - 55,
			}}
		>
			<img src={img_desk_landline} class='pointer-events-none'/>
			<img src={img_desk_landline_reciever} class={classes('pointer-events-none absolute', props.ringing && 'animate-ringing')}/>

			<button class='w-80 h-80 absolute top-[22px] left-[-80px] skew-x-[-40deg] skew-y-[11deg]'
			onClick={props.onClick}>

			</button>
		</div>

	);
}

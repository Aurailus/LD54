import { h } from 'preact';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../Constants';

import img_desk_landline from '@res/desk_landline.png';

interface Props {
	pixelScale: number;
}

export default function Status(props: Props) {
	return (
		<div
			class='absolute w-max h-max z-10 grid pointer-events-none'
			style={{
				left: Math.floor((SCREEN_WIDTH / 2) - (window.innerWidth / props.pixelScale / 2)) - 40,
				top: Math.floor((SCREEN_HEIGHT / 2) - (window.innerHeight / props.pixelScale / 2)) - 20
			}}
		>
			<img src={img_desk_landline}/>

		</div>
	);
}

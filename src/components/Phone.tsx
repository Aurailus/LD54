import { h } from 'preact';

import { classes, range } from '../Util';

import img_phone_cell_1 from '@res/phone_cell_1.png';
import img_phone_cell_2 from '@res/phone_cell_2.png';
import img_phone_cell_3 from '@res/phone_cell_3.png';
import img_phone_frame  from '@res/phone_frame.png';

const img_phone_cells = [ img_phone_cell_1, img_phone_cell_2, img_phone_cell_3 ];

import { CELL_SIZE } from '../Constants';

interface Props {
	gridWidth: number;
	gridHeight: number;
	class?: string;
	style?: any;
}

export default function Phone(props: Props) {
	return (
		<div class={classes('grid isolate', props.class)} style={{
			...(props.style ?? {}),
			gridTemplateColumns: `repeat(${props.gridWidth}, ${CELL_SIZE}px)`,
			gridTemplateRows: `repeat(${props.gridHeight}, ${CELL_SIZE}px)`,
		}}>
			{range(props.gridWidth * props.gridHeight).map((i) => (
				<div class='w-[33px] h-[33px] -mr-px -mb-px'>
					<img
						src={img_phone_cells[Math.floor(Math.pow(i, 1.3)) % img_phone_cells.length]}
						style={{
							transform: `rotate(${Math.floor(Math.pow(i, 1.1)) * 90}deg)`,
							filter: `brightness(${.94 + (Math.floor(Math.pow(i, 1.5) % 12) * 0.01)})`
						}}
					/>
				</div>
			))}
			<div class='-top-8 -left-8 w-[calc(100%+4rem+1px)] h-[calc(100%+4rem+1px)] absolute z-[100]'
				style={{
					borderImage: `url(${img_phone_frame})`,
					borderImageSlice: '33.33333%',
					borderWidth: 32
				}}
			/>
		</div>
	)
}

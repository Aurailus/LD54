import { h } from 'preact';

import { classes, range } from './Util';

import img_phone_cell from '@res/phone_cell.png';
import { CELL_SIZE } from './Constants';

interface Props {
	gridWidth: number;
	gridHeight: number;
	class?: string;
	style?: any;
}

export default function Phone(props: Props) {
	return (
		<div class={classes('grid', props.class)} style={{
			...(props.style ?? {}),
			gridTemplateColumns: `repeat(${props.gridWidth}, ${CELL_SIZE}px)`,
			gridTemplateRows: `repeat(${props.gridHeight}, ${CELL_SIZE}px)`,
		}}>
			{range(props.gridWidth * props.gridHeight).map(() => (
				<img src={img_phone_cell}/>
			))}
		</div>
	)
}

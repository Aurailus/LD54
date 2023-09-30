import { h } from 'preact';
import { forwardRef } from 'preact/compat';

import { CELL_SIZE } from './Constants';
import { useRef } from 'preact/hooks';
import { classes, range } from './Util';

export type PartType = 'storage' | 'cpu' | 'battery' | 'wire' | 'camera' | 'input';

export type PartState = 'valid' | 'invalid' | 'disconnected' | 'dragging' | 'drag-indicator' | 'out-of-bounds';

export interface PartDef {
	model: string;

	type: PartType;

	img: string | string[];

	/* 2d array of occupied cells. */
	size: boolean[][];

	/** array of tuples where [0] = x, [1] = y, [2] = orientation */
	connectors: [ number, number, number ][];
}

export interface PartProps extends PartDef {
	state: PartState;

	pos: [ number, number ];

	/* 0: 0deg, 1: 90deg, 2: 180deg, 3: 270deg */
	orientation: number;
}

interface Props extends PartProps {
	phoneX: number;
	phoneY: number;

	onMoveStart?: (evt: MouseEvent) => void;
	onMoveEnd?: (evt: MouseEvent) => void;
	onRotate?: () => void;
	setRef?: (elem: HTMLElement) => void;


	class?: string;
	style?: any;
}

export default function Part(props: Props) {
	const callbacks = useRef<{
		mouseUpCallback: (evt: MouseEvent) => void;
		contextMenuCallback: (evt: MouseEvent) => void;
	 } | null>(null);

	function handleMouseUp(evt: MouseEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		if (evt.button !== 0) return;

		if (callbacks.current) {
			window.removeEventListener('mouseup', callbacks.current.mouseUpCallback);
			window.removeEventListener('contextmenu', callbacks.current.contextMenuCallback);
		}

		callbacks.current = null;

		props.onMoveEnd?.(evt);
	}

	function handleMouseDown(evt: MouseEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		if (evt.button !== 0) return;

		props.onMoveStart?.(evt);

		if (callbacks.current) {
			window.removeEventListener('mouseup', callbacks.current.mouseUpCallback);
			window.removeEventListener('contextmenu', callbacks.current.contextMenuCallback);
		}

		callbacks.current = {
			mouseUpCallback: handleMouseUp,
			contextMenuCallback: handleRightClick
		}

		window.addEventListener('mouseup', callbacks.current.mouseUpCallback);
		window.addEventListener('contextmenu', callbacks.current.contextMenuCallback);
	}

	function handleRightClick(evt: MouseEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		props.onRotate?.();
	}

	return (
		<div
			ref={(elem) => props.setRef?.(elem as HTMLElement)}
			class={classes('absolute pointer-events-none',
				props.state === 'drag-indicator' && 'animate-part-moving', props.class)}
			style={{
				left: `${props.phoneX + props.pos[0] * CELL_SIZE}px`,
				top: `${props.phoneY + props.pos[1] * CELL_SIZE}px`,
				width: `${props.size[0].length * CELL_SIZE}px`,
				height:	`${props.size.length * CELL_SIZE}px`,
				...(props.style ?? {})
			}}
			onMouseDown={handleMouseDown}
			onContextMenu={props.onRotate ? handleRightClick : undefined}
		>
			<img
				class={classes('absolute transition duration-100 left-1/2 top-1/2')}
				style={{
					transform: `translate(-50%, -50%) rotate(${props.orientation * 90}deg)`,
					filter:
					// props.state === 'disconnected'
						// ? 'grayscale(100%) contrast(0.7) brightness(1.3)'
						// :
						props.state === 'invalid'
							? 'grayscale(100%) sepia(100%) brightness(2) saturate(500%) hue-rotate(324deg)'
							: '',
					opacity: props.state === 'invalid' || props.state === 'dragging'
						? 0.8
						: props.state === 'disconnected' || props.state === 'out-of-bounds'
							? 0.6
							: ''
				}}
				src={Array.isArray(props.img) ? props.img[props.orientation] : props.img}
			/>
			{range(props.size.length * props.size[0].length).map(i => {
				const x = i % props.size[0].length;
				const y = Math.floor(i / props.size[0].length);
				if (props.size[y][x]) {
					return <div style={{
						position: 'absolute',
						width: `${CELL_SIZE}px`,
						height: `${CELL_SIZE}px`,
						left: `${x * CELL_SIZE}px`,
						top: `${y * CELL_SIZE}px`,
						pointerEvents: 'all'
					}} />
				}
				return null;
			}).filter(Boolean)}
		</div>
	);
}

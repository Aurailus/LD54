import { h } from 'preact';
import { useCallback, useLayoutEffect, useRef } from 'preact/hooks';
import { forwardRef } from 'preact/compat';

import { CELL_SIZE } from '../Constants';
import { classes, range } from '../Util';
import { PartBound, PartDef } from '../Parts';

export type PartState =
	'valid' |
	'invalid' |
	'disconnected' |
	'dragging' |
	'drag-indicator' |
	'remove-indicator' |
	'out-of-bounds' |
	'blueprint';

export interface PartProps extends PartDef {
	state: PartState;

	pos: [ number, number ];

	/* 0: 0deg, 1: 90deg, 2: 180deg, 3: 270deg */
	orientation: number;

	immobile?: boolean;

	uid: string;
}

interface Props extends PartProps {
	phoneX: number;
	phoneY: number;

	onMoveStart?: (evt: MouseEvent) => void;
	onMoveEnd?: (evt: MouseEvent, uid: string) => void;
	onRotate?: (uid: string) => void;
	setRef?: (elem: HTMLElement) => void;


	class?: string;
	style?: any;
}

export default function Part(props: Props) {
	const callbacks = useRef<{
		mouseUpCallback: (evt: MouseEvent) => void;
		contextMenuCallback: (evt: MouseEvent) => void;
	 } | null>(null);

	const handleMouseUp = useCallback((evt: MouseEvent) => {
		evt.preventDefault();
		evt.stopPropagation();
		if (evt.button !== 0) return;

		if (callbacks.current) {
			window.removeEventListener('mouseup', callbacks.current.mouseUpCallback);
			window.removeEventListener('contextmenu', callbacks.current.contextMenuCallback);
		}

		callbacks.current = null;

		props.onMoveEnd?.(evt, props.uid);
	}, [ props.onMoveEnd, props.uid ]);

	const handleRightClick = useCallback((evt: MouseEvent) => {
		evt.preventDefault();
		evt.stopPropagation();
		props.onRotate?.(props.uid);
	}, [ props.onRotate, props.uid ]);

	function bindMoveCallbacks() {
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

	useLayoutEffect(() => {
		if (callbacks.current) bindMoveCallbacks();
	}, [ handleMouseUp, handleRightClick ])

	function handleMouseDown(evt: MouseEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		if (evt.button !== 0) return;

		props.onMoveStart?.(evt);

		bindMoveCallbacks();
	}


	return (
		<div
			ref={(elem) => props.setRef?.(elem as HTMLElement)}
			class={classes(props.state === 'blueprint' ? 'relative' : 'absolute', 'pointer-events-none',
				(props.state === 'drag-indicator' || props.state === 'remove-indicator') && 'animate-part-moving', props.class)}
			style={{
				left: `${props.phoneX + props.pos[0] * CELL_SIZE}px`,
				top: `${props.phoneY + props.pos[1] * CELL_SIZE}px`,
				width: `${props.bounds[0].length * CELL_SIZE}px`,
				height:	`${props.bounds.length * CELL_SIZE}px`,
				filter: props.immobile
					? 'drop-shadow(1px 1px 0 #ff80a4) drop-shadow(-1px 1px 0 #ff80a4) drop-shadow(1px -1px 0 #ff80a4) drop-shadow(-1px -1px 0 #ff80a4)'
					: (props.state === 'valid' || props.state === 'disconnected' || props.state === 'dragging')
						? 'drop-shadow(0px 2px 0 rgb(0 0 0 / 20%))'
						: props.state === 'drag-indicator'
							? 'drop-shadow(0px 3px 1px rgb(0 0 0 / 20%))'
							: '',
				zIndex: (props.state === 'dragging' || props.state === 'invalid')
					? 50
					: props.state !== 'blueprint'
						? props.pos[1] + 20
						: undefined,
				...(props.style ?? {})
			}}
			onMouseDown={props.immobile ? undefined : handleMouseDown}
			onContextMenu={(!props.immobile && props.onRotate) ? handleRightClick : undefined}
		>
			<img
				class={classes(props.state !== 'blueprint' && 'absolute left-1/2 top-1/2', 'transition duration-100')}
				style={{
					transform: props.state !== 'blueprint' ? `translate(-50%, -50%) rotate(${props.orientation * 90}deg)` : '',
					filter:
						props.state === 'invalid' || props.state === 'remove-indicator'
							? 'grayscale(100%) sepia(100%) contrast(0.8) brightness(1.6) saturate(500%) hue-rotate(324deg)'
							: props.state === 'blueprint'
								? 'grayscale(100%) sepia(100%) contrast(1.25) brightness(1.8) saturate(150%)'
								: '',
					opacity: props.state === 'invalid'
						? 0.8
						: props.state === 'disconnected' || props.state === 'out-of-bounds' || props.state === 'dragging'
							? 0.6
							: props.state === 'blueprint'
								? 0.7
								: '',
					mixBlendMode: props.state === 'blueprint' ? 'luminosity' : ''
				}}
				src={Array.isArray(props.img) ? props.img[props.orientation] : props.img}
			/>
			{range(props.bounds.length * props.bounds[0].length).map(i => {
				const x = i % props.bounds[0].length;
				const y = Math.floor(i / props.bounds[0].length);
				if (props.bounds[y][x] != PartBound.Transparent) {
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

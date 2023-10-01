import { Fragment, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import img_desk_background from '@res/desk_background.png';
import img_desk_landline from '@res/desk_landline.png';
import Phone from './Phone';
import { SCREEN_HEIGHT, SCREEN_WIDTH, CELL_SIZE } from '../Constants';
import { PART_REGISTRY, PartDef, PartBound as B } from '../Parts';
import Part, { PartProps } from './Part';
import PartSpawner from './PartSpawner';
import DialogManager from './DialogManager';
import Status from './Alarm';
import Landline from './Landline';
import { Level, LevelDirective } from '../levels/Level';
import { classes } from '../Util';

interface MovingPart {
	ind: number;
	part: PartProps;
	ref: HTMLElement;
	mouseOffset: [ number, number ];
	willRemove: boolean;
}

const positionOffsets = [
	[ 0, -1 ],
	[ 1, 0 ],
	[ 0, 1 ],
	[ -1, 0 ]
];

interface Props {
	level: Level;
}
function rotatePart(part: PartProps, orientation: number) {
	let numRotations = (orientation + 4 - part.orientation) % 4;
	for (let i = 0; i < numRotations; i++) {
		const newBounds: B[][] = [];
		for (let i = 0; i < part.bounds[0].length; i++) {
			const newArr: B[] = [];
			for (let j = 0; j < part.bounds.length; j++) newArr[j] = B.Transparent;
			newBounds[i] = newArr;
		}
		for (let i = 0; i < part.bounds.length; i++) {
			for (let j = 0; j < part.bounds[0].length; j++) {
				newBounds[j][newBounds[0].length - 1 - i] = part.bounds[i][j];
			}
		}
		part.bounds = newBounds;

		const newConnectors: [ number, number, number ][] = [];
		for (let connecter of  (part.connectors ?? [])) {
			newConnectors.push([ newBounds[0].length - 1 - connecter[1], connecter[0], (connecter[2] + 1) % 4 ]);
		}
		part.connectors = newConnectors;
	}
	part.orientation = orientation % 4;
	return part;
}

export default function BuilderScene(props: Props) {
	const [ [ screenWidth, screenHeight ], setScreenSize ] =
		useState<[ number, number ]>([ window.innerWidth, window.innerHeight ]);

	const [ messages, setMessages ] = useState<string[]>([]);
	const [ answers, setAnswers ] = useState<Record<string, string>>();
	const [ levelYielding, setLevelYielding ] = useState<'placement' | null>(null);
	const [ blueprintsLevel, setBlueprintsLevel ] = useState<number>(-1);
	const [ phoneSize, setPhoneSize ] = useState<[ number, number ] | null>(null);
	const [ parts, setParts ] = useState<PartProps[]>([]);
	const [ phoneVisible, setPhoneVisible ] = useState<boolean | 'out'>();

	const [ movingPart, setMovingPart ] = useState<MovingPart | null>(null);
	const mousePos = useRef<[ number, number ]>([ 0, 0 ]);

	const pixelScale = 3;

	function handleLevelDirective(ret?: any) {
		let { value: directive, done } = props.level.next(ret);

		if (done) console.warn('done!');
		if (!directive) return;

		switch (directive.type) {
			case 'message': {
				setMessages(directive.messages);
				setAnswers(directive.answers);
				break;
			}
			case 'delay': {
				setTimeout(() => handleLevelDirective(), directive.time * 1000);
				break;
			}
			case 'phone': {
				setPhoneSize([ directive.width, directive.height ]);
				handleLevelDirective();
				break;
			}
			case 'part': {
				const newPart: PartProps = { ...directive.part, uid: Date.now().toString() };
				let desiredOrientation = directive.part.orientation;
				newPart.orientation = 0;
				rotatePart(newPart, desiredOrientation);
				setParts(parts => [ ...parts, newPart ]);
				handleLevelDirective(newPart.uid);
				break;
			}
			case 'placement': {
				setLevelYielding('placement');
				break;
			}
			case 'blueprints': {
				setBlueprintsLevel(directive.level);
				handleLevelDirective();
				break;
			}
			case 'action': {
				switch (directive.action) {
					case 'lock_all': {
						setParts(parts => {
							const newParts = parts.map(p => ({ ...p, immobile: true }));
							console.log(newParts);
							return newParts;
						});
						break;
					}
					case 'show_phone':
						setPhoneVisible(true);
						break;
					case 'hide_phone':
						setPhoneVisible('out');
						setTimeout(() => setPhoneVisible(false), 200);
						break;
					case 'remove_all':
						setParts([]);
						setMovingPart(null);
						break;
				}
				setTimeout(() => handleLevelDirective());
				break;
			}
		}
	}

	useEffect(() => handleLevelDirective(), [ props.level ]);

	useEffect(() => {
		const resizeCallback = () => {
			setScreenSize([ window.innerWidth, window.innerHeight ]);
			window.addEventListener('resize', resizeCallback);
			return () => window.removeEventListener('resize', resizeCallback);
		}
	}, []);

	useEffect(() => {
		const mouseMoveCallback = (evt: MouseEvent) => {
			const canvasLeft = window.innerWidth / 2 - SCREEN_WIDTH * pixelScale / 2;
			const canvasTop = window.innerHeight / 2 - SCREEN_HEIGHT * pixelScale / 2;

			mousePos.current[0] = Math.floor((evt.clientX - canvasLeft) / pixelScale);
			mousePos.current[1] = Math.floor((evt.clientY - canvasTop) / pixelScale);

			if (movingPart?.ref) {
				const partX = mousePos.current[0] - movingPart.mouseOffset[0];
				const partY = mousePos.current[1] - movingPart.mouseOffset[1];

				movingPart.ref.style.top = `${partY}px`;
				movingPart.ref.style.left = `${partX}px`;

				const partCellX = Math.round((partX - phoneX) / CELL_SIZE);
				const partCellY = Math.round((partY - phoneY) / CELL_SIZE);

				setMovingPart((movingPart) => {
					const shouldRemove = (blueprintsLevel >= 0) &&
						(evt.clientX - (movingPart!.mouseOffset[0] * pixelScale / 2) < 116 * pixelScale);
					if (shouldRemove !== movingPart?.willRemove) return { ...movingPart!, willRemove: shouldRemove };
					return movingPart;
				});

				if (partCellX != movingPart.part.pos[0] || partCellY != movingPart.part.pos[1]) {
					const newParts = [ ...parts ];
					movingPart.part.pos = [ partCellX, partCellY ];
					setParts(newParts);
				}
			}
		}

		window.addEventListener('mousemove', mouseMoveCallback);
		return () => window.removeEventListener('mousemove', mouseMoveCallback);
	}, [ movingPart, pixelScale ]);

	function handleSpawn(evt: MouseEvent, part: PartDef) {
		const canvasLeft = window.innerWidth / 2 - SCREEN_WIDTH * pixelScale / 2;
		const canvasTop = window.innerHeight / 2 - SCREEN_HEIGHT * pixelScale / 2;
		const mouseX = Math.floor((evt.clientX - canvasLeft) / pixelScale);
		const mouseY = Math.floor((evt.clientY - canvasTop) / pixelScale);
		const coordX = Math.round((mouseX - phoneX) / CELL_SIZE - part.bounds[0].length / 2);
		const coordY = Math.round((mouseY - phoneY) / CELL_SIZE - part.bounds.length / 2);

		const newPart: PartProps = {
			...part,
			pos: [ coordX, coordY ],
			orientation: 0,
			uid: Date.now().toString(),
			state: 'dragging',
		};

		let ind = 0;
		setParts(parts => {
			ind = parts.length;
			return [ ...parts, newPart ];
		});

		handleMoveStart(evt, newPart, ind, true);
	}

	function handleMoveStart(evt: MouseEvent, part: PartProps, ind: number, spawn: boolean) {
		const partStartX = phoneX + part.pos[0] * CELL_SIZE;
		const partStartY = phoneY + part.pos[1] * CELL_SIZE;
		const canvasLeft = window.innerWidth / 2 - SCREEN_WIDTH * pixelScale / 2;
		const canvasTop = window.innerHeight / 2 - SCREEN_HEIGHT * pixelScale / 2;
		const mouseX = Math.floor((evt.clientX - canvasLeft) / pixelScale);
		const mouseY = Math.floor((evt.clientY - canvasTop) / pixelScale);
		const diffX = -(partStartX - mouseX);
		const diffY = -(partStartY - mouseY);

		const newParts = [ ...parts ];
		newParts[ind] = { ...part, state: 'dragging' };
		setParts(newParts);

		setMovingPart({
			part: newParts[ind],
			ind,
			mouseOffset: [ diffX, diffY ],
			ref: null as any,
			willRemove: spawn
		});
	}

	function handleMoveEnd() {
		setMovingPart((movingPart) => {
			setParts((parts) => {
				let newParts: PartProps[] = [];

				const queue: PartProps[] = [];
				const closed = new Set<PartProps>();

				for (let part of parts) {
					if (movingPart?.willRemove && part === movingPart.part) continue;
					const isCPU = part.type === 'cpu';
					const newPart: PartProps = { ...part, state: isCPU || (part.connectors ?? []).length === 0
						? 'valid' : 'disconnected' };
					newParts.push(newPart);
					if (isCPU) queue.push(newPart);
				}

				for (let part of newParts) {
					for (let x = 0; x < part.bounds[0].length; x++) {
						if (part.state === 'out-of-bounds') break;
						for (let y = 0; y < part.bounds.length; y++) {
							let bound = part.bounds[y][x];
							let outOfBounds = (part.pos[0] + x) < 0 || (part.pos[1] + y) < 0 ||
								(part.pos[0] + x) >= phoneSize![0] || (part.pos[1] + y) >= phoneSize![1];

							if ((bound === B.Outside && !outOfBounds) || (bound !== B.Outside && outOfBounds)) {
								part.state = 'out-of-bounds';
								break;
							}
						}
					}

				}

				for (let i = 0; i < newParts.length; i++) {
					let part = newParts[i];

					for (let j = 0; j < i; j++) {
						if (part.state == 'invalid') break;
						let other = newParts[j];

						for (let posY = 0; posY < part.bounds.length; posY++) {
							if (part.state == 'invalid') break;
							let otherPosY = part.pos[1] + posY - other.pos[1];
							for (let posX = 0; posX < part.bounds[0].length; posX++) {
								let otherPosX = part.pos[0] + posX - other.pos[0];
								if (part.bounds[posY][posX] === B.Transparent) continue;
								if (otherPosY < 0 || otherPosY >= other.bounds.length || otherPosX < 0 || otherPosX >= other.bounds[0].length) continue;
								if (other.bounds[otherPosY][otherPosX] != B.Transparent) {
									part.state = 'invalid';
									break;
								}
							}
						}
					}
				}

				while (queue.length) {
					const part = queue.shift()!;
					closed.add(part);
					if (part.state !== 'valid') continue;


					for (const connection of (part.connectors ?? [])) {
						const otherConnectorWorld = [
							part.pos[0] + connection[0] + positionOffsets[connection[2]][0],
							part.pos[1] + connection[1] + positionOffsets[connection[2]][1],
							(connection[2] + 2) % 4
						];

						for (const other of newParts) {
							if (closed.has(other) || other.state !== 'disconnected') continue;

							for (const otherConnection of (other.connectors ?? [])) {
								if (otherConnection[0] + other.pos[0] === otherConnectorWorld[0] &&
									otherConnection[1] + other.pos[1] === otherConnectorWorld[1] &&
									otherConnection[2] === otherConnectorWorld[2]) {

									other.state = 'valid';
									closed.add(other);
									queue.push(other);
									break;
								}
							}
						}
					}
				}

				if (levelYielding === 'placement') {
					setLevelYielding(null);
					if (movingPart?.willRemove) setTimeout(() => handleLevelDirective({ ...movingPart.part, state: 'removed' }));
					else setTimeout(() => handleLevelDirective({ ...newParts[movingPart!.ind] }));
				}

				return newParts;
			});

			return null;
		})
	}

	function handleRotate(ind: number) {
		setParts(parts => {
			const newParts = [ ...parts ];
			const part = newParts[ind];

			rotatePart(part, (part.orientation + 1) % 4);

			return newParts;
		});
	}

	function handleCloseDialog(key?: string) {
		setMessages([]);
		setAnswers(undefined);
		handleLevelDirective(key);
	}

	const phoneX = phoneSize ? SCREEN_WIDTH / 2 - (phoneSize[0] * CELL_SIZE / 2) : 0;
	const phoneY = phoneSize ? SCREEN_HEIGHT / 2 - (phoneSize[1] * CELL_SIZE / 2) : 0;

	const totalPrice = parts.reduce((price, part) => price + part.price, 0);

	return (
		<div class='absolute left-1/2 top-1/2 w-[640px] h-[360px]' style={{
			transform: `translate(-50%, -50%) scale(${pixelScale * 100}%)` }}>


			<img src={img_desk_background} class='absolute pointer-events-none'/>

			<Status pixelScale={pixelScale} price={totalPrice} budget={300} timeLeft={2 * 60 + 10}/>
			<Landline pixelScale={pixelScale}/>

			<PartSpawner
				pixelScale={pixelScale}
				level={blueprintsLevel}
				onMoveStart={handleSpawn}
				onMoveEnd={handleMoveEnd}
				onRotate={() => {
					setMovingPart(part => {
						console.log(part);
						handleRotate(part!.ind)
						return part;
					});
				}}
			/>

			{phoneSize && <Fragment>
				<Phone
					class={classes('absolute', phoneVisible === true ? 'animate-slide-in' : phoneVisible === false ? 'hidden' : 'animate-slide-out')}
					style={{ left: phoneX, top: phoneY }}
					gridWidth={phoneSize[0]}
					gridHeight={phoneSize[1]}
				/>

				{parts.map((part, i) =>
					<Part
						key={part.type + '$$$' + part.model + '$$$' + part.uid}
						class={classes(phoneVisible === true ? 'animate-slide-in-fast' : phoneVisible === false ? 'hidden' : 'animate-slide-out')}
						phoneX={phoneX}
						phoneY={phoneY}
						style={{ opacity: (part === movingPart?.part && movingPart.willRemove) ? 0 : undefined }}
						onMoveStart={(evt) => handleMoveStart(evt, part, i, false)}
						onMoveEnd={() => handleMoveEnd()}
						onRotate={movingPart ? undefined : () => handleRotate(i)}
						{...part}
					/>
				)}

				{movingPart && <Part
					key='moving'
					setRef={(elem) => movingPart.ref = elem}
					phoneX={0}
					phoneY={0}
					{...movingPart.part}
					state={movingPart.willRemove ? 'remove-indicator' : 'drag-indicator'}
					style={{
						zIndex: 200,
						top: `${mousePos.current[1] - movingPart.mouseOffset[1]}px`,
						left: `${mousePos.current[0] - movingPart.mouseOffset[0]}px`
					}}
				/>}
			</Fragment>}

			{messages.length > 0 && <DialogManager
				pixelScale={pixelScale}
				messages={messages}
				answers={answers}
				onClose={(key) => handleCloseDialog(key)}
			/>}
		</div>
	);
}

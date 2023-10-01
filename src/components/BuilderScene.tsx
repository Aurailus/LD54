import { Fragment, h } from 'preact';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';

import img_desk_background from '@res/desk_background.png';
import img_desk_landline from '@res/desk_landline.png';
import Phone from './Phone';
import { SCREEN_HEIGHT, SCREEN_WIDTH, CELL_SIZE } from '../Constants';
import { PART_REGISTRY, PartDef, PartBound as B, PartType, PART_TYPE_META } from '../Parts';
import Part, { PartProps } from './Part';
import PartSpawner from './PartSpawner';
import DialogManager from './DialogManager';
import Status from './Alarm';
import Landline from './Landline';
import { CompletionRequirement, Level, LevelDirective, YieldType } from '../levels/Level';
import { classes } from '../Util';
import { Score } from './App';

interface MovingPart {
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
	pixelScale: number;
	onComplete: (score: Score) => void;
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
	const [ ringing, setRinging ] = useState<boolean>(false);
	const [ answers, setAnswers ] = useState<Record<string, string>>();
	const [ levelYielding, setLevelYielding ] = useState<YieldType[]>([]);
	const [ blueprintsLevel, setBlueprintsLevel ] = useState<number>(-1);
	const [ phoneSize, setPhoneSize ] = useState<[ number, number ] | null>(null);
	const [ parts, setParts ] = useState<PartProps[]>([]);
	const [ expectedScore, setExpectedScore ] = useState<number>(0);
	const [ phoneVisible, setPhoneVisible ] = useState<boolean | 'out'>();
	const [ completionRequirements, setCompletionRequirements ] = useState<[ CompletionRequirement, number | string, boolean ][]>(
		[ [ 'fail', 0, false ] ]);

	const timeLimit = (completionRequirements.find(c => c[0] === 'time_limit') ?? [ 0, -1 ,0 ])[1] as number;
	const budgetLimit = (completionRequirements.find(c => c[0] === 'budget_limit') ?? [ 0, -1 ,0 ])[1] as number;

	const [ timeLeft, setTimeLeft ] = useState<number>(0);
	useLayoutEffect(() => setTimeLeft(timeLimit), [ timeLimit ]);

	useEffect(() => {
		if (timeLimit === -1 || messages.length > 0) return;
		const interval = setInterval(() => {
			setTimeLeft(timeLeft => {
				if (timeLeft === 1) {
					setCompletionRequirements((completionRequirements) => {
						const newCompletionRequirements = [ ...completionRequirements];
						let timeLimitReq = newCompletionRequirements.find(r => r[0] === 'time_limit');
						if (timeLimitReq) {
							timeLimitReq[2] = false;
							if (levelYielding.includes('time')) handleLevelDirective({ type: 'time' });
							return newCompletionRequirements;
						}
						return completionRequirements;
					})
				}
				return Math.max(timeLeft - 1, 0)
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [ timeLimit, messages ]);

	const [ movingPart, setMovingPart ] = useState<MovingPart | null>(null);
	const mousePos = useRef<[ number, number ]>([ 0, 0 ]);

	const getScore = useCallback((): Score => {
		let score = Object.entries(PART_TYPE_META).map(([ type, meta ]) => {
			const partsInCategory = parts.filter(part => part.type === type && part.state === 'valid');
			if (partsInCategory.length === 0) return 0;
			const score =
				meta.scoring === 'avg' ? partsInCategory.reduce((count, part) => count + part.score, 0) / Math.max(partsInCategory.length, 1)
				: meta.scoring === 'max' ? Math.max(...partsInCategory.map(part => part.score))
				: Math.min(...partsInCategory.map(part => part.score));
			return score;
		}).reduce((a, b) => a + b, 0);
		let scoreRatio = score / expectedScore;
		return {
			score: score,
			budget: budgetLimit,
			grade: scoreRatio >= 1.2 ? 'S' : scoreRatio >= 1.15 ? 'A' : scoreRatio >= 1.1 ? 'B' : scoreRatio >= 1.05 ? 'C' : scoreRatio >= 1 ? 'D' : 'F'
		}
	}, [ expectedScore, budgetLimit, parts ]);

	const handleLevelDirective = useCallback((ret?: any) => {
		let { value: directive, done } = props.level.next(ret);

		if (done) {
			props.onComplete(getScore());
			return;
		}

		if (!directive) return;

		switch (directive.type) {
			case 'message': {
				setMessages(directive.messages);
				setAnswers(directive.answers);
				setRinging(directive.ringing ?? false);
				break;
			}
			case 'delay': {
				setTimeout(() => handleLevelDirective(), directive.time * 1000);
				break;
			}
			case 'score_min': {
				setExpectedScore(directive.score);
				handleLevelDirective();
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
			case 'wait': {
				setLevelYielding(directive.until);
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
						setMovingPart(null);
						setParts([]);
						break;
				}
				setTimeout(() => handleLevelDirective());
				break;
			}
			case 'completion_requirements': {
				setCompletionRequirements(directive.requirements.map(r => [ r[0], r[1], false ]));
				handleLevelDirective();
				break;
			}
		}
	}, [ props.level, getScore ]);

	function handleShip() {
		setPhoneVisible('out');
		setTimeout(() => setPhoneVisible(false), 200);
		if (levelYielding.includes('ship')) handleLevelDirective({ type: 'ship', value: getScore() });
	}

	useEffect(() => handleLevelDirective(), [ props.level ]);

	useEffect(() => {
		const resizeCallback = () => {
			setScreenSize([ window.innerWidth, window.innerHeight ]);
			window.addEventListener('resize', resizeCallback);
			return () => window.removeEventListener('resize', resizeCallback);
		}
	}, []);

	function handleClickPhone() {
		if (ringing) setRinging(false);
		else if (levelYielding.includes('call')) handleLevelDirective({ type: 'call' });
	}

	useEffect(() => {
		const mouseMoveCallback = (evt: MouseEvent) => {
			const canvasLeft = window.innerWidth / 2 - SCREEN_WIDTH * props.pixelScale / 2;
			const canvasTop = window.innerHeight / 2 - SCREEN_HEIGHT * props.pixelScale / 2;

			mousePos.current[0] = Math.floor((evt.clientX - canvasLeft) / props.pixelScale);
			mousePos.current[1] = Math.floor((evt.clientY - canvasTop) / props.pixelScale);

			if (movingPart?.ref) {
				const partX = mousePos.current[0] - movingPart.mouseOffset[0];
				const partY = mousePos.current[1] - movingPart.mouseOffset[1];

				movingPart.ref.style.top = `${partY}px`;
				movingPart.ref.style.left = `${partX}px`;

				const partCellX = Math.round((partX - phoneX) / CELL_SIZE);
				const partCellY = Math.round((partY - phoneY) / CELL_SIZE);

				setMovingPart((movingPart) => {
					const shouldRemove = (blueprintsLevel >= 0) &&
						(evt.clientX - (movingPart!.mouseOffset[0] * props.pixelScale / 2) < 116 * props.pixelScale);
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
	}, [ movingPart, props.pixelScale ]);

	function handleSpawn(evt: MouseEvent, part: PartDef) {
		const canvasLeft = window.innerWidth / 2 - SCREEN_WIDTH * props.pixelScale / 2;
		const canvasTop = window.innerHeight / 2 - SCREEN_HEIGHT * props.pixelScale / 2;
		const mouseX = Math.floor((evt.clientX - canvasLeft) / props.pixelScale);
		const mouseY = Math.floor((evt.clientY - canvasTop) / props.pixelScale);
		const coordX = Math.round((mouseX - phoneX) / CELL_SIZE - part.bounds[0].length / 2);
		const coordY = Math.round((mouseY - phoneY) / CELL_SIZE - part.bounds.length / 2);

		const newPart: PartProps = {
			...part,
			pos: [ coordX, coordY ],
			orientation: 0,
			uid: Date.now().toString(),
			state: 'dragging',
		};

		// setParts(parts => [ ...parts, newPart ]);
		handleMoveStart(evt, newPart, true);
	}

	function handleMoveStart(evt: MouseEvent, part: PartProps, spawn: boolean) {
		const partStartX = phoneX + part.pos[0] * CELL_SIZE;
		const partStartY = phoneY + part.pos[1] * CELL_SIZE;
		const canvasLeft = window.innerWidth / 2 - SCREEN_WIDTH * props.pixelScale / 2;
		const canvasTop = window.innerHeight / 2 - SCREEN_HEIGHT * props.pixelScale / 2;
		const mouseX = Math.floor((evt.clientX - canvasLeft) / props.pixelScale);
		const mouseY = Math.floor((evt.clientY - canvasTop) / props.pixelScale);
		const diffX = -(partStartX - mouseX);
		const diffY = -(partStartY - mouseY);

		const newParts = [ ...parts ];
		let partInd = newParts.findIndex(o => o.uid === part.uid);
		if (partInd === -1) partInd = newParts.length;
		newParts[partInd] = { ...part, state: 'dragging' };
		setParts(newParts);

		setMovingPart({
			part: newParts[partInd],
			mouseOffset: [ diffX, diffY ],
			ref: null as any,
			willRemove: spawn
		});
	}

	const totalPrice = parts.reduce((price, part) => price + part.price, 0);

	const updatePartStatesAndCompletion = useCallback(() => {

		/**
		 * Update Part States, find if anything is invalid
		 */

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

		/** Identify if level can be completed */

		const newCompletionRequirements: [ CompletionRequirement, number | string, boolean ][]
			= completionRequirements.map(([ req, val ]) => [ req, val, false ]);

		for (let req of newCompletionRequirements) {
			switch (req[0]) {
				default:
					throw new Error('Unhandled completion requirement \'' + req + '\'.');
					break;
				case 'fail':
					req[2] = false;
					break;
				case 'all_valid':
					req[2] = !newParts.find(part => part.state !== 'valid');
					break;
				case 'budget_limit':
					req[2] = ((newParts.reduce((price, part) => price + part.price, 0)) <= (req[1] as number))
					break;
				case 'time_limit':
					req[2] = timeLeft > 0;
					break;
				case 'has_power':
				case 'has_storage':
				case 'has_battery':
				case 'has_input':
				case 'has_power':
				case 'has_misc':
				case 'has_camera':
				case 'has_cpu': {
					const type = req[0].substring(4);
					if (typeof req[1] === 'string') req[2] = !!newParts.find(part => part.type === type && part.model === req[1]);
					else if (typeof req[1] === 'number' && req[1] > 0) req[2] = !!newParts.find(part => part.type === type && part.score >= (req[1] as number));
					else req[2] = !!newParts.find(part => part.type === type);
					break;
				}
			}
		}

		if (movingPart) {
			setLevelYielding((levelYielding) => {
				if (!levelYielding.includes('placement')) return levelYielding;
				setTimeout(() => {
					let newPart = newParts.find(p => p.uid === movingPart!.part.uid);
					if (movingPart?.willRemove) newPart = { ...movingPart.part, state: 'removed' as any };
					if (!newPart) console.trace('MISSING PART');
					handleLevelDirective({ type: 'placement', part: newPart, completionRequirements: newCompletionRequirements });
				})
				return [];
			});

		}

		setParts(newParts);
		setMovingPart(null);

		if (!!newCompletionRequirements.find((val, ind) => completionRequirements[ind][2] !== val[2]))		setCompletionRequirements(newCompletionRequirements);

		console.warn('invalid states', newCompletionRequirements.filter(c => c[2] == false).map(c => `${c[0]}: ${c[1]}`));
	}, [ movingPart, parts, handleLevelDirective, timeLeft ]);

	useLayoutEffect(() => updatePartStatesAndCompletion(), [ completionRequirements ]);

	const handleMoveEnd = useCallback(() => {
		updatePartStatesAndCompletion();
		setMovingPart(null);
	}, [ updatePartStatesAndCompletion, totalPrice ]);


	const handleRotate = useCallback((uid: string) => {
		setParts(parts => {
			const newParts = [ ...parts ];
			const part = newParts.find(part => part.uid === uid);
			if (!part) return parts;
			rotatePart(part, (part.orientation + 1) % 4);
			return newParts;
		});
	}, []);

	const rotateMovingPart = useCallback(() => setMovingPart(part => {
		handleRotate(part!.part.uid)
		return part;
	}), [ handleRotate ]);

	function handleCloseDialog(key?: string) {
		setMessages([]);
		setAnswers(undefined);
		handleLevelDirective(key);
	}

	const phoneX = phoneSize ? SCREEN_WIDTH / 2 - (phoneSize[0] * CELL_SIZE / 2) : 0;
	const phoneY = phoneSize ? SCREEN_HEIGHT / 2 - (phoneSize[1] * CELL_SIZE / 2) : 0;

	const hasAtleastOne = parts.map(p => p.type);
	const highlightCategories = completionRequirements.filter(c => c[0].startsWith('has_') && !c[2]).map(c => c[0].substring(4)) as PartType[];

	return (
		<div class='absolute left-1/2 top-1/2 w-[640px] h-[360px]'
		 	style={{ transform: `translate(-50%, -50%) scale(${props.pixelScale * 100}%)` }}
			onContextMenu={movingPart ? rotateMovingPart : undefined}
			>

			<img src={img_desk_background} class='absolute pointer-events-none'/>

			<Status
				pixelScale={props.pixelScale}
				price={totalPrice}
				budget={budgetLimit}
				timeLeft={timeLeft}
				canShip={completionRequirements.findIndex(r => r[2] === false) === -1}
				onShip={handleShip}
			/>

			<Landline
				pixelScale={props.pixelScale}
				ringing={ringing}
				onClick={handleClickPhone}
			/>

			<PartSpawner
				pixelScale={props.pixelScale}
				level={blueprintsLevel}
				onMoveStart={handleSpawn}
				onMoveEnd={handleMoveEnd}
				hasAtleastOne={hasAtleastOne}
				highlightCategories={highlightCategories}
				// onRotate={rotateMovingPart}
			/>

			{phoneSize && <Fragment>
				<Phone
					class={classes('absolute', phoneVisible === true ? 'animate-slide-in' : phoneVisible === false ? 'hidden' : 'animate-slide-out')}
					style={{ left: phoneX, top: phoneY }}
					gridWidth={phoneSize[0]}
					gridHeight={phoneSize[1]}
				/>

				{parts.map((part) =>
					<Part
						key={part.type + '$$$' + part.model + '$$$' + part.uid}
						class={classes(phoneVisible === true ? 'animate-slide-in-fast' : phoneVisible === false ? 'hidden' : 'animate-slide-out')}
						phoneX={phoneX}
						phoneY={phoneY}
						style={{ opacity: (part === movingPart?.part && movingPart.willRemove) ? 0 : undefined }}
						onMoveStart={(evt) => handleMoveStart(evt, part, false)}
						onMoveEnd={handleMoveEnd}
						onRotate={movingPart ? undefined : handleRotate}
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

			{messages.length > 0 && !ringing && <DialogManager
				pixelScale={props.pixelScale}
				messages={messages}
				answers={answers}
				onClose={(key) => handleCloseDialog(key)}
			/>}
		</div>
	);
}

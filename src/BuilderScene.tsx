import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import img_desk_background from '@res/desk_background.png';
import img_desk_alarm from '@res/desk_alarm.png';
import img_desk_landline from '@res/desk_landline.png';
import img_part_headphone from '@res/part_headphone.png';
import img_part_cpu from '@res/part_gpu.png';
import img_part_connector from '@res/part_connector.png';
import img_part_camera from '@res/part_camera.png';
import img_part_battery from '@res/part_battery.png';
import img_part_nvme_large from '@res/part_nvme_large.png';
import img_part_nvme_small from '@res/part_nvme_small.png';
import img_part_volume from '@res/part_volume.png';
import img_part_power from '@res/part_power.png';

import Phone from './Phone';
import { SCREEN_HEIGHT, SCREEN_WIDTH, CELL_SIZE } from './Constants';
import Part, { PartDef, PartProps } from './Part';
// import img_desk_phone from '@res/desk_phone.png';

interface BuildState {
	gridWidth: number;
	gridHeight: number;
}

interface MovingPart {
	ind: number;
	part: PartProps;
	ref: HTMLElement;
	mouseOffset: [ number, number ];
}

const positionOffsets = [
	[ 0, -1 ],
	[ 1, 0 ],
	[ 0, 1 ],
	[ -1, 0 ]
];

const batteryPart: PartDef = {
	img: img_part_battery,
	size: [
		[ true, true, true ],
		[ true, true, true ],
		[ true, true, true ],
		[ true, true, true ]
	],
	connectors: [ [ 0, 0, 0 ] ],
	model: 'BAT 3000 mah',
	type: 'battery',
}

const nvmeLargePart: PartDef = {
	img: img_part_nvme_large,
	size: [
		[ true, true, true ]
	],
	connectors: [ [ 2, 0, 1 ] ],
	model: 'Supr NVMe SSD 512GB',
	type: 'storage',
}

const nvmeSmallPart: PartDef = {
	img: img_part_nvme_small,
	size: [
		[ true, true ]
	],
	connectors: [ [ 1, 0, 1 ] ],
	model: 'Supr NVMe SSD 256GB',
	type: 'storage',
}

const volumePart: PartDef = {
	img: img_part_volume,
	size: [
		[ true, true ],
		[ true, true ]
	],
	connectors: [ [ 1, 0, 0 ], [ 1, 1, 1 ] ],
	model: 'Volume Rocker',
	type: 'input',
}

const powerPart: PartDef = {
	img: img_part_power,
	size: [
		[ true, true ]
	],
	connectors: [ [ 1, 0, 2 ] ],
	model: 'Power Button',
	type: 'input',
}

const cameraPart: PartDef = {
	img: img_part_camera,
	size: [
		[ true, true ],
		[ true, true ]
	],
	connectors: [ [ 1, 0, 1 ], [ 0, 1, 3 ] ],
	model: 'Di-cam Super 64 MB',
	type: 'camera',
}

const cpuPart: PartDef = {
	img: img_part_cpu,
	size: [
		[ true, true ],
		[ true, true ],
	],
	connectors: [
		[ 0, 0, 0 ],
		[ 1, 0, 0 ],
		[ 1, 0, 1 ],
		[ 1, 1, 1 ],
		[ 0, 1, 2 ],
		[ 1, 1, 2 ],
		[ 0, 0, 3 ],
		[ 0, 1, 3 ],
	],
	model: 'Qube NX-01',
	type: 'cpu',
}

export default function BuilderScene() {
	const [ [ screenWidth, screenHeight ], setScreenSize ] =
		useState<[ number, number ]>([ window.innerWidth, window.innerHeight ]);

	const [ buildState, setBuildState ] = useState<BuildState>({
		gridWidth: 5,
		gridHeight: 8
	});

	const [ parts, setParts ] = useState<PartProps[]>([
		{
			...cpuPart,
			orientation: 0,
			pos: [ 1, 1 ],
			state: 'valid'
		},
		{
			...batteryPart,
			orientation: 0,
			pos: [ 3, 2 ],
			state: 'disconnected'
		},
		{
			...cameraPart,
			orientation: 0,
			pos: [ 1, 5 ],
			state: 'disconnected'
		},
		{
			...powerPart,
			orientation: 0,
			pos: [ -1, 0 ],
			state: 'disconnected'
		},
		{
			...volumePart,
			orientation: 0,
			pos: [ -1, 1 ],
			state: 'disconnected'
		},
		{
			...nvmeLargePart,
			orientation: 0,
			pos: [ 3, 5 ],
			state: 'disconnected'
		},
		{
			...nvmeSmallPart,
			orientation: 0,
			pos: [ 3, 6 ],
			state: 'disconnected'
		},
		// {
		// 	type: 'storage',
		// 	connectors: [
		// 		[ 0, 0, 0 ],
		// 		[ 1, 0, 2 ]
		// 	],
		// 	img: img_part_connector,
		// 	model: '',
		// 	orientation: 0,
		// 	pos: [ 2, 5 ],
		// 	size: [
		// 		[ true, true ]
		// 	],
		// 	state: 'disconnected'
		// },
		// {
		// 	type: 'storage',
		// 	connectors: [
		// 		[ 2, 2, 0 ],
		// 	],
		// 	img: img_part_battery,
		// 	model: '',
		// 	orientation: 0,
		// 	pos: [ 6, 6 ],
		// 	size: [
		// 		[ true, true, false ],
		// 		[ true, true, false ],
		// 		[ true, true, true ]
		// 	],
		// 	state: 'disconnected'
		// },
		// {
		// 	type: 'storage',
		// 	connectors: [
		// 		[ 0, 0, 0 ],
		// 		[ 1, 0, 2 ]
		// 	],
		// 	img: img_part_connector,
		// 	model: '',
		// 	orientation: 0,
		// 	pos: [ 2, 7 ],
		// 	size: [
		// 		[ true, true ]
		// 	],
		// 	state: 'disconnected'
		// },
		// {
		// 	type: 'storage',
		// 	connectors: [
		// 		[ 0, 0, 0 ]
		// 	],
		// 	img: img_part_headphone,
		// 	model: '',
		// 	orientation: 0,
		// 	pos: [ 3, 7 ],
		// 	size: [
		// 		[ true, true ]
		// 	],
		// 	state: 'disconnected'
		// }
	]);

	const [ movingPart, setMovingPart ] = useState<MovingPart | null>(null);
	const mousePos = useRef<[ number, number ]>([ 0, 0 ]);

	const pixelScale = 3;

	useEffect(() => {
		const resizeCallback = () => {
			setScreenSize([ window.innerWidth, window.innerHeight ]);
			window.addEventListener('resize', resizeCallback);
			return () => window.removeEventListener('resize', resizeCallback);
		}
	}, []);

	// useEffect(() => {
	// 	const rightClickCallback = (evt: MouseEvent) => {
	// 		evt.preventDefault();
	// 		evt.stopPropagation();
	// 	}

	// 	window.addEventListener('contextmenu', rightClickCallback);
	// 	return () => window.removeEventListener('contextmenu', rightClickCallback);
	// }, []);

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

				if (partCellX != movingPart.part.pos[0] || partCellY != movingPart.part.pos[1]) {
					const newParts = [ ...parts ];
					movingPart.part.pos = [ partCellX, partCellY ];
					setParts(newParts);
				}
			}
		}

		window.addEventListener('mousemove', mouseMoveCallback);
		return () => window.removeEventListener('mousemove', mouseMoveCallback);
	}, [ movingPart ]);

	function handleMoveStart(evt: MouseEvent, part: PartProps, ind: number) {
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
			ref: null as any
		});
	}

	function handleMoveEnd() {
		setMovingPart(_ => {
			setParts((parts) => {
				let newParts: PartProps[] = [];

				const queue: PartProps[] = [];
				const closed = new Set<PartProps>();

				for (let part of parts) {
					const isCPU = part.type === 'cpu';
					const newPart: PartProps = { ...part, state: isCPU ? 'valid' : 'disconnected' };
					newParts.push(newPart);
					if (isCPU) queue.push(newPart);
				}

				for (let part of newParts) {
					if (part.pos[0] < 0 || part.pos[1] < 0 || part.pos[0] + part.size[0].length > buildState.gridWidth ||
						part.pos[1] + part.size.length > buildState.gridHeight) {
						part.state = 'out-of-bounds';
					}
				}

				for (let i = 0; i < newParts.length; i++) {
					let part = newParts[i];

					for (let j = 0; j < i; j++) {
						if (part.state == 'invalid') break;
						let other = newParts[j];

						for (let posY = 0; posY < part.size.length; posY++) {
							if (part.state == 'invalid') break;
							let otherPosY = part.pos[1] + posY - other.pos[1];
							for (let posX = 0; posX < part.size[0].length; posX++) {
								let otherPosX = part.pos[0] + posX - other.pos[0];
								if (!part.size[posY][posX]) continue;
								if (otherPosY < 0 || otherPosY >= other.size.length || otherPosX < 0 || otherPosX >= other.size[0].length) continue;
								if (other.size[otherPosY][otherPosX]) {
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


					for (const connection of part.connectors) {
						const otherConnectorWorld = [
							part.pos[0] + connection[0] + positionOffsets[connection[2]][0],
							part.pos[1] + connection[1] + positionOffsets[connection[2]][1],
							(connection[2] + 2) % 4
						];

						for (const other of newParts) {
							if (closed.has(other) || other.state !== 'disconnected') continue;

							for (const otherConnection of other.connectors) {
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

				return newParts;
			});



			return null;
		})
	}

	function handleRotate(ind: number) {
		setParts(parts => {
			const newParts = [ ...parts ];
			const part = newParts[ind];

			part.orientation = (part.orientation + 1) % 4;

			const newSize: boolean[][] = [];
			for (let i = 0; i < part.size[0].length; i++) {
				const newArr: boolean[] = [];
				for (let j = 0; j < part.size.length; j++) newArr[j] = false;
				newSize[i] = newArr;
			}
			for (let i = 0; i < part.size.length; i++) {
				for (let j = 0; j < part.size[0].length; j++) {
					newSize[j][newSize[0].length - 1 - i] = part.size[i][j];
				}
			}
			part.size = newSize;

			const newConnectors: [ number, number, number ][] = [];
			for (let connecter of part.connectors) {
				newConnectors.push([ newSize[0].length - 1 - connecter[1], connecter[0], (connecter[2] + 1) % 4 ]);
			}
			part.connectors = newConnectors;

			return newParts;
		});
	}

	const phoneX = SCREEN_WIDTH / 2 - (buildState.gridWidth * CELL_SIZE / 2);
	const phoneY = SCREEN_HEIGHT / 2 - (buildState.gridHeight * CELL_SIZE / 2);

	return (
		<div class='absolute left-1/2 top-1/2 w-[640px] h-[360px]' style={{
			transform: `translate(-50%, -50%) scale(${pixelScale * 100}%)` }}>

			<img src={img_desk_background} class='absolute'/>
			<img src={img_desk_alarm} class='absolute'/>
			<img src={img_desk_landline} class='absolute'/>

			<Phone
				class='absolute'
				style={{ left: phoneX, top: phoneY }}
				gridWidth={buildState.gridWidth}
				gridHeight={buildState.gridHeight}
			/>

			{parts.map((part, i) =>
				<Part
					key={part.type + '$$$' + part.model}
					phoneX={phoneX}
					phoneY={phoneY}
					onMoveStart={(evt) => handleMoveStart(evt, part, i)}
					onMoveEnd={() => handleMoveEnd()}
					onRotate={() => handleRotate(i)}
					{...part}
				/>
			)}

			{movingPart && <Part
				key='moving'
				setRef={(elem) => movingPart.ref = elem}
				phoneX={0}
				phoneY={0}
				{...movingPart.part}
				state='drag-indicator'
				style={{
					top: `${mousePos.current[1] - movingPart.mouseOffset[1]}px`,
					left: `${mousePos.current[0] - movingPart.mouseOffset[0]}px`
				}}
			/>}
		</div>
	);
}

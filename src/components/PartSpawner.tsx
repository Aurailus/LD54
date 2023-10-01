import { h } from 'preact';
import { useLayoutEffect, useState } from 'preact/hooks';

import { PART_REGISTRY, PART_TYPE_META, PartDef, PartType } from '../Parts';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../Constants';
import { classes } from '../Util';
import Part from './Part';

import img_blueprint_grid from '@res/blueprint_grid.png';

interface Props {
	level: number;
	pixelScale: number;

	onMoveStart: (evt: MouseEvent, part: PartDef) => void;
	onMoveEnd: () => void;
	// onRotate: () => void;
}

export default function PartSpawner(props: Props) {
	const [ selectedType, setSelectedType ] = useState<PartType>(Object.entries(PART_TYPE_META)[0][0] as PartType);

	useLayoutEffect(() => setSelectedType((Object.entries(PART_REGISTRY).find(([ type, def ]) => !!def.find(def => def.level <= props.level))?? [ 'cpu' ])[0] as PartType), [ props.level ]);

	const unmetRequirements: Record<string, any> = {
		// cpu: true,
		// storage: true,
		// camera: true,
		// battery: true,
		// misc: true
	}

	let active = props.level >= 0;

	return (
		<div
			class={classes('w-[116px] bg-[#556fcf] absolute z-[100] flex flex-col transition duration-200',
				active ? 'opacity-100' : 'opacity-0 -translate-x-[150%]')}
			style={{
				left: Math.floor((SCREEN_WIDTH / 2) - (window.innerWidth / props.pixelScale / 2)),
				top: Math.floor((SCREEN_HEIGHT / 2) - (window.innerHeight / props.pixelScale / 2)),
				height: Math.ceil(window.innerHeight / props.pixelScale),
				boxShadow: '0px 4px 16px 0px rgb(0 0 0 / 50%)'
			}}>
				<div class='flex justify-between flex-wrap gap-2 gap-y-1.5 w-full p-1 px-2 h-max shrink-0 border-b border-white/20'>
					{Object.entries(PART_TYPE_META).map(([ type, meta ]) =>
						<button
							title={type}
							key={type}
							class={classes(unmetRequirements[type]
									? selectedType === type
										? 'bg-[#FBF1E4] border-white'
										: 'bg-[#F0D1A7]/50 border-transparent'
									: selectedType === type
										? 'bg-[#98aeff] border-white'
										: 'bg-[#8ea3f1]/50 border-transparent',
								'w-4 h-4 p-0 box-content border',
								PART_REGISTRY[type as PartType].find(p => p.level <= props.level) ? '' : 'opacity-20 pointer-events-none')}
							onClick={() => setSelectedType(type as PartType)}
						>
							<img class={classes('w-full h-full pointer-events-none')}
								style={{ filter:
									unmetRequirements[type]
										?	type === selectedType
											? 'grayscale(100%) sepia(100%) hue-rotate(-6deg) saturate(1.6) contrast(0.9) brightness(2) saturate(.8)'
											: 'grayscale(100%) sepia(100%) hue-rotate(-6deg) saturate(1.6) contrast(0.9) brightness(1.5)'
										: type === selectedType
											? 'saturate(70%) contrast(0.8) brightness(175%)'
											: ''}}
								src={meta.icon}/>
						</button>
					)}
				</div>

				<div class='overflow-auto grow blueprint-scroll'>
					{PART_REGISTRY[selectedType].filter(part => part.level <= props.level).map((part, i) =>
						<div class='flex flex-col mb-2'>
							<div class='grow m-2 pr-3 mb-1'>
							{/* <p class='uppercase text-[5px] font-mono font-black text-blue-300 leading-none pb-px'>{part.type}</p> */}
								<p class='text-[8px] font-mono font-black text-white leading-[8px]'>{part.model}</p>
								<p class='text-[5px] pt-[4px] font-mono font-semibold text-blue-200 leading-[6px]'>{part.description}</p>
								<p class='uppercase text-[6px] font-mono font-black text-blue-100 leading-none pt-1'>
									COST:<span class='inline-block w-px'/>${part.price.toLocaleString('en-US',
										{ currency: 'CAD', maximumFractionDigits: 0, useGrouping: true })}
								</p>
							</div>
							<div class='w-[96px] relative m-2 mt-1.5 mb-4 shrink-0'>
								<Part
									{...part}
									orientation={0}
									phoneX={0} phoneY={0}
									pos={[ 0, 0 ]}
									state='blueprint'
									uid={i.toString()}
									onMoveStart={(evt) => props.onMoveStart(evt, part)}
									onMoveEnd={props.onMoveEnd}
									// onRotate={() => props.onRotate()}
								/>
								<div class='-top-1 -left-1 w-[calc(100%+1px+0.5rem)] h-[calc(100%+1px+0.5rem)] absolute opacity-25 pointer-events-none' style={{
									backgroundImage: `url(${img_blueprint_grid})`,
									backgroundPosition: '5px 5px'
								}}/>
							</div>

						</div>
					)}
				</div>



		</div>
	);
}

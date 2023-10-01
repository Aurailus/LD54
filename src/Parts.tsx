import img_part_cpu from '@res/part_gpu.png';
import img_part_camera from '@res/part_camera.png';
import img_part_camera_small from '@res/part_camera_small.png';
import img_part_battery from '@res/part_battery.png';
import img_part_battery_3000 from '@res/part_battery_3000.png';
import img_part_nvme_large from '@res/part_nvme_large.png';
import img_part_nvme_small from '@res/part_nvme_small.png';
import img_part_volume from '@res/part_volume.png';
import img_part_power from '@res/part_power.png';
import img_part_multi_jack from '@res/part_multi_jack.png';
import img_part_power_jack from '@res/part_power_jack.png';
import img_part_power_microusb from '@res/part_power_microusb.png';
import img_part_power_microusb_a from '@res/part_power_microusb_a.png';
import img_part_power_microusb_b from '@res/part_power_microusb_b.png';
import img_part_wire from '@res/part_wire.png';
import img_part_fingerprint_reader from '@res/part_fingerprint_reader.png';
import img_part_corner from '@res/part_corner.png';
import img_part_heatsink from '@res/part_heatsink.png';
import img_part_heatsink_side_a from '@res/part_heatsink_side_a.png';
import img_part_heatsink_side_b from '@res/part_heatsink_side_b.png';
import img_part_heatsink_side_c from '@res/part_heatsink_side_c.png';
import img_part_c from '@res/part_c.png';
import img_part_chip from '@res/part_chip.png';

import img_category_cpu from '@res/category_cpu.png';
import img_category_storage from '@res/category_storage.png';
import img_category_battery from '@res/category_battery.png';
import img_category_wire from '@res/category_wire.png';
import img_category_camera from '@res/category_camera.png';
import img_category_input from '@res/category_input.png';
import img_category_power from '@res/category_power.png';
import img_category_misc from '@res/category_misc.png';

export type PartType =
	'cpu' |
	'storage' |
	'battery' |
	'wire' |
	'camera' |
	'input' |
	'power' |
	'misc';

interface PartTypeMeta {
	multi: boolean;
	scoring: 'cumulative' | 'max' | 'avg';
	icon: string;
}

export const PART_TYPE_META: Record<PartType, PartTypeMeta> = {
	cpu: {
		multi: false,
		scoring: 'max',
		icon: img_category_cpu
	},
	storage: {
		multi: true,
		scoring: 'cumulative',
		icon: img_category_storage
	},
	battery: {
		multi: true,
		scoring: 'cumulative',
		icon: img_category_battery
	},
	wire: {
		multi: true,
		scoring: 'cumulative',
		icon: img_category_wire
	},
	camera: {
		multi: true,
		scoring: 'avg',
		icon: img_category_camera
	},
	input: {
		multi: true,
		scoring: 'cumulative',
		icon: img_category_input
	},
	power: {
		multi: false,
		scoring: 'max',
		icon: img_category_power
	},
	misc: {
		multi: true,
		scoring: 'cumulative',
		icon: img_category_misc
	}
};

/** Determines the behaviour of a cell of a part. */
export enum PartBound {
	/** Cannot overlap with other parts, must be in device bounds. */
	Solid,

	/** Cell is ignored, treated as if it is out of the part's bounds. */
	Transparent,

	/** Cell must be positioned on the outside of the phone. */
	Outside
}

export type PartConstraint = {
	type: 'adjacent',
	partType: PartType
} | {
	type: 'connected',
	partType: PartType
}

export interface PartDef {
	/** The type of part this is. */
	type: PartType;

	/** Unique model name for the part type. */
	model: string;

	/** The model's description. */
	description: string;

	/** The level that this part gets introduced at. */
	level: number;

	/** The (positive or negative) score value this part has. */
	score: number;

	/** The price of the component. */
	price: number;

	/** The image source for the part (if an array is specified, it is orientation-dependant.) */
	img: string | string[];

	/* 2d array of cells this part occupies, and their behaviour. */
	bounds: PartBound[][];

	/** Array of tuples where [0] = x, [1] = y, [2] = orientation */
	connectors?: [ number, number, number ][];

	/** Array of constraints that must be fulfilled for this part to be valid. */
	constraints?: PartConstraint[];
}

const B = PartBound;

/** Registry of all of the parts in the game, categorized by their type. */
export const PART_REGISTRY: Record<PartType, PartDef[]> = {
	cpu: [
		{
			type: 'cpu',
			model: 'Qube NX-01',
			description: 'A simple flagship processor boasting fast speeds and a large amount of connection ports.',
			level: 1,
			score: 0,
			price: 50,

			img: img_part_cpu,
			bounds: [
				[ B.Solid, B.Solid ],
				[ B.Solid, B.Solid ],
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
		}
	],
	storage: [
		{
			type: 'storage',
			model: 'Supr NVMe SSD 512GB',
			description: 'Fast solid state memory capable of holding 512GB.',
			level: 1,
			score: 512,
			price: 20,

			img: img_part_nvme_large,
			bounds: [
				[ B.Solid, B.Solid, B.Solid ]
			],
			connectors: [
				[ 2, 0, 1 ]
			],
		},
		{
			type: 'storage',
			model: 'Supr NVMe SSD 256GB',
			description: 'Fast solid state memory capable of holding 256GB.',
			level: 1,
			score: 256,
			price: 15,

			img: img_part_nvme_small,
			bounds: [
				[ B.Solid, B.Solid ]
			],
			connectors: [
				[ 1, 0, 1 ]
			]
		}
	],
	battery: [
		{
			type: 'battery',
			model: 'BAT 5000 mAh',
			description: '5000 mAh Lithium-Ion Battery. Standard rectangular form factor.',
			level: 3,
			score: 5000,
			price: 30,

			img: img_part_battery,
			bounds: [
				[ B.Solid, B.Solid, B.Solid ],
				[ B.Solid, B.Solid, B.Solid ],
				[ B.Solid, B.Solid, B.Solid ],
				[ B.Solid, B.Solid, B.Solid ]
			],
			connectors: [
				[ 0, 0, 0 ]
			]
		},
		{
			type: 'battery',
			model: 'EGG 3k mAh',
			description: '3000 mAh Lithium-ion Battery. Ergonomic form factor.',
			level: 1,
			score: 3000,
			price: 35,

			img: img_part_battery_3000,
			bounds: [
				[ B.Solid, B.Solid, B.Transparent ],
				[ B.Solid, B.Solid, B.Transparent ],
				[ B.Solid, B.Solid, B.Solid ]
			],
			connectors: [
				[ 2, 2, 0 ]
			]
		}
	],
	wire: [
		{
			type: 'wire',
			model: 'Wire',
			description: 'Connects two distant components.',
			level: 1,
			score: 0,
			price: 5,

			img: img_part_wire,
			bounds: [
				[ B.Solid ]
			],
			connectors: [
				[ 0, 0, 0 ],
				[ 0, 0, 2 ]
			],
		},
		{
			type: 'wire',
			model: 'RGamerB Corner Connector Mega',
			description: 'Connects two distant components, DIAGONALLY!',
			level: 5,
			score: 0,
			price: 10,

			img: img_part_corner,
			bounds: [
				[ B.Solid, B.Solid ],
				[ B.Transparent, B.Solid ]
			],
			connectors: [
				[ 0, 0, 3 ],
				[ 1, 1, 2 ]
			]
		},
		{
			type: 'wire',
			model: 'RGamerB C-Type Connector Super',
			description: 'Connects two distant components via a proprietary C-type connector piece.',
			level: 5,
			score: 0,
			price: 10,

			img: img_part_c,
			bounds: [
				[ B.Solid, B.Solid, B.Solid ]
			],
			connectors: [
				[ 0, 0, 2 ],
				[ 2, 0, 2 ]
			]
		}
	],
	camera: [
		{
			type: 'camera',
			model: 'Di-cam Super 64 MP',
			description: 'Best image quality for the price on the market, 64 MP AI-enhanced dual-lens camera component.',
			level: 3,
			score: 64 * 100,
			price: 30,

			img: img_part_camera,
			bounds: [
				[ B.Solid, B.Solid ],
				[ B.Solid, B.Solid ]
			],
			connectors: [
				[ 1, 0, 1 ],
				[ 0, 1, 3 ]
			],
		},
		{
			type: 'camera',
			model: 'Mono-Lite Budget 5 MP',
			description: 'Budged camera component for lower-end devices, 5 MP single-lens.',
			level: 3,
			score: 58 * 100,
			price: 5,

			img: img_part_camera_small,
			bounds: [
				[ B.Solid ],
				[ B.Solid ]
			],
			connectors: [ [ 0, 1, 2 ], [ 0, 0, 1 ] ],
		}
	],
	input: [
		{
			type: 'input',
			model: 'Volume Rocker',
			description: 'Standard volume rocker.',
			level: 4,
			score: 500,
			price: 2,

			img: img_part_volume,
			bounds: [
				[ B.Outside, B.Solid ],
				[ B.Outside, B.Solid ]
			],
			connectors: [
				[ 1, 0, 0 ],
				[ 1, 1, 1 ],
				[ 1, 1, 2 ]
			],
		},
		{
			type: 'input',
			model: 'Power Button',
			description: 'Standard power button.',
			level: 4,
			score: 500,
			price: 2,

			img: img_part_power,
			bounds: [
				[ B.Outside, B.Solid ]
			],
			connectors: [
				[ 1, 0, 2 ]
			],
		},
		{
			type: 'input',
			model: 'SecurTek Backmounted Fingerprint Reader',
			description: 'Uses the finest MD5 encryption to secure biometric data.',
			level: 2,
			score: 500,
			price: 30,

			img: img_part_fingerprint_reader,
			bounds: [
				[ B.Solid ]
			],
			connectors: [
				[ 0, 0, 1 ],
				[ 0, 0, 2 ]
			],
		}
	],
	power: [
		{
			type: 'power',
			model: 'PowCo Multi-Jack Compact Assembly',
			description: 'Compact and efficient charging and headphone multi-purpose assembly. High-quality audio and high-speed charging.',
			level: 0,
			score: 1000,
			price: 20,

			img: img_part_multi_jack,
			bounds: [
				[ B.Solid, B.Transparent, B.Transparent ],
				[ B.Solid, B.Solid, B.Solid ],
				[ B.Outside, B.Outside, B.Outside ]
			],
			connectors: [
				[ 1, 1, 0 ],
				[ 0, 1, 3 ]
			],
		},
		{
			type: 'power',
			model: 'PowCo USB-C Assembly',
			description: 'Supports up to 20W fast charging. High-speed data transfer.',
			level: 0,
			score: 500,
			price: 15,

			img: img_part_power_jack,
			bounds: [
				[ B.Solid, B.Solid ],
				[ B.Outside, B.Outside ]
			],
			connectors: [
				[ 0, 0, 0 ],
				[ 1, 0, 1 ]
			],
		},
		{
			type: 'power',
			model: 'AntiqTech MicroUSB Compact Mini',
			description: 'A physical footprint that can\'t be beat!',
			level: 0,
			score: -1000,
			price: 10,

			img: [ img_part_power_microusb, img_part_power_microusb_b, img_part_power_microusb, img_part_power_microusb_a ],
			bounds: [
				[ B.Solid ],
				[ B.Outside ]
			],
			connectors: [
				[ 0, 0, 1 ]
			],
		}
	],
	misc: [
		{
			type: 'misc',
			model: 'Heatsink',
			description: 'A heatsink',
			level: 10,
			score: 0,
			price: 2,

			img: [ img_part_heatsink, img_part_heatsink_side_b, img_part_heatsink_side_c, img_part_heatsink_side_a ],
			bounds: [
				[ B.Solid, B.Solid ]
			],
			connectors: [],
		},
		{
			type: 'misc',
			model: 'Chip',
			description: '',
			level: 10,
			score: 0,
			price: 0,

			img: img_part_chip,
			bounds: [ [ B.Solid ] ],
			connectors: []
		}
	]
}

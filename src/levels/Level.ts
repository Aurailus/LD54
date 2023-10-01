
import { PartProps } from "../components/Part";

export type YieldType = 'completion' | 'placement' | 'call' | 'ship' | 'time';

export type CompletionRequirement =
	'has_cpu' |
	'has_camera' |
	'has_power' |
	'has_storage' |
	'has_input' |
	'has_battery' |
	'all_valid' |
	'time_limit' |
	'budget_limit' |
	'fail';

export type LevelDirective = {
	type: 'message',
	ringing?: boolean;
	messages: string[];
	answers?: Record<string, string>;
} | {
	type: 'delay',
	time: number;
} | {
	type: 'phone',
	width: number,
	height: number,
} | {
	type: 'part',
	part: Omit<PartProps, 'uid'>
} | {
	type: 'wait',
	until: YieldType[]
} | {
	type: 'blueprints',
	level: number
} | {
	type: 'action',
	action: 'lock_all' | 'show_phone' | 'hide_phone' | 'remove_all'
} | {
	type: 'completion_requirements',
	requirements: [ CompletionRequirement, number | string ][];
} | {
	type: 'score_min',
	score: number
};

export type Level = Generator<LevelDirective, void, any>;

import { PartProps } from "../components/Part";

export type LevelDirective = {
	type: 'message',
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
	type: 'placement'
} | {
	type: 'blueprints',
	level: number
} | {
	type: 'action',
	action: 'lock_all' | 'show_phone' | 'hide_phone' | 'remove_all'
};

export type Level = Generator<LevelDirective, void, any>;

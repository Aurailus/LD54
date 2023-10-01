import { VNode, h } from 'preact';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { classes } from '../Util';

import img_chat_bubble from '@res/chat_bubble.png';
import { SCREEN_HEIGHT } from '../Constants';

interface Props {
	messages: string[];
	answers?: Record<string, string>;
	pixelScale: number;
	onClose?: (key?: string) => void;
}

const formatStyles: Record<string, string> = {
	's': 'animate-text-scale',
	'w': 'animate-text-wobble',
	'u': 'animate-text-bob',
	'b': 'font-bold',
	'i': 'italic'
};

const LETTER_DELAY = 0.02 * 1000;
const PUNCTUATION_DELAY = 0.1 * 1000;
const PUNCTUATION = new Set([ '!', ',', '.', ':', ';', '?' ]);
const START_DELAY = 100;

export default function DialogManager(props: Props) {
	const innerChatRef = useRef<HTMLDivElement>(null);
	const questionsContainer = useRef<HTMLDivElement>(null);
	const [ messageInd, setMessageInd ] = useState<number>(0);
	const [ currentLetter, setCurrentLetter ] = useState<number>(0);
	const [ chatHeight, setChatHeight ] = useState<number>(0);
	const [ animation, setAnimation ] = useState<string>('animate-message-in');

	useLayoutEffect(() => {
		setAnimation('animate-message-in');
		setMessageInd(0);
		setCurrentLetter(0);
	}, [ props.messages ]);

	const currentMessage = props.messages[messageInd];

	const formatting = useMemo(() => {
		if (!currentMessage) return [];

		let letterFormattings: string[][] = [];
		let currentFormattings = new Set<string>();

		for (let i = 0; i < currentMessage.length; i++) {
			if (currentMessage[i] === '[' && currentMessage[i + 2] === ']') {
				currentFormattings.add(currentMessage[i + 1]);
				i += 2;
			}
			else if (currentMessage[i] === '[' && currentMessage[i + 1] === '/' && currentMessage[i + 3] === ']') {
				currentFormattings.delete(currentMessage[i + 2]);
				i += 3;
			}
			else {
				letterFormattings.push([ ...currentFormattings.values() ]);
			}
		}

		return letterFormattings;
	}, [ currentMessage ]);

	const plainTextMessage = useMemo(() => {
		if (!currentMessage) return '';
		return currentMessage.replace(/\[\/?\w\]/g, '');
	}, [ currentMessage ]);Math.min(messageInd + 1, props.messages.length)

	useEffect(() => {
		if (!currentMessage) return;
		setCurrentLetter(-1);

		let animationFrame: number = 0;

		function updateCurrentLetter() {
			setCurrentLetter(currentLetter => {
				if (currentLetter >= currentMessage.length) {
					setAnimation('');
					return currentLetter;
				}
				animationFrame = setTimeout(updateCurrentLetter,
					PUNCTUATION.has(plainTextMessage[currentLetter]) ? PUNCTUATION_DELAY : LETTER_DELAY) as any;
				return currentLetter + 1;
			})
		}

		animationFrame = setTimeout(updateCurrentLetter, START_DELAY) as any;

		return () => clearTimeout(animationFrame as any);
	}, [ currentMessage ]);

	useEffect(() => {
		let toCancel: number = 0;

		function frameFunction() {
			if (!innerChatRef.current) {
				toCancel = requestAnimationFrame(frameFunction) as any;
			}
			else {
				setChatHeight(Math.floor(innerChatRef.current.getBoundingClientRect().height / props.pixelScale));
				toCancel = requestAnimationFrame(frameFunction) as any;
			}
		}

		toCancel = requestAnimationFrame(frameFunction);
		return () => cancelAnimationFrame(toCancel);
	}, [ props.pixelScale ]);

	function handleClick() {

		if (currentLetter >= plainTextMessage.length) {
			if (Object.keys(props.answers ?? {}).length && messageInd >= props.messages.length - 1) return;
			else if (messageInd > props.messages.length - 1) return;

			setCurrentLetter(0);
			let nextInd = Math.min(messageInd + 1, props.messages.length);
			setMessageInd(nextInd);
			if (nextInd >= props.messages.length) props.onClose?.();
			setAnimation(nextInd >= props.messages.length ? 'animate-message-out' : 'animate-text-next');
		}
		else {
			setCurrentLetter(plainTextMessage.length);
			setAnimation('animate-text-skip');
		}
	}

	const words: VNode[] = [];
	if (currentLetter > 0) {
		let counter = 0;
		let endOfWord = (plainTextMessage + ' ').slice(currentLetter).indexOf(' ') + currentLetter;
		for (let word of plainTextMessage.slice(0, endOfWord).split(' ')) {
			words.push(
				<span class='inline-block pr-1'>
					{word.split('').map((char, i) =>
						<span class={classes((i + counter <= currentLetter) ? 'animate-letter-in' : 'scale-0', 'inline-block')}>
							<span
								class={classes('inline-block', ...formatting[i + counter].map(ch => formatStyles[ch]))}
								style={{ '--i': i + counter }}
							>{char}
						</span>
					</span>
				)}
			</span>);

			counter += word.length + 1;
		}
	}

	const questionsVisible = messageInd === props.messages.length - 1 && currentLetter >= plainTextMessage.length;

	function handleClickQuestion(key: string) {
		if (messageInd !== props.messages.length - 1) return;
		props.onClose?.(key);
		setMessageInd(props.messages.length);
		setAnimation('animate-message-out');
	}

	return (
		<div class='absolute w-full h-full z-[1000] cursor-pointer'
			onClick={handleClick}
		>
			<div
				class='absolute left-1/2 pb-12 -translate-x-1/2 w-max h-max'
				style={{ bottom: Math.floor((SCREEN_HEIGHT / 2) - (window.innerHeight / props.pixelScale / 2)) - 20 }}
			>
				<div
					class={classes(
						'relative w-72 bg-white bg-clip-content font-handwritten transition-all duration-200 pointer-events-none',
						animation
					)}
					style={{
						filter: 'drop-shadow(0 4px 0 rgba(0 0 0 / 25%)',
						borderImage: `url(${img_chat_bubble})`,
						borderImageSlice: '33.33333%',
						borderWidth: 16,
						height: `calc(${Math.max(chatHeight + 16, 120 / props.pixelScale)}px)`
					}}
				>
					<div class='absolute bg-white rounded-[1.35rem] -inset-4'/>
					<div class='relative -mx-0.5 -my-2.5 h-max' ref={innerChatRef}>
						<p>
							{words}
						</p>
					</div>
				</div>

				{Object.entries(props.answers ?? {}).length > 0 && <div
					class='overflow-hidden transition-all duration-200'
					style={{
						opacity: questionsVisible ? 1 : 0,
						transitionDelay: questionsVisible ? '200ms' : 0,
						height: questionsVisible ? questionsContainer.current!.getBoundingClientRect().height / props.pixelScale + 6 : 0
					}}>
						<div ref={questionsContainer} class={classes('flex flex-col gap-1 items-end mt-1', animation)}>
							{Object.entries(props.answers ?? {}).map(([ key, label ]) =>
								<button
									onClick={() => handleClickQuestion(key)}
									class='hover:brightness-[85%] transition duration-200 pointer-events-auto bg-clip-content font-handwritten text-black cursor-pointer leading-none'
									style={{
										filter: 'drop-shadow(0 4px 0 rgba(0 0 0 / 25%)) var(--tw-brightness, )',
										borderImage: `url(${img_chat_bubble})`,
										borderImageSlice: '33.33333%',
										borderWidth: 16,
									}}
								>
									<div class='absolute bg-white rounded-[1.35rem] -inset-3.5'/>
									<div class='relative -mx-1 -my-2.5 h-max'>
										<p>
											{label}
										</p>
									</div>
								</button>
							)}
						</div>
					</div>
				}
			</div>
		</div>
	);
}

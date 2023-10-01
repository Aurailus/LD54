import { h } from 'preact';

import img_desk_background from '@res/desk_background.png';
import img_score_phone from '@res/score_phone.png';

interface Props {
	pixelScale: number;
	score: number;
	grade: string;
	canContinue: boolean;

	onContinue: () => void;
	onRetry: () => void;
}

const ranking = {
	s: 5,
	a: 4,
	b: 3,
	c: 2,
	d: 1,
	f: 0
}

export default function ScoreScreen(props: Props) {
	return (
		<div class='absolute left-1/2 top-1/2 w-[640px] h-[360px]'
		 	style={{ transform: `translate(-50%, -50%) scale(${props.pixelScale * 100}%)` }}
			>
			<img src={img_desk_background} class='absolute inset-0'/>
			<div class='animate-slide-in w-full h-full'>
				<div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-max h-max'>
					<img src={img_score_phone} class='[filter:drop-shadow(0px_8px_6px_rgb(0_0_0/50%))]'/>
					<div class='m-6 mr-10 absolute inset-0'>

						<p class='font-mono font-black p-1 px-3 text-blue-900/90'>{props.grade !== 'F' ? 'Product Shipped!' : 'Product Fail!'}</p>
						<p class='font-mono font-black px-3 text-[10px] text-blue-900/75 leading-tight'>Revenue: ${
							(props.score * 1000).toLocaleString('en-us', { maximumFractionDigits: 0, useGrouping: true })}</p>
						<p class='font-mono font-black px-3 text-[10px] text-blue-900/75 leading-tight'>Review Avg: {(ranking as any)[props.grade.toLowerCase()]} Stars</p>

						<p class='font-mono font-black px-3 text-[10px] text-blue-900/75 leading-tight pt-3'>Your Ranking:</p>
						<p class='font-mono font-black text-5xl -my-1 text-blue-900 px-3'>{props.grade}</p>

						<div class='flex gap-1 pl-3 pt-3'>
							<button
								onClick={props.canContinue ? props.onContinue : undefined}
								disabled={!props.canContinue} class='bg-blue-900/30 text-blue-900/90 font-mono text-[10px] px-1 py-0.5 disabled:text-white disabled:pointer-events-none disabled:opacity-30'>Continue</button>
							<button
								onClick={props.onRetry}
							class='bg-blue-900/30 text-blue-900/90 font-mono text-[10px] px-1 py-0.5'>Retry</button>
						</div>
					</div>

				</div>
			</div>
		</div>
	)
}

import { Fragment, h } from 'preact';

import BuilderScene from './BuilderScene';
import ScoreScreen from './ScoreScreen';
import { useEffect, useMemo, useState } from 'preact/hooks';

import level0 from '../levels/0_Tutorial';
import level1 from '../levels/1_FirstLevel';
import level2 from '../levels/2_SecondLevel';
import { Level } from '../levels/Level';

const LEVELS = [
	level0,
	level1,
	level2
];

export interface Score {
	score: number;
	grade: string;
	budget: number;
}

export default function App() {
	const [ , setReload ] = useState<number>(0);
	const [ level, setLevel ] = useState<number>(() => {
		let savedLevel = localStorage.getItem('54_level');
		if (savedLevel) return parseInt(savedLevel, 10);
		return 0;
		// return 1;
	});

	const [ levelFn, setLevelFn ] = useState<Level>(LEVELS[level]());
	const [ view, setView ] = useState<'game' | 'score'>('game');
	const [ score, setScore ] = useState<Score>({ score: 0, grade: 'F', budget: 0 });

	function handleContinue() {
		localStorage.setItem('54_level', (level + 1).toString());
		setLevel(level + 1);
		setView('game');
		setLevelFn(LEVELS[level + 1]());
	}

	function handleRetry() {
		setView('game');
		setLevelFn(LEVELS[level]());
	}

	function handleComplete(score: Score) {
		console.log(score);
		setScore(score);
		setView('score');
	}

	const pixelScale = 3;

	useEffect(() => {
		const resizeEvent = () => setReload(r => r + 1);
		window.addEventListener('resize', resizeEvent);
		return () => window.removeEventListener('resize', resizeEvent);
	}, []);

	return (
		<Fragment>
			{view === 'game' &&
				<BuilderScene
					pixelScale={pixelScale}
					level={levelFn}
					onComplete={handleComplete}
				/>
			}
			{view === 'score' &&
				<ScoreScreen
					pixelScale={pixelScale}
					score={score.score}
					grade={score.grade}
					canContinue={score.grade !== 'F' && level + 1 < LEVELS.length}
					onContinue={handleContinue}
					onRetry={handleRetry}
				/>
			}
		</Fragment>
	)
}

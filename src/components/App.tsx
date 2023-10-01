import { Fragment, h } from 'preact';

import BuilderScene from './BuilderScene';
import ScoreScreen from './ScoreScreen';
import { useEffect, useMemo, useState } from 'preact/hooks';

import level0 from '../levels/0_Tutorial';
import level1 from '../levels/1_FirstLevel';
import level2 from '../levels/2_SecondLevel';
import level3 from '../levels/3_ThirdLevel';
import level4 from '../levels/4_FinalLevel';
import { Level } from '../levels/Level';

const LEVELS = [
	level0,
	level1,
	level2,
	level3,
	level4
];

function getPixelScale() {
	if (window.innerWidth >= 2400 && window.innerHeight >= 1200 ) {
		return 4;
	}
	if (window.innerWidth >= 1600 && window.innerHeight >= 900) {
		return 3;
	}
	return 2;
}

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
		const newLevel = (level === LEVELS.length - 1) ? 0 : level + 1;
		localStorage.setItem('54_level', newLevel.toString());
		setLevel(newLevel);
		setView('game');
		setLevelFn(LEVELS[newLevel]());
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

	const pixelScale = getPixelScale();

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
					canContinue={score.grade !== 'F' || level >= LEVELS.length -1}
					onContinue={handleContinue}
					onRetry={handleRetry}
					reset={level === LEVELS.length - 1}
				/>
			}
		</Fragment>
	)
}

import { h } from 'preact';

import BuilderScene from './BuilderScene';
import { useEffect, useMemo, useState } from 'preact/hooks';

import level from '../levels/0_Tutorial';

export default function App() {
	const [ , setReload ] = useState<number>(0);

	useEffect(() => {
		const resizeEvent = () => setReload(r => r + 1);
		window.addEventListener('resize', resizeEvent);
		return () => window.removeEventListener('resize', resizeEvent);
	}, []);

	return (
		<BuilderScene level={useMemo(() => level(), [])}/>
	)
}

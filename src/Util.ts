
export function range(a: number, b: number = 0) {
	const min = Math.min(a, b);
	const max = Math.max(a, b);

	const arr = [];
	for (let i = min; i < max; i++) arr.push(i);
	return arr;
}

export function classes(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

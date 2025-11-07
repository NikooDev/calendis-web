export const debounceImmediate = <Args extends unknown[]>(
	fn: (...args: Args) => void,
	delay: number
) => {
	let timer: ReturnType<typeof setTimeout> | undefined;
	let lastCall = 0;

	return (...args: Args): void => {
		const now = Date.now();

		if (now - lastCall >= delay) {
			fn(...args);
			lastCall = now;
		}

		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			lastCall = 0;
		}, delay);
	};
};
function everyFrame(callback, maxInterval) {
	let lastTime = 0,
		update = time => {
			let interval = time - lastTime;
			// console.log((1000/interval) + ' FPS');
			lastTime = time;
			requestAnimationFrame(update);
			callback(Math.min(interval, maxInterval));
		};
	requestAnimationFrame(update);
}

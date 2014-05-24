var lastAt = 0;

function print(line) {
	var now = Date.now(), dt = now - lastAt;
	console.log('line ' + line + ', dt=' + dt);
	lastAt = now;
}

setTimeout(function start() {
	print(1);
	setTimeout(function() {
		print(2);
		setTimeout(function() {
			print(3);
			setTimeout(function() {
				print(4);
				setTimeout(function() {
					print(5);
					setTimeout(start, 200);
				}, 1200);
			}, 600)
		}, 500);
	}, 100);
}, 0);

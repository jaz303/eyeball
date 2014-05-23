setTimeout(function start() {
	console.log("line 1");
	setTimeout(function() {
		console.log("line 2");
		setTimeout(function() {
			console.log("line 3");
			setTimeout(function() {
				console.log("line 4");
				setTimeout(function() {
					console.log("line 5");
					setTimeout(start, 200);
				}, 1200);
			}, 600)
		}, 500);
	}, 100);
}, 0)
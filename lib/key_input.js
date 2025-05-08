function onKeyDown(event) {
	const key = event.key; // "a", "1", "Shift", etc.

	print(key, "DOWN");
}

function onKeyUp(event) {
	const key = event.key; // "a", "1", "Shift", etc.
	print(key, "UP");
}

deployFunction(() => {
	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);
});

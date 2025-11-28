self.onmessage = (event) => {
	const task = event.data;
	const outcome = performEpicCalculation(task);
	self.postMessage(outcome);
};

/**
 * @param {number} data
 */
function performEpicCalculation(data) {
	return data * 1000; // Let the magic happen
}

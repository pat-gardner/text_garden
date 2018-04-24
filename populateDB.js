Crop.create({ name: 'letterA', images: ['.', 'a', 'A'], cooldowm: 10 }, function(err, doc) {
	if (err) {
		console.log("There was an error");
		console.log(err);
	}
});

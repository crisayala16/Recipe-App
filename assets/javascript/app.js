$(document).ready(function(){
	var ingredients = [];
	var ingredient;
	var queryUrl;
	var currentRecipe;
	var currentLine;
	var ingArray;
	var foodType = "all";
	$(document).on("click", "#add-ingredient", function(){
		ingredient = $("#ingredient-input").val().trim();
		ingredients.push(ingredient);
		$("#ingredient-list").append("<button class='btn btn-info'>"
			+ ingredient + "</button>");
		console.log(ingredients);
	});
	$(document).on("click", "#food-type-btn", function(){
		foodType = $("#food-type-input").val().trim();
		$("#food-type-input").val("");
	})

	$(document).on("click", "#find-recipes", function(){
		var ingredientString = ingredients.join("+");
		console.log(ingredientString);
		queryUrl = "https://api.edamam.com/search?q=" + foodType
		+ "&app_id=06ea1511&app_key=bdeec150a8701cdf840910049d39fb52&from=0&to=10&calories=gte%20591,%20lte%20722"
		$.ajax({
			url: queryUrl,
			method: "GET"
		}).done(function(response){
			var results = response.hits;

			for(var i = 0; i < results.length; i++){
				currentRecipe = results[i].recipe;
				for(var x = 0; x < currentRecipe.ingredientLines.length; x++){
				currentLine = currentRecipe.ingredientLines[x];
				ingArray = currentLine.split(" ");
				console.log(ingArray);
				}
				if(ingArray.indexOf(ingredients[i]))
				


			}

			// for(var i = 0; i < results.length; i++){
			// 	var currentRecipe = results[i].recipe;
			// 	console.log(currentRecipe);
			// 	var div = $("<div id='recipe-box'>");
			// 	div.append("<h3 class='text-center'>" + currentRecipe.label + "</h3>")
			// 	div.append("<img src='" + currentRecipe.image + "'>");
			// 	div.append("<h4>" + currentRecipe.source + "</h4>");
			// 	$("#recipes").append(div);
			// 	}
		})
	})
})
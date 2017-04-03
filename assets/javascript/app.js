$(document).ready(function(){
	var ingredients = ["water", "flour", "eggs", "salt", "milk"];
	var ingredient;
	var queryUrl;
	var currentRecipe;
	var currentLine;
	var ingArray;
	var lineItem;
	var lowerArray = [];
	var matchingLines = 0;
	var lineHasIngredient;
	var foodType = "all";
	var minCal = "0";
	var maxCal = "4000";
	var health = "";

	$(document).on("click", "#add-ingredient", function(){
		ingredient = $("#ingredient-input").val().trim();
		ingredients.push(ingredient);
		$("#ingredient-list").append("<button class='btn btn-info'>"
			+ ingredient + "</button>");
		$("#ingredient-input").val("");
		console.log(ingredients);
	});
	$(document).on("click", "#food-type-btn", function(){
		foodType = $("#food-type-input").val().trim();
		$("#food-type-area").html("<button class='btn btn-info'>" + foodType + "</button>");
		$("#food-type-input").val("");
	});
	$(document).on("click", "#find-recipes", function(){
		var ingredientString = ingredients.join("+");
		console.log(ingredientString);
		minCal = $("#min-cal").val().trim();
		maxCal = $("#max-cal").val().trim();
		console.log("Min cal: " + minCal);
		console.log("Max cal: " + maxCal);
		queryUrl = "https://api.edamam.com/search?q=" + foodType
		+ "&app_id=06ea1511&app_key=bdeec150a8701cdf840910049d39fb52&from=0&to=100&calories=gte " + minCal +
		",lte " + maxCal;
		$.ajax({
			url: queryUrl,
			method: "GET"
		}).done(function(response){
			var results = response.hits;

			for(var i = 0; i < results.length; i++){
				currentRecipe = results[i].recipe;
				matchingLines = 0;
				lineHasIngredient = false;
				console.log("Inside Recipe result number #" + i);
				for(var x = 0; x < currentRecipe.ingredientLines.length; x++){
					currentLine = currentRecipe.ingredientLines[x];
					ingArray = currentLine.split(" ");
					lowerArray = [];
					for(var a = 0; a < ingArray.length; a++){
						var lineItem = ingArray[a].toLowerCase();
						lowerArray.push(lineItem.replace(/\,\(\)/g,"")); //see if replacing all unnecessary string info but ingredient could work
					}
					if(lineHasIngredient === false){

						for(var y = 0; y < ingredients.length; y++){

							if(lowerArray.indexOf(ingredients[y]) === -1){
								lineHasIngredient = false;
							} 
							else if(lowerArray.indexOf(ingredients[y]) === 0){
								lineHasIngredient = true;
								console.log("Match!");
								matchingLines++;	
								console.log(matchingLines);
							}
						}
					}
				}
				if(matchingLines === currentRecipe.ingredientLines.length || matchingLines > 0){
					
					var div = $("<div id='recipe-box'>");
					div.append("<h3 class='text-center' id='recipe-label'> <a target='_blank' href='" + currentRecipe.url + "'>" + currentRecipe.label + "</h3>");
					div.append("<img src='" + currentRecipe.image + "'>");
					div.append("<h4>" + currentRecipe.source + "</h4>");
					div.append("<h4>Matching Ingredients: " + matchingLines + "</h4>");
					$("#recipes").append(div);
					console.log("Recipe Posted!");

				}
			}
			$(document).on("click", "#recipe-label", function(){
					//append the clicked on recipes in the recipe-box to the recentRecipes div.
					var recDiv = $("<div id='recent-recipes'>");
					//This prints out a recipe, not the one we wanted though, in the recipes div with the id of recipe-box. currentRecipe.url is this twice baked almond cookies for some reason
					//all the links are using currentRecipe.url & currentRecipe is just results[i].recipe
					recDiv.append("<h3 class='text-center'> <a target='_blank' href='" + currentRecipe.url + "'>" + $(this).text() + "</a> </h3>");
					$("#recentRecipes").append(recDiv);
					console.log("You just made a recent recipe!");
					console.log($(this).text());
					console.log(currentRecipe.url);
				});
		})
	})
})

//create link to fullRecipe page to open in a new tab after recent-recipes click
// <nav>
// 
// </nav>
$(document).ready(function(){
	var ingredients = ["water", "flour", "eggs", "salt", "milk"];
	var pluralIngredients = [];
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
	var onRecipe = 0;
	var config = {
		apiKey: "AIzaSyCnDxa0VrOGyZCA8Z7ojYjTzYYn8P5_Lp4",
		authDomain: "recipe-app-162617.firebaseapp.com",
		databaseURL: "https://recipe-app-162617.firebaseio.com",
		projectId: "recipe-app-162617",
		storageBucket: "recipe-app-162617.appspot.com",
		messagingSenderId: "30198600181"
	};
	firebase.initializeApp(config);
	var database = firebase.database();
	function displayIngredientButtons(){
		$("#ingredient-list").html("");
		for(var q = 0; q < ingredients.length; q++){
			$("#ingredient-list").append("<button class='btn btn-info'>"
			+ ingredients[q] + "  <span id='remove-ingredient' index='" + q + "' class='glyphicon glyphicon-remove'></span></button>");
		}
	}
$(document).on("click", "#new-recipe-btn", function(){
	ingredients = ["water", "flour", "eggs", "salt", "milk"];
	displayIngredientButtons();

});

//On click event to add new ingredients
$(document).on("click", "#add-ingredient", function(){
	ingredient = $("#ingredient-input").val().trim();
	var pluralIng = ingredient + "s";
	var pluralIng2 = ingredient + "es";
	ingredients.push(ingredient);
	pluralIngredients.push(pluralIng);
	pluralIngredients.push(pluralIng2);
	console.log(pluralIngredients);

	displayIngredientButtons();
	$("#ingredient-input").val("");
	console.log(ingredients);
});

$(document).on("click", "#remove-ingredient", function(){
	var ingIndex = $(this).attr("index");
	ingredients.splice(ingIndex, 1);
	displayIngredientButtons();

})
//on click event to add the food-type of the recipe search
$(document).on("click", "#food-type-btn", function(){
	foodType = $("#food-type-input").val().trim();
	$("#food-type-area").html("<button class='btn btn-info'>" + foodType + "</button>");
	$("#food-type-input").val("");
});
//On click event that launches the search query and matches recipes 
//that contain the specified ingredients
$(document).on("click", "#find-recipes", function(){
	database.ref().set({});
	ingredients = ingredients.concat(pluralIngredients);
	console.log(ingredients);
	var ingredientString = ingredients.join("+");
	console.log(ingredientString);
	minCal = $("#min-cal").val().trim();
	maxCal = $("#max-cal").val().trim();
	queryUrl = "https://api.edamam.com/search?q=" + foodType
	+ "&app_id=06ea1511&app_key=bdeec150a8701cdf840910049d39fb52&from=0&to=100&calories=gte " + minCal +
	",lte " + maxCal;
		//Ajax Call
		$.ajax({
			url: queryUrl,
			method: "GET"
		}).done(function(response){
			var results = response.hits;
			//Ingredient Matching Algorithm
			for(var i = 0; i < results.length; i++){
				currentRecipe = results[i].recipe;
				matchingLines = 0;
				lineHasIngredient = false;
				console.log("Inside Recipe result number #" + i);
				//Looks Inside each ingredient line
				for(var x = 0; x < currentRecipe.ingredientLines.length; x++){
					//Prepares the user ingredients in an array
					currentLine = currentRecipe.ingredientLines[x];
					//Prepares each recipe's ingredient line in an array
					ingArray = currentLine.split(" ");
					lowerArray = [];
					for(var a = 0; a < ingArray.length; a++){
						var lineItem = ingArray[a].toLowerCase();
						lowerArray.push(lineItem.replace(/\,\(\)/g,""));
					}
					if(lineHasIngredient === false){
						//Checks If the user ingredient matches the recipe ingredient
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
				//If the Ingredients Matched a certain amount of
				//times, then post the recipe information
				if(matchingLines === currentRecipe.ingredientLines.length || matchingLines > 0){
					var recImage = currentRecipe.image;
					var recLabel = currentRecipe.label;
					var recSource = currentRecipe.source;
					var recUrl = currentRecipe.url;
					var fullIngredients = currentRecipe.ingredientLines;
					var recYield = currentRecipe.yield;
					var recCalories = Math.round(currentRecipe.calories);

					var div = $("<div class='recipe-box'>");
					div.append("<h3 class='text-center' id='recipe-label' order='" + onRecipe + "'><a href='recipe.html' target='_blank'>" + recLabel + "</a></h3>");
					div.append("<img src='" + recImage + "'>");
					div.append("<h4>" + recCalories + " Calories</h4>");
					div.append("<h4>" + recSource + "</h4>");
					div.append("<h4>" + fullIngredients + "</h4>");
					$("#recipes").append(div);
					console.log("Recipe Posted!");
					onRecipe++;


					database.ref().push({
						image: recImage,
						label: recLabel,
						source: recSource,
						url: recUrl,
						ingredients: fullIngredients,
						yield: recYield,
						calories: recCalories,
					});

				};
			};
			//End of Ingredient Matching Algorithm
		});
		//End of Ajax call
	});
	//End of find recipes on click

	$(document).on("click", "#recipe-label", function(){
		var order = $(this).attr("order");
		console.log(this);
		var thisLabel;
		var thisUrl;
		console.log("start");

		database.ref().on("value", function(snapshot){
			var data = snapshot.val();
			var keys = Object.keys(data);
			var clickedRecipe = keys[order];
			thisLabel = data[clickedRecipe].label;
			thisUrl = data[clickedRecipe].url;

			console.log(thisLabel);
			var aTag = $("<a href='" + thisUrl + "' target='_blank'>")
			var h2 = $("<h2 class='text-center rec-rep-label'>");
			h2.html(thisLabel);
			// window.location.replace("recipe.html");
			aTag.html(h2);
			$("#recent-recipes").append(aTag);
			$("#full-detail").append(h2);
			console.log("finished");

		});
	});

	$(document).on("click", "#youtube-search", function(){
		var videoName = $("#youtube-search-input").val().trim();
		var youtubeUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&order=viewCount&q=" + 
		videoName + "&type=video&key=AIzaSyAUhUJcpkPnQDHOHQbCydvp6gce41ueG6s";
		var videoId1;
		var videoId2;
		$.ajax({
			url: youtubeUrl,
			method: "GET"
		}).done(function(videos){
			var vids = videos.items;
			videoId1 = vids[0].id.videoId;
			videoId2 = vids[1].id.videoId;
			console.log(videoId1);
			console.log(videoId2);
			$("#recent-recipes").append("<iframe width='350' height='240' src='https://www.youtube.com/embed/" + videoId1 + "' frameborder='0' allowfullscreen></iframe>");
			$("#recent-recipes").append("<iframe width='350' height='240' src='https://www.youtube.com/embed/" + videoId2 + "' frameborder='0' allowfullscreen></iframe>");
			

		});
	})	
});

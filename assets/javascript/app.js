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
	var foodType = " ";
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
	var auth = firebase.auth();
	$(document).on("click", "#login-btn", function(){
		var emailSI = $("#email-input-login").val().trim();
		var passSI = $("#password-input-login").val().trim();
		var promise = auth.signInWithEmailAndPassword(emailSI, passSI);
		promise.catch(e => $("#error-mess").html("Invalid Email or Password"));
		$("#email-input-login").val("");
		$("#password-input-login").val("");
	});
	$(document).on("click", "#signUp-btn", function(){
		var emailSU = $("#email-input-signUp").val().trim();
		var passSU = $("#password-input-signUp").val().trim();
		var promise = auth.createUserWithEmailAndPassword(emailSU, passSU);
		promise.catch(e => console.log(e.message));
		$("#email-input-signUp").val("");
		$("#password-input-signUp").val("");
		auth.signInWithEmailAndPassword(emailSU, passSU);
	});
	$(document).on("click", "#logOut-btn", function(){
		firebase.auth().signOut();
	});
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			$("#app-content").removeClass("hide");
			$("#login-page").addClass("hide");
		}
		else{
			$("#app-content").addClass("hide");
			$("#login-page").removeClass("hide");
		}
	});
//displays the ingredients as buttons
function displayIngredientButtons(){
	$("#ingredient-list").html("");
	for(var q = 0; q < ingredients.length; q++){
		$("#ingredient-list").append("<button class='btn btn-info'>" + ingredients[q]
			+ "  <span id='remove-ingredient' index='" + q + "' class='glyphicon glyphicon-remove'></span></button>");
	}
};
//goes to sign-up section
$(document).on("click", "#go-to-signUp", function(){
	$("#login-well").addClass("hide");
	$("#signUp-well").removeClass("hide");
});
//goes to login-section
$(document).on("click", "#go-to-login", function(){
	$("#login-well").removeClass("hide");
	$("#signUp-well").addClass("hide");
});
//resets input values
$(document).on("click", "#new-recipe-btn", function(){
	ingredients = ["water", "flour", "eggs", "salt", "milk"];
	$("#food-type-area").html("");
	displayIngredientButtons();
});
//On click event to add new ingredients
$(document).on("click", "#add-ingredient", function(){
	ingredient = $("#ingredient-input").val().trim();
	ingredients.push(ingredient);
	displayIngredientButtons();
	$("#ingredient-input").val("");
});
//removes ingredients
$(document).on("click", "#remove-ingredient", function(){
	var ingIndex = $(this).attr("index");
	ingredients.splice(ingIndex, 1);
	displayIngredientButtons();
});
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
	var ingredientString = ingredients.join("+");
	$("#recipe-display").html("");
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
								matchingLines++;
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
					var recUri = currentRecipe.uri.replace(/#/g, "%23");
					var div = $("<div class='recipe-box'>");
					div.append("<h3 class='text-center' id='recipe-label' url='" + recUrl + "' order='" + onRecipe + "'><a href='recipe.html?r=" + recUri + "' target='_blank'>" + recLabel + "</a></h3>");
					div.append("<img src='" + recImage + "'>");
					div.append("<h4>" + recCalories + " Calories</h4>");
					div.append("<h4>" + recSource + "</h4>");
					$("#recipe-display").append(div);
					onRecipe++;
				};
			};
			//End of Ingredient Matching Algorithm
		});
		//End of Ajax call
	});
	//End of find recipes on click
	$(document).on("click", "#recipe-label", function(){
		var order = $(this).attr("order");
		var thisLabel = $(this).text();
		var thisUrl = $(this).attr("url");
		var aTag = $("<a target='_blank' href='" + thisUrl + "'>");
		var h2 = $("<h2 class='text-center'>");
		h2.html(aTag);
		aTag.html(thisLabel);
		$("#recent-recipes").append(h2);
	});
});

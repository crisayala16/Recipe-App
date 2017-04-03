
// retrieve the query string form the URL as an associtative array
function getQuery() {
	var arr = [];

	var url = location.href;
	var i = url.indexOf("?");
	if( i < 0 )
		return arr;
	url = url.substr(i + 1);
	url = url.split("&");

	for( i = 0; i < url.length; i++ ) {
		var pair = url[i].split("=");
		arr[pair[0]] = (pair[1] ? pair[1] : null);
	}

	return arr;
}

// on page ready
$(function() {

	// query the edamam API for nutrition info
	$.ajax({
		url: "https://api.edamam.com/search?r=" + getQuery()["r"],
		method: "GET"
	}).done(function(response) {
		console.log(response);
		
		var obj = response[0];

		$(".recipe_name").text( obj.label );
		$("#recipe_img").attr( "src", obj.image );

		$("#calories").text( Math.round(obj.calories) );
		$("#fat").text(Math.round(obj.totalNutrients.FAT.quantity) + "g" );
		$("#fasat").text(Math.round(obj.totalNutrients.FASAT.quantity) );
		$("#trans").text(Math.round(obj.totalNutrients.FATRN.quantity) );
		$("#carbs").text(Math.round(obj.totalNutrients.CHOCDF.quantity) );
		$("#sodium").text(Math.round(obj.totalNutrients.NA.quantity) );
		$("#fiber").text(Math.round(obj.totalNutrients.FIBTG.quantity));


		
	});

});
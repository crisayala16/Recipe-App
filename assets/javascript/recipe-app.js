$(document).ready(function(){
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
		$("#recipe_img").attr( "src", obj.image);
		$("#source-link").attr("href", obj.url);
		var ul = $("<ul>");
		for(var h = 0; h < obj.ingredientLines.length; h++){
			ul.append("<li>" + obj.ingredientLines[h] + "</li>");
		}
		$("#ingredient_list").append(ul);
		$("#source-link").attr("href", obj.url);
		$("#rec-source").text(obj.source);
		$("#calories").text( Math.round(obj.calories));
		$("#fat").text(Math.round(obj.totalNutrients.FAT.quantity) + " g" );
		$("#fasat").text(Math.round(obj.totalNutrients.FASAT.quantity) + " g");
		$("#trans").text(Math.round(obj.totalNutrients.FATRN.quantity) + " g");
		$("#carbs").text(Math.round(obj.totalNutrients.CHOCDF.quantity) + " g");
		$("#sodium").text(Math.round(obj.totalNutrients.NA.quantity) + " g");
		$("#fiber").text(Math.round(obj.totalNutrients.FIBTG.quantity) + " g");
	});
});
//On click for displaying youtube videos
$(document).on("click", "#youtube-search", function(){
	var videoName = $("#youtube-search-input").val().trim();
	var youtubeUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&order=viewCount&q=" + 
	videoName + "&type=video&key=AIzaSyAUhUJcpkPnQDHOHQbCydvp6gce41ueG6s";
	var videoId1;
	var videoId2;
	var videoId3;
	$.ajax({
		url: youtubeUrl,
		method: "GET"
	}).done(function(videos){
		var vids = videos.items;
		videoId1 = vids[0].id.videoId;
		videoId2 = vids[1].id.videoId;
		videoId3 = vids[2].id.videoId;
		$("#youtube-vids-display").append("<iframe class='col-lg-4 col-md-12 col-sm-4' width='350' height='240' src='https://www.youtube.com/embed/" + videoId1 + "' frameborder='0' allowfullscreen></iframe>");
		$("#youtube-vids-display").append("<iframe class='col-lg-4 col-md-12 col-sm-4' width='350' height='240' src='https://www.youtube.com/embed/" + videoId2 + "' frameborder='0' allowfullscreen></iframe>");
		$("#youtube-vids-display").append("<iframe class='col-lg-4 col-md-12 col-sm-4' width='350' height='240' src='https://www.youtube.com/embed/" + videoId3 + "' frameborder='0' allowfullscreen></iframe>");

	});
})
});

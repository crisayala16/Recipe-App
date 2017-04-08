$(document).ready(function(){
//plays audio once timer finishes
function playAudio(){
	var audio = document.getElementById('myAudia');
	audio.play();
	var pauseSound = setTimeout(function(){
		audio.pause();
	},5000);
};
//starts the timer
$(document).on("click", "#btn-start", function(){
	var min = $("#minute-input").val().trim();
	var sec = $("#seconds-input").val().trim();
	$("#minute-input").val("");
	$("#seconds-input").val("");
	$("#timer").countdowntimer({
		minutes: min,
		seconds : sec,
		timeUp: playAudio
	});
});
//stops the timer
$(document).on("click", "#stopBtn", function(){
	$("#timer").html("00:00");
    var found;
    for(var i=0; i<10000; i++)
    {
        window.clearInterval(i);
    }
});
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
		$("#sodium").text(Math.round(obj.totalNutrients.NA.quantity) + " mg");
		$("#fiber").text(Math.round(obj.totalNutrients.FIBTG.quantity) + " g");
		$("#sugar").text(Math.round(obj.totalNutrients.SUGAR.quantity) + " g");
		$("#protein").text(Math.round(obj.totalNutrients.PROCNT.quantity) + " g");
		$("#vit_a").text(Math.round(obj.totalNutrients.VITA_RAE.quantity) + " µg");
		$("#vit_c").text(Math.round(obj.totalNutrients.VITC.quantity) + " mg");
		$("#calcium").text(Math.round(obj.totalNutrients.CA.quantity) + " mg");
		$("#iron").text(Math.round(obj.totalNutrients.FE.quantity) + " mg");
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
	$("#youtube-search-input").val("");
	$.ajax({
		url: youtubeUrl,
		method: "GET"
	}).done(function(videos){
		$("#youtube-vids-display").html("");
		var vids = videos.items;
		videoId1 = vids[0].id.videoId;
		videoId2 = vids[1].id.videoId;
		videoId3 = vids[2].id.videoId;
		$("#youtube-vids-display").append("<iframe class='col-lg-4 col-md-4 col-sm-4 col-xs-4' width='350' height='240' src='https://www.youtube.com/embed/" + videoId1 + "' frameborder='0' allowfullscreen></iframe>");
		$("#youtube-vids-display").append("<iframe class='col-lg-4 col-md-4 col-sm-4 col-xs-4' width='350' height='240' src='https://www.youtube.com/embed/" + videoId2 + "' frameborder='0' allowfullscreen></iframe>");
		$("#youtube-vids-display").append("<iframe class='col-lg-4 col-md-4 col-sm-4 col-xs-4' width='350' height='240' src='https://www.youtube.com/embed/" + videoId3 + "' frameborder='0' allowfullscreen></iframe>");
	});
})
});

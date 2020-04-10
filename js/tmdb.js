//The movie selected and year needs to come from session storage, movie selected by user on second page.  Need to convert date to show just year
var movieStored = $.parseJSON(sessionStorage.getItem("movieMeMovieChoice"))
var movieSelected = movieStored.Title
var releaseYear = parseInt(movieStored.Year)
var tmdbMovieSearchURL = "https://api.themoviedb.org/3/search/movie?api_key=8906f66d9af7f1f04b7db42d2121078c&language=en-US&query=" + movieSelected + "&page=1&include_adult=false&year=" + releaseYear;
//Stores all the youtube links needed for the content page
var videoSearchResults = [];

console.log(releaseYear)
console.log(movieSelected)

//API call to "themoviedb" API to gather the movieID which is required to find the youtube video key in the next API call.
$.ajax({
    url: tmdbMovieSearchURL,
    method: "GET"
}).then(function (movieSearchResponse) {

    var movieID = movieSearchResponse.results[0].id
    var tmdbVideoSearchURL = "https://api.themoviedb.org/3/movie/" + movieID + "/videos?api_key=8906f66d9af7f1f04b7db42d2121078c&language=en-US"

    console.log(movieSearchResponse)
    console.log(movieID)
    console.log(tmdbVideoSearchURL)

    //API Call to "themoviedb" API to pull all the stored youtube keys. 
    $.ajax({
        url: tmdbVideoSearchURL,
        method: "GET"
    }).then(function (videoSearchResponse) {

        //This loop captures all the video keys and stores them in the viedoSearchResults Array which can then be used to populate the content page with Youtube videos.
        for (let i = 0; i < videoSearchResponse.results.length; i++) {
            const videoKey = videoSearchResponse.results[i].key;
            var youtubeUrl = "https://www.youtube.com/embed/" + videoKey;

            videoSearchResults.push(youtubeUrl)
            //Adds containers to hold responsive videos
            var videoDiv = $("<div class= 'video-container'>")
            videoDiv.attr("id", "youtube-videos")
            //Adds iframe divs for every youtube video found
            var iframeDiv = $("<iframe />");
            iframeDiv.attr("id", "iframe-container")
            iframeDiv.attr("src", youtubeUrl);
            iframeDiv.attr("width", 400)
            iframeDiv.attr("height", 315)
            iframeDiv.attr("frameborder", 0)
            iframeDiv.attr("allowfullscreen", "")

            videoDiv.append(iframeDiv)
            //Pushes vidoes to HTML File
            $("#videos-container").prepend("<br>");
            $("#videos-container").prepend(videoDiv);

            console.log(videoKey)
            console.log(youtubeUrl)
        }
        console.log(videoSearchResponse)
        console.log(videoSearchResults)
    })

})


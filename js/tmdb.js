//The movie selected and year needs to come from session storage, movie selected by user on second page.  Need to convert date to show just year
var movieSelected = "Avatar";
var releaseYear = 2009;
var tmdbMovieSearchURL = "https://api.themoviedb.org/3/search/movie?api_key=8906f66d9af7f1f04b7db42d2121078c&language=en-US&query=" + movieSelected + "&page=1&include_adult=false&year=" + releaseYear;
//Stores all the youtube links needed for the content page
var videoSearchResults = [];

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
        console.log(videoSearchResponse);
        //This loop captures all the video keys and stores them in the viedoSearchResults Array which can then be used to populate the content page with Youtube videos.
        for (let i = 0; i < videoSearchResponse.results.length; i++) {
            const videoKey = videoSearchResponse.results[i].key;
            var youtubeUrl = "https://www.youtube.com/watch?v=" + videoKey;

            videoSearchResults.push(youtubeUrl)

            console.log(videoKey)
            console.log(youtubeUrl)

        }

        console.log(videoSearchResults)
    })

})
// var tasteDiveApiKey = "362316-MovieMe-NN3BYWU6";
var tasteDiveBaseQueryUrl = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?type=movies&k=362316-MovieMe-NN3BYWU6&q="
// var tasteDiveBaseQueryUrl = "https://tastedive.com/api/similar?type=movies&k=362316-MovieMe-NN3BYWU6&q="

var movieTitle = "Onward";
// var omdbApiKey = "14427a54";
var omdbBaseQueryUrl = "https://www.omdbapi.com/?apikey=14427a54&t="
var returnedMovieArray = [];

//Keybind for enter key in search box

$('#search').keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        sessionStorage.removeItem("movieMeMovieArray")
        var movie = $.trim($("#search").val());
        var tasteDiveQueryUrl = tasteDiveBaseQueryUrl + movie;
        console.log(tasteDiveQueryUrl)
        apiCall(tasteDiveQueryUrl, buildReturnedMovies);

    }
})


//Loads content once the movies page loads.

$(window).on('load', function () {
    if (window.document.title == "MovieMe - Results") {
        console.log('loaded')
        returnedMovieArray = JSON.parse(sessionStorage.getItem('movieMeMovieArray'));
        loadSearchResults();
    }
    if(window.document.title == "MovieMe - Homepage") {
        // returnedMovieArray = [];
        console.log("homepage");
    }
})




//Event handler to capture search field from input box.
$("#search-movie").on("click", function (movieSearch) {
    movieSearch.preventDefault();

    var movie = $.trim($("#movie-request").val());
    console.log(movie)
})
//Constructs a Taste Dive query URL from the search field input box


//Adds the search field box input to a searched history array


//Loop to cycle through Taste Dive array and perform OMDB call for each item. Places each item into a returned movies array
function buildReturnedMovies(response) {
    for (i = 0; i < 10; i++) {
        returnedMovies = response;
        var returnedMovieTitle = returnedMovies.Similar.Results[i].Name;
        console.log(returnedMovieTitle);
        var omdbQueryUrl = omdbBaseQueryUrl + returnedMovieTitle;
        apiCall(omdbQueryUrl, buildMovieArray);
    }

    //  window.location = "movies.html";
}


function buildMovieArray(response) {
    returnedMovie = response;
    console.log(returnedMovie);
    returnedMovieArray.push(returnedMovie);
    sessionStorage.setItem("movieMeMovieArray", JSON.stringify(returnedMovieArray));
    if (returnedMovieArray.length>=8){
        window.location = "movies.html"
    }
}
//Generates search results page based on poster and title
function loadSearchResults() {
    for (i = 0; i < 8; i++) {
        $(".container").eq(1).find("img").eq(i).attr('src', returnedMovieArray[i].Poster)
        $(".container").eq(1).find(".card-content").eq(i).text(returnedMovieArray[i].Title)
    }
}



//Event handler for search results click


//Generate content page from search results click




//Makes an API call and then calls the function in the second argument. Requires a URL as the first argument and function as the second
function apiCall(apiQuery, apiFunction) {
    $.ajax({
        url: apiQuery,
        method: "GET"
    }).then(apiFunction)
}

//Test function
function testFunction(response) {
    console.log(response);
}

// var tasteDiveQueryUrl = tasteDiveBaseQueryUrl+movieTitle
// apiCall(tasteDiveQueryUrl, buildReturnedMovies);

// var omdbQueryUrl = omdbBaseQueryUrl+movieTitle;
// apiCall(omdbQueryUrl, testFunction);
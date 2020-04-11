// var tasteDiveApiKey = "362316-MovieMe-NN3BYWU6";
var tasteDiveBaseQueryUrl = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?type=movies&k=362316-MovieMe-NN3BYWU6&q="
// var tasteDiveBaseQueryUrl = "https://tastedive.com/api/similar?type=movies&k=362316-MovieMe-NN3BYWU6&q="
var test = "";
var movieTitle = "Onward";
// var omdbApiKey = "14427a54";
var omdbBaseQueryUrl = "https://www.omdbapi.com/?apikey=14427a54&t="
var returnedMovieArray = [];
var contentMovieChoice = [];
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
        if (returnedMovieArray != null) {
            $("#content").attr("style", "display:block");
            $("#no-content").attr("style", "display: none");
            loadSearchResults();
        }
        else {
            $("#no-content").attr("style", "display:block");
            $("#content").attr("style", "display:none");
        }
    }
    else if (window.document.title == "MovieMe - Homepage") {
        // returnedMovieArray = [];
        console.log("homepage");
    }
    else if (window.document.title == "MovieMe - Content") {
        contentMovieChoice = JSON.parse(sessionStorage.getItem('movieMeMovieChoice'));
        if (contentMovieChoice != null) {
            $("#content").attr("style", "display:block");
            $("#no-content").attr("style", "display: none");
            loadMovieContent();
        }
        else {
            $("#no-content").attr("style", "display:block");
            $("#content").attr("style", "display:none");

        }
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
}


function buildMovieArray(response) {
    returnedMovie = response;
    console.log(returnedMovie);
    returnedMovieArray.push(returnedMovie);
    sessionStorage.setItem("movieMeMovieArray", JSON.stringify(returnedMovieArray));
    if (returnedMovieArray.length >= 8) {
        window.location = "movies.html"
    }
}
//Generates search results page based on poster and title
function loadSearchResults() {
    for (i = 0; i < 8; i++) {
        $("#content").find("img").eq(i).attr('src', returnedMovieArray[i].Poster);
        $("#content").find("img").eq(i).attr('data', i);
        $("#content").find(".card-content").eq(i).text(returnedMovieArray[i].Title);
    }
    $('#content img').on('click', function () {
        event.preventDefault();
        loadContentPage(event);

    })
}



//Event handler for search results click


//Generate content page from search results click
function loadContentPage(event) {
    test = event;
    var posterChoice = event.target.getAttribute('data');
    var movieChoice = returnedMovieArray[posterChoice];
    console.log(movieChoice);
    sessionStorage.setItem('movieMeMovieChoice', JSON.stringify(movieChoice));
    window.location = "content.html"
}

function loadMovieContent() {
    console.log("content function")
    $('#content').find('.poster').attr('src', contentMovieChoice.Poster);
    $('#content').find('h4').text(contentMovieChoice.Title);
    $('#content').find('.rated').text("Rated: " + contentMovieChoice.Rated);
    $('#content').find('.released').text("Released: " + contentMovieChoice.Released);
    $('#content').find('.runtime').text("Runtime: " + contentMovieChoice.Runtime);
    $('#content').find('.genre').text("Genre: " + contentMovieChoice.Genre);
    $('#content').find('.director').text("Director: " + contentMovieChoice.Director);
    $('#content').find('.description').text("Plot: " + contentMovieChoice.Plot);
        
    for (i = 0; i < 3; i++) {
        $("#ratings-list").find("li").eq(i).text(contentMovieChoice.Ratings[i].Source + ": " + contentMovieChoice.Ratings[i].Value);

    }
}



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
// var tasteDiveApiKey = "362316-MovieMe-NN3BYWU6";
var tasteDiveBaseQueryUrl = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?type=movies&k=362316-MovieMe-NN3BYWU6&q=pulp+fiction"
var movieTitle = "Onward";
// var omdbApiKey = "14427a54";
var omdbBaseQueryUrl = "https://www.omdbapi.com/?apikey=14427a54&t=" 
var returnedMovieArray = [];

//Event handler to capture search field from input box.

//Constructs a Taste Dive query URL from the search field input box


//Adds the search field box input to a searched history array


//Loop to cycle through Taste Dive array and perform OMDB call for each item. Places each item into a returned movies array
function buildReturnedMovies(response){
for(i=0;i<10;i++){
    returnedMovies = response;
    var returnedMovieTitle = returnedMovies.Similar.Results[i].Name;
    console.log(returnedMovieTitle);
    var omdbQueryUrl = omdbBaseQueryUrl + returnedMovieTitle;
    apiCall(omdbQueryUrl, buildMovieArray);



}
}

function buildMovieArray(response){
    returnedMovie = response;
    console.log(returnedMovie);
    returnedMovieArray.push(returnedMovie);


}
//Generates search results page based on poster and title


//Event handler for search results click


//Generate content page from search results click


//Makes an API call and then calls the function in the second argument. Requires a URL as the first argument and function as the second
function apiCall(apiQuery, apiFunction){
    $.ajax({url: apiQuery,
    method: "GET"
    }).then(apiFunction)
}

//Test function
function testFunction(response){
    console.log(response);
}

var tasteDiveQueryUrl = tasteDiveBaseQueryUrl;
apiCall(tasteDiveQueryUrl, buildReturnedMovies);

var omdbQueryUrl = omdbBaseQueryUrl+movieTitle;
apiCall(omdbQueryUrl, testFunction);
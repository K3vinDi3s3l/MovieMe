var tasteDiveBaseQueryUrl = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?type=movies&info=1&k=362316-MovieMe-NN3BYWU6&q=movie%3A"
var omdbBaseQueryUrl = "https://www.omdbapi.com/?apikey=14427a54&t="
var returnedMovieArray = [];
var contentMovieChoice = [];
var savedMovieArray = [];
var savedMovieHolder="";
//Keybind for enter key in search box

$('#search').keypress(function (event) {
    if (event.keyCode == 13 && $("#search").val() !="" ) {
        event.preventDefault();
        M.toast({html: 'Working on it!', displayLength: 15000	});
        sessionStorage.removeItem("movieMeMovieArray")
        var movie = $.trim($("#search").val());
        while (savedMovieArray.length>5) {
            savedMovieHolder = savedMovieArray[5];
            savedMovieArray.pop();
        }
         savedMovieArray.unshift(movie);
        sessionStorage.setItem('movieMeSavedMovieArray', JSON.stringify(savedMovieArray));
        var movieName="";
        for(i=0;i<movie.length;i++){
            if (movie[i] == ' '){
                movieName = movieName+ '%20';
            }
            else {
            movieName = movieName+movie[i];
            }
        }
        var tasteDiveQueryUrl = tasteDiveBaseQueryUrl + movieName;
        for(i=0;i<4;i++) {
            var additionalSearchName = "";
            if ($('#savedSearches input').eq(i)[0].checked == true){
                var savedSearchName = $('#savedSearches input ~ span').eq(i).text();
                for(x=0;x<savedSearchName.length;x++){
                    if (savedSearchName.charCodeAt(x)==32) {
                        additionalSearchName = additionalSearchName + '%20'
                    }
                    else {
                        additionalSearchName = additionalSearchName + savedSearchName[x];
                    }
                }
                tasteDiveQueryUrl = tasteDiveQueryUrl+'%2Cmovie%3A'+additionalSearchName;
            }
                
        }
        console.log(tasteDiveQueryUrl);
        apiCall(tasteDiveQueryUrl, buildReturnedMovies);

    }
})


//Loads content once the movies page loads.

$(window).on('load', function () {
    $('.modal').modal();
    M.Toast.dismissAll();
    if (window.document.title == "MovieMe - Results") {
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
        savedMovieArray = JSON.parse(sessionStorage.getItem('movieMeSavedMovieArray'));
        if (savedMovieArray == null){
            savedMovieArray = [];
        }
        else{
            for (i=0;i<savedMovieArray.length;i++) {
                $('#savedSearches').find('span').eq(i).text(savedMovieArray[i]);
                $('#savedSearches .col').eq(i).attr('style', 'display:block');

            }
        }
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
})


//Loop to cycle through Taste Dive array and perform OMDB call for each item. Places each item into a returned movies array
function buildReturnedMovies(response) {
    returnedMovies = response;
    if(returnedMovies.Similar.Results.length < 8){
        M.Toast.dismissAll();
        M.toast({html: 'No Results Found'});
        savedMovieArray.shift();
        if (savedMovieArray.length >= 4 && savedMovieHolder != null) {
        savedMovieArray.push(savedMovieHolder);
        }
        sessionStorage.setItem('movieMeSavedMovieArray', JSON.stringify(savedMovieArray));
        return;
    }
    for (i = 0; i < returnedMovies.Similar.Results.length; i++) {

        var formattedMovieName = "";
        var returnedMovieTitle = returnedMovies.Similar.Results[i].Name;
        for(x=0;x<returnedMovieTitle.length;x++) {
            if (returnedMovieTitle.charCodeAt(x) == 8211) {
                formattedMovieName = formattedMovieName + '%2D';
            }
            else if(returnedMovieTitle.charCodeAt(x) == 58) {
                formattedMovieName = formattedMovieName + '%3A';
            }
            else if(returnedMovieTitle.charCodeAt(x) == 32) {
                formattedMovieName = formattedMovieName + '%20';
            }
            else if(returnedMovieTitle.charCodeAt(x) == 44) {
                formattedMovieName = formattedMovieName + '%2C';
            } 
            else if(returnedMovieTitle.charCodeAt(x) == 38) {
                formattedMovieName = formattedMovieName + '%26';
            }         
            else {
            formattedMovieName = formattedMovieName + returnedMovieTitle[x];
            }
        }
        var omdbQueryUrl = omdbBaseQueryUrl + formattedMovieName;
        console.log(omdbQueryUrl);
        apiCall(omdbQueryUrl, buildMovieArray);
      
    }
}


function buildMovieArray(response) {
    returnedMovie = response;
    if (returnedMovie.Response != 'False') {
    returnedMovieArray.push(returnedMovie);
    sessionStorage.setItem("movieMeMovieArray", JSON.stringify(returnedMovieArray));
    }
    if (returnedMovieArray.length >= 8) {
        window.location = "movies.html"
    }
}
//Generates search results page based on poster and title
function loadSearchResults() {
    for (i = 0; i < 8; i++) {
        if(returnedMovieArray[i].Response == "True") {  
        $("#content").find("img").eq(i).attr('src', returnedMovieArray[i].Poster);
        $("#content").find("img").eq(i).attr('data', i);
        $("#content").find(".card-content h5").eq(i).text(returnedMovieArray[i].Title);
        }
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
    sessionStorage.setItem('movieMeMovieChoice', JSON.stringify(movieChoice));
    window.location = "content.html"
}

function loadMovieContent() {
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



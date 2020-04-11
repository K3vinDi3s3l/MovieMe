// Initialize global variables
var returnedMovieArray = [];
var contentMovieChoice = [];
var savedMovieArray = [];
var savedMovieHolder="";
var videoSearchResults = [];

//Keybind for enter key in search box. Tests whether enter key was pressed and search box has data.
$('#search').keypress(function (event) {
    if (event.keyCode == 13 && $("#search").val() !="" ) {
        event.preventDefault();
        M.toast({html: 'Working on it!', displayLength: 15000	});
        sessionStorage.removeItem("movieMeMovieArray")
        var movie = $.trim($("#search").val());
        //Caps saved movies at 6. Stores last value in case nonsense was typed.
        while (savedMovieArray.length>5) {
            savedMovieHolder = savedMovieArray[5];
            savedMovieArray.pop();
        }
        savedMovieArray.unshift(movie);
        // Saves to session storage for use on other pages
        sessionStorage.setItem('movieMeSavedMovieArray', JSON.stringify(savedMovieArray));
        var movieName="";
        // Replaces spaces in movie title with HTML code
        for(i=0;i<movie.length;i++){
            if (movie[i] == ' '){
                movieName = movieName+ '%20';
            }
            else {
            movieName = movieName+movie[i];
            }
        }
        var tasteDiveBaseQueryUrl = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?type=movies&info=1&k=362316-MovieMe-NN3BYWU6&q=movie%3A"
        var tasteDiveQueryUrl = tasteDiveBaseQueryUrl + movieName;
        // Checks to see if saved searches are checked off and adds them as additional parameters
        for(i=0;i<6;i++) {
            var additionalSearchName = "";
            if ($('#savedSearches input').eq(i)[0].checked == true){
                var savedSearchName = $('#savedSearches input ~ span').eq(i).text();
                for(x=0;x<savedSearchName.length;x++){
                    if (savedSearchName.charCodeAt(x)==32) {
                        additionalSearchName = additionalSearchName + '%20';
                    }
                    else {
                        additionalSearchName = additionalSearchName + savedSearchName[x];
                    }
                }
                tasteDiveQueryUrl = tasteDiveQueryUrl+'%2Cmovie%3A'+additionalSearchName;
            }          
        }
        apiCall(tasteDiveQueryUrl, buildReturnedMovies);
    }
})

//Initializes pages on load. Gathers data from session storage, hides and displays elements
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

//Loop to cycle through Taste Dive array and perform OMDB call for each item. Places each item into a returned movies array
function buildReturnedMovies(response) {
    returnedMovies = response;
    // Checks for returned results. requires minimum of 12 in case some are invalid from OMDB
    if(returnedMovies.Similar.Results.length < 12){
        M.Toast.dismissAll();
        M.toast({html: 'No Results Found'});
        // Trims unfound result from saved searches. Replaces with removed value from beginning
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
        // Encodes returned characters as HTML codes for query
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
        var omdbBaseQueryUrl = "https://www.omdbapi.com/?apikey=14427a54&t="
        var omdbQueryUrl = omdbBaseQueryUrl + formattedMovieName;
        apiCall(omdbQueryUrl, buildMovieArray);  
    }
}

// Adds OMDB objects into array for later reference
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
            if (returnedMovieArray[i].Poster == 'N/A'){
                $("#content").find("img").eq(i).attr('src', 'assets/movies.gif');
            }
            else {
            $("#content").find("img").eq(i).attr('src', returnedMovieArray[i].Poster);
        }   
        $("#content").find("img").eq(i).attr('data', i);
        $("#content").find(".card-content h5").eq(i).text(returnedMovieArray[i].Title);
        }
    }
    $('#content img').on('click', function () {
        event.preventDefault();
        loadContentPage(event);
    })
}

//Navigates to content page once a movie poster is clicked
function loadContentPage(event) {
    var posterChoice = event.target.getAttribute('data');
    var movieChoice = returnedMovieArray[posterChoice];
    sessionStorage.setItem('movieMeMovieChoice', JSON.stringify(movieChoice));
    window.location = "content.html"
}

//Dynamically generates information on the content page
function loadMovieContent() {
    if (contentMovieChoice.Poster == "N/A") {
        $('#content').find('.poster').attr('src', 'assets/movies.gif');
    }
    else {
        $('#content').find('.poster').attr('src', contentMovieChoice.Poster);
    }    
    $('#content').find('h4').text(contentMovieChoice.Title);
    $('#content').find('.rated').text("Rated: " + contentMovieChoice.Rated);
    $('#content').find('.released').text("Released: " + contentMovieChoice.Released);
    $('#content').find('.runtime').text("Runtime: " + contentMovieChoice.Runtime);
    $('#content').find('.genre').text("Genre: " + contentMovieChoice.Genre);
    $('#content').find('.director').text("Director: " + contentMovieChoice.Director);
    $('#content').find('.description').text("Plot: " + contentMovieChoice.Plot);       
    for (i = 0; i < contentMovieChoice.Ratings.length; i++) {
        $("#ratings-list").find("li").eq(i).text(contentMovieChoice.Ratings[i].Source + ": " + contentMovieChoice.Ratings[i].Value);
    }
    var movieStored = $.parseJSON(sessionStorage.getItem("movieMeMovieChoice"))
    var movieSelected = movieStored.Title
    var releaseYear = parseInt(movieStored.Year)
    var tmdbMovieSearchURL = "https://api.themoviedb.org/3/search/movie?api_key=8906f66d9af7f1f04b7db42d2121078c&language=en-US&query=" + movieSelected + "&page=1&include_adult=false&year=" + releaseYear;
    apiCall(tmdbMovieSearchURL, buildMovieId)
}   

//Extracts movie ID from TMDB call.
function buildMovieId(response) {
    var movieID = response.results[0].id;
    var tmdbVideoSearchURL = "https://api.themoviedb.org/3/movie/" + movieID + "/videos?api_key=8906f66d9af7f1f04b7db42d2121078c&language=en-US";
    apiCall(tmdbVideoSearchURL, buildVideos);
}

//Extracts all returned videos from TMDB call and builds containers for videos on content page
function buildVideos(response) {
    for (let i = 0; i < response.results.length; i++) {
        const videoKey = response.results[i].key;
        var youtubeUrl = "https://www.youtube.com/embed/" + videoKey;
        videoSearchResults.push(youtubeUrl);
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
    }    
}

//Makes an API call and then calls the function in the second argument. Requires a URL as the first argument and function as the second
function apiCall(apiQuery, apiFunction) {
    $.ajax({
        url: apiQuery,
        method: "GET"
    }).then(apiFunction)
}
var tasteDiveApiKey = "362316-MovieMe-NN3BYWU6";
var tasteDiveQueryUrl = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?q=

//Event handler to capture search field from input box.

//Constructs a Taste Dive query URL from the search field input box


//Adds the search field box input to a searched history array


//Loop to cycle through Taste Dive array and perform OMDB call for each item. Places each item into a returned movies array


//Generates search results page based on poster and title


//Event handler for search results click


//Generate content page from search results click



//Calls the Taste Dive API with a constructed URL. Returns an array of objects
function searchTasteDive(tasteDiveQuery){
    $.ajax({url: tasteDiveQuery,
    method: "GET"
    }).then(function(response) {
    console.log(response); 
    })
}




searchTasteDive(tasteDiveQueryUrl);
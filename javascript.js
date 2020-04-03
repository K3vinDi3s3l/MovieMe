var tasteDiveApiKey = "362316-MovieMe-NN3BYWU6";
var tasteDiveQueryUrl = "https://cors-anywhere.herokuapp.com/https://tastedive.com/api/similar?q=red+hot+chili+peppers%2C+pulp+fiction";


function searchTasteDive(tasteDiveQuery){
    $.ajax({url: tasteDiveQuery,
    method: "GET"
    }).then(function(response) {
    console.log(response); 
    })
}

searchTasteDive(tasteDiveQueryUrl);
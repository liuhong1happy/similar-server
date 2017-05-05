const fetchUserName = function() {
    fetch('/api/user', {
        method: 'get'
    }).then(function(response) {
        console.log(response);
        response.json().then(function(json){
            document.getElementById('user-name').innerText = json.data.firstName+' '+json.data.lastName
        })
    }).catch(function(err) {
        console.log(err);
    });
}

window.onload = function() {
    document.body.style.backgroundColor = "#feffe9";
    // fetch user name by /api/user
    fetchUserName();
}


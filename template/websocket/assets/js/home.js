
let socket = null;
const fetchUserName = function() {
    fetch('/api/user', {
        method: 'get'
    }).then(function(response) {
        console.log(response);
        response.json().then(function(json){
            const userName = json.data.firstName+' '+json.data.lastName;
            document.getElementById('user-name').innerText = userName;
            socket.emit('connection', userName);
        })
    }).catch(function(err) {
        console.log(err);
    });
}

window.onload = function() {
    document.body.style.backgroundColor = "#feffe9";
    socket = io();
    // fetch user name by /api/user
    fetchUserName();
}





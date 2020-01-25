console.log('Client-side code running');


function timestamp(event) {
    var n = Date.now()/1000;
    document.getElementById("timestamp").innerHTML = n;
  }

function account() {
fetch('/admin/clicks', {method: 'GET'})
    .then(function(response) {
    if(response.ok) return response.json();
    throw new Error('Request failed.');
    })
    .then(function(data) {
    document.getElementById('account').innerHTML = "Pub :"+ data.address ;
    document.getElementById('privatekey').innerHTML=" Priv : "+data.privateKey;
    })
    .catch(function(error) {
    console.log(error);
    });
}


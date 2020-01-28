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

/* 
setInterval(function() {
  fetch('/analysis', {method: 'POST'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      document.getElementById('traitements').innerHTML = JSON.stringify(data);
    })
    .catch(function(error) {
      console.log(error);
    });
}, 2000);
*/

/*
function search(){
  fetch('/workflow/search', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      document.getElementById('result').innerHTML = "Envoi : " + JSON.stringify(data);
    })
    .catch(function(error) {
      console.log(error);
    });
}*/

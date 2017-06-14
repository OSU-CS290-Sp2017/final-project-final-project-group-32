function resignPlayer(node, parNode) {

  displayInputField(node, parNode);

  var salaryInput = document.getElementById('salary-input');
  var signButton = document.getElementById('sign-button');
  var exitButton = document.getElementById('exit-button');

  if(signButton) {
    signButton.addEventListener('click', function() {
      signPlayer(salaryInput.value, node, parNode)
    });
  }

  if(exitButton) {
    exitButton.addEventListener('click', function() {
      clearSign(parNode)
    });
  }
}

function clearSign(parNode) {
  removeInputOption(parNode);
  var resignButton = document.createElement("button");
  resignButton.setAttribute("type", "button");
  resignButton.setAttribute("class", "resign-player-button");

  var text = document.createTextNode('Re-sign');

  resignButton.appendChild(text);

  parNode.appendChild(resignButton);

  resignButton.addEventListener('click', function() {
    resignPlayer(this, this.parentNode)
  });
}

function removeInputOption(parNode) {
  var salaryInput = document.getElementById('salary-input');
  var signButton = document.getElementById('sign-button');
  var exitButton = document.getElementById('exit-button');
  parNode.removeChild(salaryInput);
  parNode.removeChild(signButton);
  parNode.removeChild(exitButton);
}

function signPlayer(salary, node, parNode) {
  if(salary < 815615)
  {
    salary = 815615;
  }

  removeInputOption(parNode);

  var salaryText = document.createTextNode('$'+salary);
  parNode.appendChild(salaryText);

  var teamSalary = document.getElementById('team-salary-total');
  var newTotal = teamSalary.textContent.substr(1, teamSalary.textContent.length-1);
  newTotal = parseInt(newTotal);
  salary = parseInt(salary);
  newTotal += salary;

  var teamName = document.getElementById('team-name');
  updateTeamSalary(teamName.textContent, newTotal);

  var playerName = parNode.previousElementSibling.textContent;
  var playerNameUrl = playerName;
  playerNameUrl = playerNameUrl.replace(/\s+/g, '');
  updatePlayerSalary(playerName, salary, playerNameUrl);

  teamSalary.textContent = '$'+newTotal;
}

function updatePlayerSalary(playerName, salary, playerNameUrl) {
  var postURL = "/players/" + playerNameUrl + "/updateSalary";

  var postRequest = new XMLHttpRequest();
  postRequest.open('POST', postURL);
  postRequest.setRequestHeader('Content-Type', 'application/json');
  postRequest.addEventListener('load', function(event) {
    var error;
    if(event.target.status !== 200) {
      error = event.target.response;
    }
    callback(error);
  });

  var postBody = {
    salary: salary,
    name: playerName
  };

  postRequest.send(JSON.stringify(postBody));
}

function updateTeamSalary(teamName, salary) {
  var postURL = "/teams/" + teamName + "/updateSalary";

  var postRequest = new XMLHttpRequest();
  postRequest.open('POST', postURL);
  postRequest.setRequestHeader('Content-Type', 'application/json');
  postRequest.addEventListener('load', function(event) {
    var error;
    if(event.target.status !== 200) {
      error = event.target.response;
    }
    callback(error);
  });

  var postBody = {
    salary: salary
  };

  postRequest.send(JSON.stringify(postBody));
}

function displayInputField(node, parNode) {
  var createInput = document.createElement("input");
  createInput.setAttribute("type", "number");
  createInput.setAttribute("placeholder", "Salary");
  createInput.setAttribute("id", "salary-input");

  var createButton = document.createElement("button");
  createButton.setAttribute("type", "button");
  createButton.setAttribute("id", "sign-button");

  var text = document.createTextNode('Sign');

  createButton.appendChild(text);

  var createExit = document.createElement("button");
  createExit.setAttribute("type", "button");
  createExit.setAttribute("id", "exit-button");

  var x = document.createTextNode('x');

  createExit.appendChild(x);

  parNode.removeChild(node);

  parNode.appendChild(createInput);
  parNode.appendChild(createButton);
  parNode.appendChild(createExit);
}

function makePick(node, parNode) {
  displayPickOptions(node, parNode);

  var pickInput = document.getElementById('pick-input');
  var draftButton = document.getElementById('draft-button');
  var exitButton = document.getElementById('exit-button');
  //var addPlayerButton = document.getElementById('add-player-button');

  if(draftButton) {
    draftButton.addEventListener('click', function() {
      draftPlayer(pickInput.value, node, parNode)
    });
  }

  if(exitButton) {
    exitButton.addEventListener('click', function() {
      clearDraft(node, parNode)
    });
  }
}

function draftPlayer(playername, node, parNode) {
  removeDraftOption(node, parNode);

  var pickname = document.createTextNode('playername');

  parNode.appendChild(pickname);

  var playerNameUrl = playername.replace(/\s+/g, '');
  var teamname = parNode.previousElementSibling.textContent;

  updatePlayerTeam(pickname, teamname, playerNameUrl);

  addPlayerToTeamSalary(pickname, teamname);

  if(parNode.parentNode.nextElementSibling)
  {
    var createPick = document.createElement("button");
    createPick.setAttribute("type", "button");
    createPick.setAttribute("id", "make-pick-button");

    var text = document.createTextNode('Make Pick');

    createPick.appendChild(text);

    parNode.parentNode.nextElementSibling.lastChild.appendChild(createPick);

    if(createPick) {
      createPick.addEventListener('click', makePick);
    }
  }
}

function addPlayerToTeamSalary(playername, teamname) {
  var postURL = "/teams/" + teamname + "/addPlayerSalary";

  var postRequest = new XMLHttpRequest();
  postRequest.open('POST', postURL);
  postRequest.setRequestHeader('Content-Type', 'application/json');
  postRequest.addEventListener('load', function(event) {
    var error;
    if(event.target.status !== 200) {
      error = event.target.response;
    }
    callback(error);
  });

  var postBody = {
    name: playername
  };

  postRequest.send(JSON.stringify(postBody));
}

function updatePlayerTeam(playername, teamname, playernameUrl) {
  var postURL = "/players/" + playernameUrl + "/updateTeam";

  var postRequest = new XMLHttpRequest();
  postRequest.open('POST', postURL);
  postRequest.setRequestHeader('Content-Type', 'application/json');
  postRequest.addEventListener('load', function(event) {
    var error;
    if(event.target.status !== 200) {
      error = event.target.response;
    }
    callback(error);
  });

  var postBody = {
    team: teamname,
    name: playername
  };

  postRequest.send(JSON.stringify(postBody));
}

function clearDraft(node, parNode) {
  removeDraftOption(node, parNode);

  var createPick = document.createElement("button");
  createPick.setAttribute("type", "button");
  createPick.setAttribute("id", "make-pick-button");

  var text = document.createTextNode('Make Pick');

  createPick.appendChild(text);

  parNode.appendChild(createPick);

  if(createPick) {
    createPick.addEventListener('click', function() {
      makePick(node, parNode)
    });
  }
}

function removeDraftOption(node, parNode) {
  var pickInput = document.getElementById('pick-input');
  var draftButton = document.getElementById('draft-button');
  var exitButton = document.getElementById('exit-button');
  //var addButton = document.getElementById('add-player-button');
  parNode.removeChild(pickInput);
  parNode.removeChild(draftButton);
  parNode.removeChild(exitButton);
  //parNode.removeChild(addButton);
}

function displayPickOptions(node, parNode)
{
  var createInput = document.createElement("input");
  createInput.setAttribute("type", "text");
  createInput.setAttribute("placeholder", "Player");
  createInput.setAttribute("id", "pick-input");

  var createButton = document.createElement("button");
  createButton.setAttribute("type", "button");
  createButton.setAttribute("id", "draft-button");

  var text = document.createTextNode('Draft');

  createButton.appendChild(text);

  var createExit = document.createElement("button");
  createExit.setAttribute("type", "button");
  createExit.setAttribute("id", "exit-button");

  var x = document.createTextNode('x');

  createExit.appendChild(x);

  var createAddPlayer = document.createElement("button");
  createAddPlayer.setAttribute("type", "button");
  createAddPlayer.setAttribute("id", "add-player-button");

  var text2 = document.createTextNode('New Player');

  createAddPlayer.appendChild(text2);

  parNode.removeChild(node);

  parNode.appendChild(createInput);
  parNode.appendChild(createButton);
  //parNode.appendChild(createAddPlayer);
  parNode.appendChild(createExit);
}

window.addEventListener('DOMContentLoaded', function(event) {
  var i = 0;

  var resignButtons = document.getElementsByClassName('resign-player-button');
  for(i = 0; i < resignButtons.length; i++) {
    if(resignButtons[i])
    {
      resignButtons[i].addEventListener('click', function() {
        resignPlayer(this, this.parentNode)
      });
    }
  }

  var makePickButton = document.getElementById('make-pick-button');
  if(makePickButton) {
    makePickButton.addEventListener('click', function() {
      makePick(this, this.parentNode)
    });
  }

});

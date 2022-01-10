const JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 333;

const JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

window.onload = function () {
	getData();
	setInterval(getData, POLLING_RATE);
};

var Asc = function (a, b) {
	if (a > b) return +1;
	if (a < b) return -1;
	return 0;
};

var Desc = function (a, b) {
	if (a > b) return -1;
	if (a < b) return +1;
	return 0;
};



function getData() {
	fetch(JSON_ENDPOINT)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendData(data);
		})
		.catch(function (err) {
			console.log("Error: " + err);
		});
}

function GetPlayerHP(data) {
	let mainContainer = document.getElementById("srtQueryData");
	var hitPercent = (data.Player.CurrentHP / data.Player.MaxHP) * 100;
	mainContainer.innerHTML += `<div class="hp"><div class="hpbar MainHP" style="width:${hitPercent}%">
		<div id="currenthp">${data.Player.CurrentHP} / ${data.Player.MaxHP}</div><div class="green" id="percenthp">${hitPercent.toFixed(1)}%</div></div></div>`;
}

function GetIGT(data){
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div id="Money"><div class="title">IGT: <font color="#00FF00">${formatGameTime(data.Stats.IGT)}</font></div></div>`;
}

function GetMoney(data){
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div id="Money"><div class="title">Green Gel: <font color="#00FF00">${data.GreenGel}</font></div></div>`;
}

function formatGameTime(gameTimeSecs) {
    const zeroPrefix = (str, digits=2) => str.length === digits ? str : `0${str}`;

    const hours = Math.floor(gameTimeSecs / 3600);
    gameTimeSecs = gameTimeSecs % 3600;
    const minutes = Math.floor(gameTimeSecs / 60);
    gameTimeSecs = gameTimeSecs % 60;

    const hoursStr = zeroPrefix(hours.toString());
    const minutesStr = zeroPrefix(minutes.toString());
    const secondsStr = zeroPrefix(gameTimeSecs.toFixed(0).toString(), digits=2);

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

function appendData(data) {
	//console.log(data);
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";

	//PlayerState, IGT
	GetPlayerHP(data);
	GetIGT(data);
	GetMoney(data);

	//var table = document.createElement("table");
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	
	//console.log("Filtered Enemies", filterdEnemies);
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		if (item.IsAlive) {
			mainContainer.innerHTML += `<div class="enemyhp"><div class="enemyhpbar danger" style="width:${(item.Percentage * 100).toFixed(1)}%">
			<div id="currentenemyhp">${item.CurrentHP}</div><div class="red" id="percentenemyhp">${(item.Percentage * 100).toFixed(1)}%</div></div></div>`;
		}
	});
}

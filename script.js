const resetButton = document.querySelector('#reset_button');
const gamearea = document.getElementById('game_area');
const player1_input = document.getElementById('player_1');
const player2_input = document.getElementById('player_2');

const areaSize = 444;


let player1 = {
    object : document.querySelector('#player1'),

    x : areaSize - 30,
    y : areaSize - 30,

    radius : 10,
    

    isUpPressed : false,
    isDownPressed : false,
    isLeftPressed : false,
    isRightPressed : false,

    speed : 3,

    score : 0
};

let player2 = {
    object : document.querySelector('#player2'),

    x : 10,
    y : 10,
    radius : 10,

    isUpPressed : false,
    isDownPressed : false,
    isLeftPressed : false,
    isRightPressed : false,

    speed : 3,

    score : 0
};


let baits = [];

window.onload = createRandomBaits(10);


document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e){
    if(e.key==='ArrowUp') {
        player1.isUpPressed = true;
    }

    if(e.key==='ArrowDown') {
        player1.isDownPressed = true;
    }

    if(e.key==='ArrowRight') {
        player1.isRightPressed = true;
    }

    if(e.key==='ArrowLeft') {
        player1.isLeftPressed = true;
    }

    if(e.key==='w') {
        player2.isUpPressed = true;
    }

    if(e.key==='s') {
        player2.isDownPressed = true;
    }

    if(e.key==='d') {
        player2.isRightPressed = true;
    }

    if(e.key==='a') {
        player2.isLeftPressed = true;
    }
}

function keyUp(e) {
    if(e.key==='ArrowUp') 
        player1.isUpPressed = false;
    if(e.key==='ArrowDown') 
        player1.isDownPressed = false;
    if(e.key==='ArrowRight') 
        player1.isRightPressed = false;
    if(e.key==='ArrowLeft') 
        player1.isLeftPressed = false;
    if(e.key==='w') 
        player2.isUpPressed = false;
    if(e.key==='s') 
        player2.isDownPressed = false;
    if(e.key==='d') 
        player2.isRightPressed = false;
    if(e.key==='a') 
        player2.isLeftPressed = false;
}


var game = setInterval(function(){
    play();
}, 20);

function play() {

    calculateNewPosition(player1);
    calculateNewPosition(player2);

    let crash = checkCrashPlayers();
    if(crash) {

        let winner = document.createElement('div');
        gamearea.appendChild(winner);
        
        
        if(player1.score>player2.score) {
            winner.innerHTML = '<p>Yeşil Kazandı</p>';
            winner.className = 'winner winner2';
        }
        if(player2.score>player1.score) {
            winner.innerHTML = '<p>Kırmızı Kazandı</p>';
            winner.className = 'winner winner1';
        }
        if(player2.score==player1.score) {
            winner.innerHTML = '<p>Berabere Kaldınız</p>';
            winner.className = 'winner';
        }

        clearInterval(game);
    }

    //yemle oyunculardan herhangibi kesistimi
    baitDistanceControl();
    displayNewPosition(player1);
    displayNewPosition(player2); 

}

function calculateNewPosition(player){
    if(player.isUpPressed) {
        player.y = Math.max(0, player.y - player.speed);
    }

    if(player.isDownPressed) {
        player.y = Math.min((areaSize - player.radius*2), player.y + player.speed);
    }

    if(player.isRightPressed) {
        player.x = Math.min((areaSize - player.radius*2), player.x + player.speed);
    }

    if(player.isLeftPressed) {
        player.x = Math.max(0, player.x - player.speed);
    }

}

function displayNewPosition(player){
    player.object.style.top = player.y + 'px';
    player.object.style.left = player.x + 'px';
    player.object.style.height = player.radius * 2 + 'px';
    player.object.style.width = player.radius * 2 + 'px';
}

function displayNewPositionBaits(){

}

function baitDistanceControl() {
    
    checkCrashBait(player1);
    checkCrashBait(player2);
}

function checkCrashPlayers() {
    return checkCrash(player1,player2);
}

function checkCrashBait(player) {
    for(var i=0; i<baits.length; i++) {
        var crash = checkCrash(player,baits[i]);

        if(crash){
            var baitArea = Math.pow(baits[i].radius, 2)*Math.PI;
            var playerArea = Math.pow(player.radius, 2)*Math.PI;
            var newRadius = Math.sqrt(((playerArea + baitArea)/Math.PI));
            player.radius = newRadius; 
            player.score += 1;
            
            if(player.speed>1.5) {
                player.speed -= 0.05;
            }
            
            

            baits[i].object.remove();//ekrandan kaldirdi
            baits.splice(i,1);//diziden cikardi
            //yeni yem ekle
            var newBait = createRandomBait();
            displayBait(newBait);
            
            if(player == player1) {
                player1_input.value = player.score;
            }

            if(player == player2) {
                player2_input.value = player.score;
            }

            
            
        }
    }
    return;
}

//eger iki obje kesisirse true dondurur
function checkCrash(object1, object2) {

    let spaceY = Math.abs((object1.y + object1.radius) - (object2.y + object2.radius));
    let spaceX = Math.abs((object1.x + object1.radius) - (object2.x + object2.radius));   

    let distance = Math.sqrt(Math.pow(spaceX, 2) + Math.pow(spaceY, 2));

    if(distance <= object1.radius + object2.radius) {
       return true;
    }
    return false;
}


function createRandomBaits(count) {

    for(var i=1; i<=count; i++) {
        createRandomBait();
    }

    displayBaits();
}

function createRandomBait() {
    //kenarlardan 30px bos birak. yemler biraz iceriden olsun.
    var emptyAreaSize = 30;
    var areaSizeSmall= areaSize - emptyAreaSize*2;
    var baitSize = 5;

    let x = Math.random()*areaSizeSmall+emptyAreaSize;
    let y = Math.random()*areaSizeSmall+emptyAreaSize;


    let bait = {
        x : x,
        y : y,
        radius : Math.random()*baitSize+3,
        object : null
    };

    baits.push(bait);

    return bait;
}

function displayBaits() {
    for(var i=0; i<baits.length; i++) {
        displayBait(baits[i]);
    }
}

function displayBait(b){

    let baitObject = document.createElement('div');
    baitObject.style.left = `${b.x}px`;
    baitObject.style.top = `${b.y}px`;
    baitObject.style.height =  `${b.radius * 2}px`
    baitObject.style.width =  `${b.radius * 2}px`

    baitObject.className = 'bait';

    b.object = baitObject; //olusan DOM elementini referans olarak bait nesnesininde icine at sonradan erimde kullanilabilsin

    gamearea.appendChild(baitObject);
}




resetButton.addEventListener('click', reset);

function reset() {
    location.reload();
}
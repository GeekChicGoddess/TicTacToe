$(document).ready(function () {

$(".tile").html("<img src='img/blank.png'>");
var imageX = "<img src=\"img/x.png\">";
var imageO = "<img src=\"img/O.png\">";
var imageBlank = "<img src=\"img/blank.png\">";
var id = "";
var gameboardArray = [
    ["upperRight", "center", "lowerLeft"],
    ["upperCenter", "center", "lowerCenter"],
    ["upperLeft", "upperCenter", "upperRight"],
    ["lowerLeft", "lowerCenter", "lowerRight"],
    ["upperLeft", "middleLeft", "lowerLeft"],
    ["upperRight", "middleRight", "lowerRight"],
    ["upperLeft", "center", "lowerRight"],
    ["middleLeft", "center", "middleRight"]

];
var gameStatusArray = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
];
var playerX = true;
var playerO = false;
var xInARow = 0;
var oInARow = 0;
var idToRevert = "";
var XorO = "";
var image = "";
var housePlay = "";
var player = "";
var autoplaying = false;
var round = 1;
function arrayTheSame(array, temp) {
    for (var i = 0; i < temp.length; i++) {
        for (var j = 0; j < temp[i].length; j++) {
            if (temp[i][j] != array[i][j]) {
                idToRevert = array[i][j];
                return false;
                break;
            }
        }
    }
    return true;
}

var tempArray = gameboardArray.map(function (arr) {
    return arr.slice();
});
var tempStatusArray = gameStatusArray.slice();

var noOtherChanges = "";
var indexMarker = 0;
function updateGameStatus (i, j){
    if (XorO==="X"){
        if (j===0){
            indexMarker = 1;
        }
        else if(j===1) {
            indexMarker = 3;
        }
        else {
            indexMarker = 9;
        }
    }
    else {
        if (j===0){
            indexMarker = -20;
        }
        else if(j===1) {
            indexMarker = -40;
        }
        else {
            indexMarker = -80;
        }
    }
    tempStatusArray[i] += indexMarker;
}

function spliceXorO(id) {
    for (var i = 0; i < tempArray.length; i++) {
        for (var j = 0; j < tempArray[i].length; j++) {
            if (tempArray[i][j] == id) {
                tempArray[i].splice(j, 1, XorO);
                updateGameStatus(i, j);
            }
        }
    }
}

function flipTheTile (whatIsThis, image){
    console.log("flip is running");
    var degreesIncrease = 10;

    var flipInterval = setInterval(function () {
        console.log("interval running")
        if(degreesIncrease<180) {
            degreesIncrease++;
            $(whatIsThis).css("transform", "rotate3d(0,1,0," + degreesIncrease + "deg)");
        }
        else{ clearInterval(flipInterval); }
    }, 5);

    setTimeout(function () {
        $(whatIsThis).html(image);
        // $(whatIsThis).css("transform", "none");
    },400);

}

function makeReadyForNextPlayer (id){
    xInARow = 0;
    oInARow = 0;
    gameboardArray = [];
    gameStatusArray = [];
    gameboardArray = tempArray.map(function (arr) {
        return arr.slice();
    });
    gameStatusArray = tempStatusArray.slice();

    $(id).off("click");

    if (!playerX) {
        playerX = true;
        playerO = false;
    }
    else {
        playerX = false;
        playerO = true;
    }
}

    function resetTheGameBoard() {
        $("#winner").css("display", "none");
        $("#error").css("display", "none");
        $("#autoDraw").css("display", "none");
        $(".tile").on('click', tileClick);
        $(".tile").html("<img src='img/blank.png'>");
        id = "";
        gameboardArray = [
            ["upperRight", "center", "lowerLeft"],
            ["upperCenter", "center", "lowerCenter"],
            ["upperLeft", "upperCenter", "upperRight"],
            ["lowerLeft", "lowerCenter", "lowerRight"],
            ["upperLeft", "middleLeft", "lowerLeft"],
            ["upperRight", "middleRight", "lowerRight"],
            ["upperLeft", "center", "lowerRight"],
            ["middleLeft", "center", "middleRight"]
        ];
        gameStatusArray = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ];
        xInARow = 0;
        oInARow = 0;
        round = 1;
        tempArray = gameboardArray.map(function (arr) {
            return arr.slice();
        });
        tempStatusArray = gameStatusArray.slice();
    }

    $("#startover").click(function(){
        resetTheGameBoard();
        autoplaying = false;
    });

function doWeHaveAWinner (){
    loop1: for (var x = 0; x < tempArray.length; x++){
        xInARow = 0;
        oInARow = 0;
        for (var y = 0; y < tempArray[x].length; y++){
            if (tempArray[x][y] === "X"){
                xInARow +=1;
            }
            else if (tempArray[x][y] === "O"){
                oInARow +=1;
            }
            if(xInARow===3 || oInARow===3){
                $("#winner").text(XorO + " WINS!!");
                $("#winner").css("display", "inline");
                $(".tile").off('click', tileClick);
                return true;
                break loop1;
            }
        }
    }
    return false;
}

function isItADraw() {
    var draw = 0;
    for (var i = 0; i < tempArray.length; i++) {
        for (var j = 0; j < 3; j++) {
            if (tempArray[i][j] !== "O" && tempArray[i][j] !== "X") {
                draw = 1;
            }
        }
    }
    if (draw===0){
        $("#winner").text("It's a Draw!");
        $("#winner").css("display", "inline");
    }
}

$(".tile").on('click', tileClick);

function tileClick () {
    $("#winner").css("display", "none");
    $("#error").css("display", "none");
    $("#autoDraw").css("display", "none");

    XorO = "";

    if (playerX) {
        image = imageX;
        XorO = "X";
    }
    if (playerO) {
        image = imageO;
        XorO = "O";
    }
    noOtherChanges = arrayTheSame(gameboardArray, tempArray);

    if (!noOtherChanges) {

        idToRevert = "#" + idToRevert;
//            $(idToRevert).html(imageBlank);
        flipTheTile(idToRevert, imageBlank);

        tempArray = [];
        tempArray = gameboardArray.map(function (arr) {
            return arr.slice();
        });
        tempStatusArray = gameStatusArray.slice();

    }

    id = $(this).attr("id");
    spliceXorO(id); // splice the clicked tile into the temp Array
    var whatIsThis = this;
    flipTheTile(whatIsThis, image);
    doWeHaveAWinner();
    isItADraw();
    $("#commit").css("background-color", "orangered");
}


$("#commit").click(function () {

    id = "#" + id;
    if ((id.indexOf("##") != -1) || arrayTheSame(gameboardArray, tempArray)) {
        $("#error").text("You must make a selection first");
        $("#error").css("display", "inline");
    }
    else {
        makeReadyForNextPlayer(id);
        $("#commit").css("background-color", "beige");
        if (autoplaying) {
            autoplay();
        }
    }
});

// BEGINNING OF AUTOPLAY FUNCTIONS ----------------------------------------------------------------

function defense() {
    if(housePlay==="X") {
        if (round === 2) {
            if (gameStatusArray[7]===-17){
                id = gameboardArray[4][0];
                spliceXorO(id);
                return true;
            }
            else if (gameStatusArray[7]===-77){
                id = gameboardArray[5][0];
                spliceXorO(id);
                return true;
            }
        }
        else {
            for (var d = 0; d < gameStatusArray.length; d++) {
                if (gameStatusArray[d] == -120) {  //play in i0
                    id = gameboardArray[d][0];
                    spliceXorO(id);
                    return true;
                    break;
                }
                else if (gameStatusArray[d] == -100) {
                    console.log("100");
                    id = gameboardArray[d][1];
                    spliceXorO(id);
                    return true;
                    break;
                    //play in i1
                }
                else if (gameStatusArray[d] == -60) {
                    id = gameboardArray[d][2];
                    spliceXorO(id);
                    return true;
                    break;
                    //play in i2
                }
            }
        }
    }
    else {
        if (round === 1) {
            if ((gameStatusArray[2]===3)){
                id = gameboardArray[4][0];
                spliceXorO(id);
                return true;
            }
            else if ((gameStatusArray[3] === 3)) {
                id = gameboardArray[4][2];
                spliceXorO(id);
                return true;
            }
            else if ((gameStatusArray[7] === 1)) {
                id = gameboardArray[4][0];
                spliceXorO(id);
                return true;
            }
            else if ((gameStatusArray[7] === 9)) {
                id = gameboardArray[5][0];
                spliceXorO(id);
                return true;
            }
        }
        else {
            for (var d = 0; d < gameStatusArray.length; d++) {
                if (gameStatusArray[d] == 12) {
                    id = gameboardArray[d][0];
                    spliceXorO(id);
                    return true;
                    break;
                    // /play in i0
                }
                else if (gameStatusArray[d] == 10) {
                    //play in i1
                    id = gameboardArray[d][1];
                    console.log("Defense and id is " + id);
                    spliceXorO(id);
                    return true;
                    break;
                }
                else if (gameStatusArray[d] == 4) {
                    //play in i2
                    id = gameboardArray[d][2];
                    console.log("Defense and id is " + id);
                    spliceXorO(id);
                    return true;
                    break;
                }
            }
        }
    }
    return false;
}
function playCenter () {
    if (gameboardArray[0][1] === "center") {
        id = "center";
        spliceXorO(id);
        return true;
    }
    else{
        return false;
    }
}

function goForTheWin () {

    if (housePlay === "X") {

        for (var i = 0; i < gameStatusArray.length; i++) {
            if (gameStatusArray[i] === 12) {  //play in i0
                id = gameboardArray[i][0];
                spliceXorO(id);
                return true;
                break;
            }
            if (gameStatusArray[i] === 10) {  //play in i1
                id = gameboardArray[i][1];
                spliceXorO(id);
                return true;
                break;
            }
            if (gameStatusArray[i] === 4) {  //play in i2
                id = gameboardArray[i][2];
                spliceXorO(id);
                return true;
                break;
            }
        }
    }
    else {
        for (var i = 0; i < gameStatusArray.length; i++) {
            if (gameStatusArray[i] === -120) {  //play in i0
                id = gameboardArray[i][0];
                spliceXorO(id);
                return true;
                break;
            }
            if (gameStatusArray[i] === -100) {  //play in i1
                id = gameboardArray[i][1];
                spliceXorO(id);
                return true;
                break;
            }
            if (gameStatusArray[i] === -60) {  //play in i2
                id = gameboardArray[i][2];
                spliceXorO(id);
                return true;
                break;
            }
        }
    }

    return false;
}

function goForTwoInaRow () {
    if (housePlay === "X") {
        for (var i = 0; i < gameStatusArray.length; i++) {
            if ((gameStatusArray[i] === 9) || (gameStatusArray === 3)) {  //play in i0
                id = gameboardArray[i][0];
                spliceXorO(id);
                return true;
                break;
            }
            if (gameStatusArray[i] === 1) {  //play in i2
                id = gameboardArray[i][2];
                spliceXorO(id);
                return true;
                break;
            }
        }
    }
    else {
        for (var i = 0; i < gameStatusArray.length; i++) {
            if ((gameStatusArray[i] === -80) || (gameStatusArray === -40)) {  //play in i0
                id = gameboardArray[i][0];
                spliceXorO(id);
                return true;
                break;
            }
            if (gameStatusArray[i] === -20) {  //play in i2
                id = gameboardArray[i][2];
                spliceXorO(id);
                return true;
                break;
            }
        }
    }
    return false;
}


function startNewRow () {
    if((gameStatusArray[2]===0 && gameStatusArray[4]===0)&& (gameboardArray[6][2] !== "X" && gameboardArray[6][2] != "O")){
        id="upperLeft";
        spliceXorO(id);
        return true;
    }
    else if((gameStatusArray[4]===0 && gameStatusArray[3]===0)&&(gameboardArray[0][0] !== "X" && gameboardArray[0][0] != "O")){
        id="lowerLeft";
        spliceXorO(id);
        return true;
    }
    else if((gameStatusArray[3]===0 && gameStatusArray[5]===0)&&(gameboardArray[6][0] !== "X" && gameboardArray[6][0] != "O")){
        id="lowerRight";
        spliceXorO(id);
        return true;
    }
    else if((gameStatusArray[5]===0 && gameStatusArray[2]===0)&&(gameboardArray[2][2] !== "X" && gameboardArray[2][2] != "O")){
        id="upperLeft";
        spliceXorO(id);
        return true;
    }
    else if(gameStatusArray[2]===0 && gameStatusArray[4]===0){
        id="upperLeft";
        spliceXorO(id);
        return true;
    }
    else if(gameStatusArray[4]===0 && gameStatusArray[3]===0){
        id="lowerLeft";
        spliceXorO(id);
        return true;
    }
    else if(gameStatusArray[3]===0 && gameStatusArray[5]===0){
        id="lowerRight";
        spliceXorO(id);
        return true;
    }
    else if(gameStatusArray[5]===0 && gameStatusArray[2]===0){
        id="upperLeft";
        spliceXorO(id);
        return true;
    }
    else {
        for (var i = 0; i < gameStatusArray.length; i++){
            if (gameStatusArray[i]===0){
                id=gameboardArray[i][1];
                spliceXorO(id);
                return true;
            }
        }
    }


    return false;
}

function playToaDraw () {
    console.log("playToADraw");
    if (housePlay === "X" && gameStatusArray[2] !== 0 && gameStatusArray[3] !== 0 && gameStatusArray[7]===3) {
        id = gameboardArray[7][0];
        spliceXorO(id);
        return true;
    }
    else if (housePlay === "O" && gameStatusArray[2] !== 0 && gameStatusArray[3] !== 0 && gameStatusArray[7]===-20) {
        id = gameboardArray[7][0];
        spliceXorO(id);
        return true;
    }
    else {
        for (var i = 0; i < gameStatusArray.length; i++) {
            if ((gameStatusArray[i] === -77) || (gameboardArray[i] === -31)) {  //play in i0
                id = gameboardArray[i][0];
                spliceXorO(id);
                return true;
                break;
            }
            else if ((gameStatusArray[i] === -11) || (gameStatusArray === -79)) {  //play in i1
                id = gameboardArray[i][1];
                spliceXorO(id);
                return true;
                break;
            }
            else if ((gameStatusArray[i] === -39) || (gameStatusArray === -17)) {  //play in i2
                id = gameboardArray[i][2];
                spliceXorO(id);
                return true;
                break;
            }
            else {
            }
        }
    }
}

function autoplay() {
    $("#autoDraw").css("display", "none");
    id = "";
    if (housePlay == "X") {
        XorO = "X";
        image = imageX;
    }
    else if (housePlay == "O") {
        XorO = "O";
        image = imageO;
    }
    else{}
    var houseWins = (goForTheWin());
    if (!houseWins) {
        var defended = (defense());
        if (!defended) {
            var houseWinsagain = (goForTheWin());
            if (!houseWinsagain) {
                var center = (playCenter());
                if (!center) {
                    var getTwo = (goForTwoInaRow());
                    if (!getTwo) {
                        var newRow = (startNewRow());
                        if (!newRow) {
                            playToaDraw();
                        }
                    }
                }
            }
        }
    }
    id = "#" + id;
    flipTheTile(id, image);
    doWeHaveAWinner();
    isItADraw();
    makeReadyForNextPlayer(id);
    round++;
}

$("#auto").click(function(){
//        first reset the game board =================================================================
    resetTheGameBoard();
//    start the autoplaying event ============================================================
    autoplaying = true;
    var whoGoesFirst = Math.floor(Math.random()*2.9);
    if (whoGoesFirst == 1){
        housePlay = "X";
        player = "O";
        playerX=true;
        playerO=false;
        $("#autoDraw").text("House wins dice roll and goes first.");
        $("#autoDraw").css("display", "inline");

        (setTimeout(function(){
        autoplay();
        },2000));
    }
    else{
        housePlay = "O";
        player = "X";
        playerX=true;
        playerO=false;
        $("#autoDraw").text("Dice roll says you are X and go first");
        $("#autoDraw").css("display", "inline");
    }

});


});

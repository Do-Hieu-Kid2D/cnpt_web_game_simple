const startScreen = document.getElementById("start-screen");
const boardgame = document.getElementById("boardgame");
const canvas = document.getElementById("canvas");
//button setting
const setting = document.getElementById("imageButton");
//header setting
const header = document.getElementById("header-setting");
const ctx = canvas.getContext("2d");
//score
const scoreLabel = document.getElementById("numscore");
const score = document.getElementById("score");
//image táo
var image = new Image();
image.src = "/static/game/ran/Image/food.png";
var imageGrapes = new Image();
imageGrapes.src = "/static/game/ran/Image/grapes.png";
var imageBanana = new Image();
imageBanana.src = "/static/game/ran/Image/banana.png";
var imageMango = new Image();
imageMango.src = "/static/game/ran/Image/mango.png";
var imagePeach = new Image();
imagePeach.src = "/static/game/ran/Image/peach.png";
var imageStrawberry = new Image();
imageStrawberry.src = "/static/game/ran/Image/strawberry.png";
let listFruits = [imageGrapes, imageBanana, imageMango, imagePeach, imageStrawberry];
// Nhạc nền
const musicSound = new Audio('/static/game/ran/Music/music.mp3');
var musicCheckbox = document.getElementById("music-checkbox");
var musicSettingCheckbox = document.getElementById("music-setting-checkbox");
//button tiếp tục
var continueButton = document.getElementById("continuebutton");
//button trang chủ
var homeButton = document.getElementById("homebutton");
//button nextlevel
var nextlevelButton = document.getElementById("nextlevel");
//button reset
var resetButton = document.getElementById("resetbutton");
let isMusic = false;
//số cột, dòng và size từng ô
const col = 30;
const row = 20;
const cellSize = 25;
//matrix boardgame
let matrix = [];
//Thức ăn
let food;
//Cổng win
let gateWin;
//biến check draw hay không
let timeout = null;
let isDraw = true;
//set time đếm ngược
var count = 3;
var countIntervalId = null;
//time game
var timeGame;
var gameIntervalId = null;
var labeltimegame = document.getElementById("labelTimeGame");
var timegameLabel = document.getElementById("time-game");
// create snake
let snake;
let head; //Đầu con rắn
//Hướng đi của snake
let direction;
//THời gia nhạy phím
let lastPress;
//Level
let levelArray = ["1", "2", "3", "4", "5", "6"];
let levelGame = 0;
//score
let numberScore = 15;
//kiểm tra win
let checkWin = true;
//level4 sinh ton
let timeLeft = 10; // thời gian còn lại ban đầu là 10s
const timerBar = document.getElementById("timer-bar");
const timeContainer = document.getElementById("timer-container");
intervalIdHungry = null;
//level5 an trai cay
let fruits = [];
let numberApple = 0;
let randomFruit1;
let numFruit1 = 0;;
let randomFruit2;
let numFruit2 = 0;
var labelFruits = document.getElementById("fruits");
var muctieuFruits = document.getElementById("fruit-game");
var timeFruits;
var fruitsIntervalId = null;
const timeFruitsLabel = document.getElementById("time-lable-fruits");
const countFruits = document.getElementById("time-fruits");
//title level in boardgame
const titleLevel = document.getElementById("title-level");
//rules
const rulesButton = document.getElementById("rulesbutton");
const rulesDiv = document.getElementById("rulesdiv");
const rulesOk = document.getElementById("rulesok");
const rulesHeader = document.getElementById("level-header");
const rulesText = document.getElementById("rules-text");

var isJoin = false;

//speed 
var speed = 80;
// Viết sự kiện bàn phím di chuyển rắn
// a, arrow left: Left
// s, arrow down: Down
// d, arrow right: Right
// w, arrow up: Up
document.addEventListener("keydown", event => {
    const now = Date.now();
    const elapsed = now - lastPress;
    if (countIntervalId == null) {
        if (elapsed > 50) {
            switch (event.key) {
                case "ArrowUp":
                    if (direction !== "down") {
                        direction = "up";
                    }
                    break;
                case "ArrowDown":
                    if (direction !== "up") {
                        direction = "down";
                    }
                    break;
                case "ArrowLeft":
                    if (direction !== "right") {
                        direction = "left";
                    }
                    break;
                case "ArrowRight":
                    if (direction !== "left") {
                        direction = "right";
                    }
                    break;
                case "w":
                    if (direction !== "down") {
                        direction = "up";
                    }
                    break;
                case "s":
                    if (direction !== "up") {
                        direction = "down";
                    }
                    break;
                case "a":
                    if (direction !== "right") {
                        direction = "left";
                    }
                    break;
                case "d":
                    if (direction !== "left") {
                        direction = "right";
                    }
                    break;
            }
            lastPress = now;
        }
    }
});
// set up the game loop
function gameLoop() {
    if (isDraw) {
        // move the snake
        if (checkWin) {
            head = { x: snake[0].x, y: snake[0].y };
            switch (direction) {
                case "up":
                    head.y -= 1; //trên
                    break;
                case "down":
                    head.y += 1; //dưới
                    break;
                case "left":
                    head.x -= 1; //trái
                    break;
                case "right":
                    head.x += 1; //phải
                    break;
            }
            //thêm 1 node vào đầu mảng của snake
            snake.unshift(head);
        }
        //cho phép đi xuyên tường, nếu vượt ngưỡng trên thì sẽ xuất hiện phía dưới và ngược lại , tương tự trái, phải
        if (head.x < 0) {
            head.x = col - 1;
        }
        if (head.x >= col) {
            head.x = 0;
        }
        if (head.y < 0) {
            head.y = row - 1;
        }
        if (head.y >= row) {
            head.y = 0;
        }

        //level 5 và 6
        if (levelGame == 4 || levelGame == 5) {
            for (let i = 0; i < fruits.length; i++) {
                //khi ăn được trái cây theo nhiệm vụ, sẽ tăng count trái cây nhiệm vụ đó lên
                if (fruits[i] != null && head.x === fruits[i].x && head.y === fruits[i].y) {
                    if (i == randomFruit1) {
                        numFruit1++;
                        updateFruitsLabel();
                    }
                    else if (i == randomFruit2) {
                        numFruit2++;
                        updateFruitsLabel();
                    }
                    //khi ăn rồi cho giá trị null để ẩn trên canvas
                    fruits[i] = null;
                }
            }
        }
        // Kiểm tra rắn có ăn mồi hay không
        if (food != null && head.x === food.x && head.y === food.y) {
            //score
            //level4 và 6: khi ăn được mồi sẽ hồi lại thời gian sống của snake
            if (levelGame == 3 || levelGame == 5) {
                timeLeft = 10;
                timerBar.style.transform = `scaleX(${1})`;
            }
            //level5 và 6: 
            if (levelGame == 4 || levelGame == 5) {
                numberApple += 1;
                //khi ăn được số táo chẵn, sẽ hiện ra vật phẩm
                if (numberApple > 0 && numberApple % 2 == 0) {
                    createFruits();
                    timeFruits = 6;
                    countFruits.innerHTML = timeFruits;
                    timeFruits -= 1;
                    timeFruitsLabel.style.display = 'inline';
                    clearInterval(fruitsIntervalId);
                    countTimeFruits();
                }
            }
            //tạo thức ăn cho snake
            if (numberScore > 1) {
                food = createFood();
                numberScore -= 1;
            }
            else {
                numberScore -= 1;
                //level 5 chỉ cần làm nhiệm vụ nên không cần mở cổng win
                if (levelGame != 4) {
                    gateWin = createFood();
                }
                // level 5, 6: đạt yêu cầu số apple vẫn tạo tiếp số lượng apple
                if (levelGame == 5 || levelGame == 4) {
                    food = createFood();
                }
                //các level còn lại ngừng tạo food do đã có cổng win
                else {
                    food = null;
                }
            }

        }
        //snake chui vào cổng win 
        else if (gateWin != null && head.x === gateWin.x && head.y === gateWin.y) {
            // dừng rắn duy chuyển
            checkWin = false;
            //rút ngắn snake lại
            snake.pop();
        }
        //duy chuyển rắn: tăng phần đầu, nên giảm phần cuối
        else {
            snake.pop();
        }

        draw();
        // Kiểm tra va chạm tường hay không
        if (matrix[head.y][head.x] === 1) {
            //va chạm vào tường -> thua
            loseGame();
            return;
        }
        // Check conflict
        if (checkConflict()) {
            loseGame();
            return
        }
        // Check win
        if (snake.length == 0) {
            //level 6, nếu rắn chui vào cổng win nhưng chưa xong nhiệm vụ sẽ lose
            if (levelGame == 5) {
                if (numFruit1 >= 1 && numFruit2 >= 2) {
                    winGame();
                    return;
                }
                else {
                    loseGame();
                    return;
                }
            }
            //level khác thì win
            else {
                winGame();
                return;
            }

        }
        // schedule the next frame
        //speed
        timeout = setTimeout(gameLoop, speed);
    }
}

function loseGame() {
    //hiển thị div setting
    settingControl();
    //chỉnh sửa tiêu đề
    header.innerText = "You Lose!!!";
    //ẩn button tiếp tục
    continueButton.disabled = true;

}

function winGame() {
    //hiển div setting
    settingControl();
    //chỉnh sửa tiêu đề
    header.innerText = "You Win!!!";
    //ẩn button tiếp tục
    continueButton.disabled = true;
}

//checkbox music
musicCheckbox.addEventListener("change", function () {
    if (musicCheckbox.checked) {
        isMusic = true;
        // Bật nhạc
        console.log("Bat nhac")
        musicSound.play();
    } else {
        isMusic = false;
        // Tắt nhạc
        console.log("Tat nhac")
        musicSound.pause();
    }
    updateCheckboxMusic();
});

//checkbox music in setting
musicSettingCheckbox.addEventListener("change", function () {
    if (musicSettingCheckbox.checked) {
        isMusic = true;
        // Bật nhạc
        console.log("Bat nhac")
        musicSound.play();
    } else {
        isMusic = false;
        // Tắt nhạc
        console.log("Tat nhac")
        musicSound.pause();
    }
    updateCheckboxMusic();
})

//function update music
function updateCheckboxMusic() {
    if (isMusic) {
        musicCheckbox.checked = true;
        musicSettingCheckbox.checked = true;
    }
    else {
        musicCheckbox.checked = false;
        musicSettingCheckbox.checked = false;
    }
}

//function dem thoi gian hungry cua snake
function timeHungry() {
    intervalIdHungry = setInterval(() => {
        if (isDraw) {
            if (timeLeft <= 0) {
                clearInterval(intervalIdHungry);
                // xử lý game over   
                loseGame();
                return;
            }
            timeLeft -= 1;
            const percentageLeft = (timeLeft / 10) * 100;
            timerBar.style.transform = `scaleX(${percentageLeft / 100})`;
        }
    }, 1000);
}

//function dem thoi gian ton tai cua fruits
function countTimeFruits() {
    fruitsIntervalId = setInterval(() => {
        if (isDraw) {
            //hiển thị thời gian đếm ngược vật phẩm
            countFruits.innerHTML = timeFruits;
            timeFruits--;
            if (timeFruits < 0) {
                clearInterval(fruitsIntervalId);
                nullFruits();
                timeFruitsLabel.style.display = 'none';
                return;
            }
        }
    }, 1000);
}

//function create null fruits
//tạo null cho các fruits để không vẽ lên canvas
function nullFruits() {
    for (let i = 0; i < fruits.length; i++) {
        fruits[i] = null;
    }
}

//function dem thoi gian game
function countDown() {
    gameIntervalId = setInterval(() => {
        if (isDraw) {
            //hiển thị thời gian của game
            timegameLabel.innerHTML = timeGame;
            timeGame--;
            if (timeGame < 0) {
                clearInterval(gameIntervalId);
                if (levelGame == 2 || levelGame == 5) {
                    // level 3,6 nếu quá thời gian sẽ thua
                    loseGame();
                    return;
                }
                else if (levelGame == 4) {
                    // level 5
                    // kiểm tra số lượng vật phẩm đạt được
                    if (numFruit1 >= 1 && numFruit2 >= 2) {
                        winGame();
                    }
                    else {
                        loseGame();
                    }
                    return;
                }
            }
        }
    }, 1000);
}

function settingControl() {
    //tiêu đề
    header.innerText = "Setting";
    //hiện div setting
    settingDiv.style.display = 'block';
    overlay.style.display = 'block';
    //dừng draw
    isDraw = false;
    //dừng các thời gian đếm lại, cho = null
    if (timeout != null) {
        clearTimeout(timeout);
        timeout = null;
    }
    if (countIntervalId != null) {
        clearInterval(countIntervalId);
        countIntervalId = null;
        count = 3;
    }
    if (gameIntervalId != null) {
        clearInterval(gameIntervalId);
        gameIntervalId = null;
    }
    if (intervalIdHungry != null) {
        clearInterval(intervalIdHungry);
        intervalIdHungry = null;
    }
    if (fruitsIntervalId != null) {
        clearInterval(fruitsIntervalId);
        fruitsIntervalId = null;
    }
    //nếu đang ở level 6 thì disabled nextlevel vì không lên tiếp lv được
    if (levelGame == 5) {
        nextlevelButton.disabled = true;
    }
}

// nhấn setting 
var settingDiv = document.getElementById('setting');
var overlay = document.getElementById('overlay');
setting.addEventListener('click', settingControl);
//button continue
continueButton.addEventListener('click', function () {
    settingDiv.style.display = 'none';
    overlay.style.display = 'none';
    isDraw = true;
    count = 3;
    start();
})
//button home
homeButton.addEventListener('click', function () {
    //ẩn div setting
    settingDiv.style.display = 'none';
    overlay.style.display = 'none';
    //hiển thị trang chủ
    startScreen.style.display = "flex";
    //Ẩn board game
    boardgame.style.display = "none";
    //ẩn button setting
    setting.style.display = "none";
    //ẩn title level
    titleLevel.style.display = "none";
})
//button reset
resetButton.addEventListener('click', function () {
    //ẩn div setting
    settingDiv.style.display = 'none';
    overlay.style.display = 'none';
    //join level
    level(levelArray[levelGame]);
})
//button nextlevel
nextlevelButton.addEventListener('click', function () {
    //ẩn div setting
    settingDiv.style.display = 'none';
    overlay.style.display = 'none';
    //join level tiếp theo
    level(levelArray[levelGame + 1]);
})
// Chọn Level
var levelButtons = document.querySelectorAll(".level-button");
levelButtons.forEach(function (button) {
    button.addEventListener("click", selectLevel);
});
//Join Board game
function joinBoardgame() {
    //ẩn trang chủ
    startScreen.style.display = "none";
    //hiển thị board game
    boardgame.style.display = "block";
    setting.style.display = "block";
    continueButton.disabled = false;
    //chiều dài, rộng canvas
    canvas.width = cellSize * col;
    canvas.height = cellSize * row;
}
// funciton chọn level
function selectLevel() {
    // Lấy giá trị của nút level được nhấn
    var levelNumber = this.getAttribute("data-level");
    level(levelNumber);
}
//hiển thị rules
function showRules() {
    overlay.style.display = "block";
    rulesDiv.style.display = "block";
    rulesHeader.innerText = "Level " + (levelGame + 1);
    rulesText.innerText = createTextRules(levelGame);
}
//button ok of rules
rulesOk.addEventListener('click', function () {
    rulesDiv.style.display = "none";
    if (!isJoin) {
        createGame(levelGame);
    }

})
//button rules của setting
rulesButton.addEventListener('click', showRules);
//create game
function createGame(levelGame) {
    //ẩn lớp phủ
    overlay.style.display = "none";
    nextlevelButton.disabled = false;
    //set interval cho cac thoi gian dem
    timeout = null;
    countIntervalId = null;
    gameIntervalId = null;
    intervalIdHungry = null;
    fruitsIntervalId = null;
    //draw
    isDraw = true;
    //khởi tạo cổng win
    gateWin = null;
    //biến cho rắn duy chuyển
    checkWin = true;
    //cho số apple reset
    numberApple = 0;
    //setup title level
    titleLevel.style.display = 'block';
    titleLevel.innerText = "Level " + (levelGame + 1);
    // Switch case chọn level
    switch (levelGame) {
        case 0:
            //setup label
            scoreLabel.style.display = 'inline';
            score.style.display = 'inline';
            labeltimegame.style.display = 'none';
            timeContainer.style.display = 'none';
            labelFruits.style.display = 'none';
            timeFruitsLabel.style.display = 'none';
            //số tạo rắn phải ăn
            numberScore = 15;
            //create matrix boardgame
            matrix = wallMatrix(levelGame);
            //create snake
            snake = [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 },
            ];
            // head snake
            head = { x: snake[0].x, y: snake[0].y };
            // create food for snake
            food = createFood();
            // direction of snake
            direction = "right";
            // độ tiếp nhận của bàn phím
            lastPress = 0;
            start();
            break;
        case 1:
            //setup label
            scoreLabel.style.display = 'inline';
            score.style.display = 'inline';
            labeltimegame.style.display = 'none';
            timeContainer.style.display = 'none';
            labelFruits.style.display = 'none';
            timeFruitsLabel.style.display = 'none';
            // Level 2
            //số táo rắn phải ăn
            numberScore = 15;
            //create matrix boardgame
            matrix = wallMatrix(levelGame);
            //create snake
            snake = [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 },
            ];
            // head snake
            head = { x: snake[0].x, y: snake[0].y };
            // create food for snake
            food = createFood();
            // direction of snake
            direction = "right";
            // độ tiếp nhận của bàn phím
            lastPress = 0;
            start();
            break;
        case 2:
            //setup label
            scoreLabel.style.display = 'inline';
            score.style.display = 'inline';
            labeltimegame.style.display = 'inline';
            timeContainer.style.display = 'none';
            labelFruits.style.display = 'none';
            timeFruitsLabel.style.display = 'none';
            // Level 3
            //số táo răn phải ăn
            numberScore = 15;
            //thời gian game
            timeGame = 60;
            //create matrix boardgame
            matrix = wallMatrix(levelGame);
            //create snake
            snake = [
                { x: 5, y: 13 },
                { x: 4, y: 13 },
                { x: 3, y: 13 },
            ];
            // head snake
            head = { x: snake[0].x, y: snake[0].y };
            // create food for snake
            food = createFood();
            // direction of snake
            direction = "right";
            // độ tiếp nhận của bàn phím
            lastPress = 0;
            start();
            break;
        case 3:
            //setup label
            scoreLabel.style.display = 'inline';
            score.style.display = 'inline';
            labeltimegame.style.display = 'none';
            timeContainer.style.display = 'inline';
            labelFruits.style.display = 'none';
            timeFruitsLabel.style.display = 'none';
            // Level 4
            //thời gian sống của rắm
            timeLeft = 10;
            timerBar.style.transform = `scaleX(${1})`;
            //số táo rắn phải ăn
            numberScore = 15;
            //create matrix boardgame
            matrix = wallMatrix(levelGame);
            //create snake
            snake = [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 },
            ];
            // head snake
            head = { x: snake[0].x, y: snake[0].y };
            // create food for snake
            food = createFood();
            // direction of snake
            direction = "right";
            // độ tiếp nhận của bàn phím
            lastPress = 0;
            start();
            break;
        case 4:
            //setup label
            scoreLabel.style.display = 'none';
            score.style.display = 'none';
            labeltimegame.style.display = 'inline';
            timeContainer.style.display = 'none';
            labelFruits.style.display = 'inline';
            timeFruitsLabel.style.display = 'none';
            // Level 5
            numberApple = 0;
            nullFruits();
            //tạo mục tiêu vật phẩm cho rắn
            randomFruit();
            //hiển thị label vật phẩm
            updateFruitsLabel();
            //thời gian game
            timeGame = 40;
            //create matrix boardgame
            matrix = wallMatrix(levelGame);
            //create snake
            snake = [
                { x: 10, y: 14 },
                { x: 9, y: 14 },
                { x: 8, y: 14 },
            ];
            // head snake
            head = { x: snake[0].x, y: snake[0].y };
            // create food for snake
            food = createFood();
            // direction of snake
            direction = "right";
            // độ tiếp nhận của bàn phím
            lastPress = 0;
            start();
            break;
        case 5:
            //setup label
            scoreLabel.style.display = 'inline';
            score.style.display = 'inline';
            labeltimegame.style.display = 'inline';
            timeContainer.style.display = 'inline';
            labelFruits.style.display = 'inline';
            timeFruitsLabel.style.display = 'none';
            // Level 6
            // ăn 10 quả táo
            numberScore = 10;
            // set thời gian game 50s           
            timeGame = 50;
            //thời gian đói của rắn
            timeLeft = 10;
            numberApple = 0;
            nullFruits();
            timerBar.style.transform = `scaleX(${1})`;
            //vật phẩm
            randomFruit();
            updateFruitsLabel();
            //tạo map game(khó)
            matrix = wallMatrix(levelGame);
            //create snake
            snake = [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 },
            ];
            // head snake
            head = { x: snake[0].x, y: snake[0].y };
            // create food for snake
            food = createFood();
            // direction of snake
            direction = "right";
            // độ tiếp nhận của bàn phím
            lastPress = 0;
            //create game
            start();
            break;
    }
    isJoin = true;
}
function level(levelNumber) {
    joinBoardgame();
    //index level hiện tại
    levelGame = levelArray.indexOf(levelNumber);
    isJoin = false;
    showRules();
}
//updateLabel level 5
function updateFruitsLabel() {
    const img1 = document.createElement('img');
    img1.src = listFruits[randomFruit1].src;
    img1.style = "max-width: 100%; max-height: 24px;";
    const img2 = document.createElement('img');
    img2.src = listFruits[randomFruit2].src;
    img2.style = "max-width: 100%; max-height: 24px;";
    muctieuFruits.innerHTML = numFruit1 + "/1" + img1.outerHTML + " và " + numFruit2 + "/2" + img2.outerHTML;
}
//kich thuoc 30x20
function draw() {
    //hiển thị số táo còn lại luôn >=0
    if (numberScore >= 0) {
        score.innerText = numberScore;
    }
    else {
        score.innerText = 0;
    }
    //level 3, 5 và 6: hiển thị thời gian game
    if (levelGame == 2 || levelGame == 4 || levelGame == 5) {
        timegameLabel.innerHTML = timeGame;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw the background
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (matrix[i][j] === 0) {
                ctx.fillStyle = "#212121";
            }
            else if (matrix[i][j] === 1) {
                ctx.fillStyle = "#FF5722";
            }

            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);

        }
    }
    //draw snake
    ctx.fillStyle = "#4CAF50";
    snake.forEach(cell => {
        ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
    });
    //draw the headsnake
    ctx.fillStyle = "LightGreen";
    ctx.fillRect(head.x * cellSize, head.y * cellSize, cellSize, cellSize);
    // draw the food 
    if (food != null) {
        ctx.drawImage(image, food.x * cellSize, food.y * cellSize, cellSize, cellSize);
    }
    // draw gateWin
    if (gateWin != null) {
        ctx.fillStyle = "White";
        ctx.fillRect(gateWin.x * cellSize, gateWin.y * cellSize, cellSize, cellSize);
    }
    //level 5, 6  draw fruits. nếu fruit=null sẽ không hiển thị
    if (levelGame == 4 || levelGame == 5) {
        for (let i = 0; i < 5; i++) {
            if (fruits[i] != null) {
                ctx.drawImage(listFruits[i], fruits[i].x * cellSize, fruits[i].y * cellSize, cellSize, cellSize);
            }
        }
    }
}
//hiển thị thời gian đếm ngược
function start() {
    draw();
    ctx.font = "bold 72px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(count.toString(), canvas.width / 2, canvas.height / 2);
    count--;
    // Hiển thị số đếm
    countIntervalId = setInterval(function () {
        if (count > -1) {
            draw();
            ctx.font = "bold 72px Arial";
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.fillText(count.toString(), canvas.width / 2, canvas.height / 2);
            count--;
        } else {
            // Xóa bỏ hàm đếm ngược
            clearInterval(countIntervalId);
            countIntervalId = null;
            count = 3;
            if (levelGame == 2) {
                timeGame -= 1;
                countDown();
            }
            else if (levelGame == 3) {
                timeLeft -= 1;
                timeHungry();
            }
            else if (levelGame == 4) {
                timeGame -= 1;
                countDown();
                countTimeFruits();
            }
            else if (levelGame == 5) {
                timeGame -= 1;
                countDown();
                timeLeft -= 1;
                timeHungry();
                countTimeFruits();
            }
            // Bắt đầu vẽ canvas
            setTimeout(gameLoop(), 1000);
            return;
        }
    }, 1000);
}

// function tạo thức ăn, tạo ra thức ăn xuất hiện không trùng với snake và với bức tường
function createFood() {
    let createFood = { x: Math.floor(Math.random() * col), y: Math.floor(Math.random() * row) };
    while (containsPoint(snake, createFood)) {
        createFood = { x: Math.floor(Math.random() * col), y: Math.floor(Math.random() * row) };
    }
    return createFood;
}
//function tạo trái cây làm nhiệm vụ
function createFruits() {
    for (let i = 0; i < 5; i++) {
        let fruit = { x: Math.floor(Math.random() * col), y: Math.floor(Math.random() * row) };
        while (containsPointFruits(snake, fruits, fruit)) {
            fruit = { x: Math.floor(Math.random() * col), y: Math.floor(Math.random() * row) };
        }
        fruits[i] = fruit;
    }
}
//function random nhiệm vụ fruit
function randomFruit() {
    randomFruit1 = Math.floor(Math.random() * 5);
    randomFruit2 = Math.floor(Math.random() * 5);
    while (randomFruit1 == randomFruit2) {
        randomFruit2 = Math.floor(Math.random() * 5);
    }
    numFruit1 = 0;
    numFruit2 = 0;
}
//kiểm tra fruit có trùng với vật thể khác không
function containsPointFruits(points, fruits, p) {
    if (matrix[p.y][p.x] === 1) {
        return true;
    }
    for (let i = 0; i < points.length; i++) {
        if (points[i].x === p.x && points[i].y === p.y) {
            return true;
        }
    }
    for (let j = 0; j < fruits.length; j++) {
        if (fruits[j] != null && fruits[j].x === p.x && fruits[j].y === p.y) {
            return true;
        }
    }
    return false;
}
//Kiểm tra xem điểm p có trùng với points hay là tường hay không, có trả về true, không trả về false
function containsPoint(points, p) {
    if (matrix[p.y][p.x] === 1) {
        return true;
    }
    for (let i = 0; i < points.length; i++) {
        if (points[i].x === p.x && points[i].y === p.y) {
            return true;
        }
    }
    for (let i = 0; i < fruits.length; i++) {
        if (fruits[i] != null && fruits[i].x === p.x && fruits[i].y === p.y) {
            return true;
        }
    }
    return false;
}
//Kiểm tra sự va chạm giữa đầu rắn và thân rắn
function checkConflict() {
    if (snake.length != 0) {
        let head = { x: snake[0].x, y: snake[0].y };
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
    }
    return false;

}
//function tạo ma trận boardgame
function wallMatrix(level) {
    const wallmatrix = [];
    for (let i = 0; i < row; i++) {
        wallmatrix[i] = new Array(col).fill(0);
    }
    //level 1:không tường
    if (level === 0) {
        for (let i = 0; i < row; i++) {
            wallmatrix[i] = new Array(col).fill(0);
        }
    }
    //level 2: tường kín, không có đi xuyên tường
    else if (level === 1) {
        for (let i = 0; i < row; i++) {
            wallmatrix[i] = new Array(col).fill(0);
            if (i === 0 || i === row - 1) {
                // Thêm 2 bức tường trên dưới
                wallmatrix[i] = new Array(col).fill(1);
            }
            for (let i = 0; i < row; i++) {
                wallmatrix[i][0] = 1;
                wallmatrix[i][col - 1] = 1;
            }
        }
    }
    //level 3:
    else if (level === 2) {
        for (let i = 0; i < row; i++) {
            wallmatrix[i] = new Array(col).fill(0);
            if (i === 0 || i === row - 1) {
                // Thêm bức tường ở hàng đầu tiên và hàng cuối cùng
                wallmatrix[i] = new Array(col).fill(1);
            } else {
                // Thêm bức tường xếp chéo
                const j = Math.floor((i / row) * col);
                wallmatrix[i][j] = 1;
            }
        }
    }
    //level 4: 
    else if (level === 3) {
        for (let i = 0; i < row; i++) {
            wallmatrix[i] = new Array(col).fill(0);
            if (i === 0 || i === row - 1) {
                // Thêm 2 bức tường trên dưới
                wallmatrix[i] = new Array(col).fill(1);
            }
        }
        // Thêm 2 bức tường 2 bên
        for (let i = 0; i < 6; i++) {
            wallmatrix[i][0] = 1;
            wallmatrix[row - 1 - i][0] = 1;
            wallmatrix[i][col - 1] = 1;
            wallmatrix[row - 1 - i][col - 1] = 1;
        }
        for (let i = 7; i < col - 7; i++) {
            wallmatrix[5][i] = 1;
            wallmatrix[row - 6][i] = 1;
        }
    }
    // level 5:
    else if (level === 4) {
        //full 0
        for (let i = 0; i < row; i++) {
            wallmatrix[i] = new Array(col).fill(0);
            if (i === 10) {
                // Thêm 2 bức tường trên dưới
                wallmatrix[i] = new Array(col).fill(1);
            }
            for (let i = 0; i < row; i++) {
                wallmatrix[i][0] = 1;
                wallmatrix[i][col - 1] = 1;
            }
        }
    }
    // level 6:
    else if (level === 5) {
        //full 0
        for (let i = 0; i < row; i++) {
            wallmatrix[i] = new Array(col).fill(0);
        }
        // tường 2 bên
        for (let i = 0; i < 6; i++) {
            wallmatrix[i][0] = 1;
            wallmatrix[row - 1 - i][0] = 1;
            wallmatrix[i][col - 1] = 1;
            wallmatrix[row - 1 - i][col - 1] = 1;
        }
        // tường trên dưới
        for (let i = 0; i < 12; i++) {
            wallmatrix[0][i] = 1;
            wallmatrix[0][col - 1 - i] = 1;
            wallmatrix[row - 1][i] = 1;
            wallmatrix[row - 1][col - 1 - i] = 1;
        }
        for (let i = 5; i < 12; i++) {
            wallmatrix[5][i] = 1;
            wallmatrix[5][col - 1 - i] = 1;
            wallmatrix[row - 6][i] = 1;
            wallmatrix[row - 6][col - 1 - i] = 1;
        }

    }
    return wallmatrix;
}
//tạo luật chơi
function createTextRules(levelGame) {
    switch (levelGame) {
        case 0:
            return "(Vietnamese) Hãy ăn 15 quả táo để hoàn thành nhiệm vụ, khi ăn đủ 15 quả táo sẽ xuất hiện cổng chiến thắng. Đi vào cổng sẽ chiến thắng thắng màn chơi. Lưu ý rằng không được để rắn đâm vào thân rắn nhé!";
        case 1:
            return "(Vietnamese) Hãy ăn 15 quả táo để hoàn thành nhiệm vụ, khi ăn đủ 15 quả táo sẽ xuất hiện cổng chiến thắng. Đi vào cổng sẽ chiến thắng thắng màn chơi. Lưu ý rằng không được để rắn đâm vào thân rắn và tường nhé";
        case 2:
            return "(Vietnamese) Hãy ăn 15 quả táo để hoàn thành nhiệm vụ, khi ăn đủ 15 quả táo sẽ xuất hiện cổng chiến thắng. Đi vào cổng sẽ chiến thắng thắng màn chơi. Lưu ý rằng màn này có thời gian chỉ định để hoàn thành vòng chơi, nên không kịp thời gian sẽ thất bại trong vòng chơi này và không được để rắn đâm vào thân rắn và tường nhé.";
        case 3:
            return "(Vietnamese) Hãy ăn 15 quả táo để hoàn thành nhiệm vụ, khi ăn đủ 15 quả táo sẽ xuất hiện cổng chiến thắng. Đi vào cổng sẽ chiến thắng thắng màn chơi. Lưu ý rằng rắn sẽ có 1 khoảng thời gian để sống, nên ăn táo nhanh để hồi lại thời gian sống, nếu hết thời gian sống mà chưa hoàn thành nhiệm vụ sẽ thất bại vòng chơi và không được để rắn đâm vào thân rắn và tường nhé.";
        case 4:
            return "(Vietnamese) Hãy hoàn thành nhiệm vụ ăn vật phẩm của vòng chơi trong khoảng thời gian chỉ định. Cứ ăn 2 quả táo sẽ xuất hiện các vật phẩm tồn tại trong 10s, hãy cố gắng hoàn thành nhiệm vụ nhé và lưu ý rằng không được để rắn đâm vào thân rắn và tường nhé";
        case 5:
            return "(Vietnamese) *Màn chơi siêu khó! Hãy ăn 10 quả táo và hoàn thành nhiệm vụ ăn vật phẩm trong thời gian chỉ định để chiến thắng. Lưu ý rằng địa hình sẽ khó hơn và rắn sẽ có thời gian để sống. Hãy tận dùng thời gian, quảng đường ngắn nhất để chiến thắng. Nếu rắn đi vào cổng mà chưa hoàn thành nhiệm vụ vật phẩm thì vẫn thua nhé! Chúc may mắn ^^";
    }
    return "";
}
//slider speed
function updateSpeed(val) {
    // Hàm được gọi khi slider thay đổi giá trị
    document.getElementById("speed-label").textContent = val; // Cập nhật label hiển thị tốc độ
    speed = 110 - (val * 10);
    document.getElementById("speed-slider-setting").value = val;
    document.getElementById("speed-label-setting").textContent = val;
}
function updateSpeedSetting(val) {
    // Hàm được gọi khi slider thay đổi giá trị
    document.getElementById("speed-label-setting").textContent = val; // Cập nhật label hiển thị tốc độ
    speed = 110 - (val * 10);
    document.getElementById("speed-slider").value = val;
    document.getElementById("speed-label").textContent = val;
}

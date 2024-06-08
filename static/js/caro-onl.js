// Kết nối socket qua server (KHI KHỞI TẠO TRÊN SERVER)
// let socket = io.connect('https://thai-son-caro-game.glitch.me/');

// Kết nối socket thông qua LAN (BUILD TRÊN LOCAL)
let socket = io.connect('http://' + document.domain + ':' + location.port);

// Tạo mã phòng để bắt đầu chơi
document.getElementById('create-room-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let roomCode = document.getElementById('create-room-code').value;
    fetch('/create', {
        method: 'POST',
        body: new URLSearchParams({
            'room_code': roomCode,
        })
    }).then(response => {
        if (!response.ok) {
            alert('Tạo phòng không thành công! (Phòng đã tồn tại)');
        } else {
            alert('Tạo phòng thành công --> Hãy tham gia phòng này!');
        }
    });
});

// Lấy room-form từ Frontend để kiểm tra mã phòng 
document.getElementById('join-room-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let roomCode = document.getElementById('join-room-code').value;
    socket.emit('join', { room_code: roomCode }, function(error) {
        if (error) {
            alert("Phòng không tồn tại hoặc đã đủ số người chơi!");
        } else {
            // Ẩn cả khối chứa form tạo phòng và form tham gia phòng
            document.getElementById('create-room-form').parentElement.style.display = 'none';
            document.getElementById('join-room-form').parentElement.style.display = 'none';
            // Hiển thị thông tin về phòng hiện tại và nút để rời phòng
            let currentRoomElement = document.getElementById('current-room');
            currentRoomElement.innerText = 'Phòng hiện tại: ' + roomCode;
            currentRoomElement.style.fontWeight = 'bold';
            document.getElementById('current-room-container').style.display = 'block';
            document.getElementById('chat_all').style.display = 'none';
            document.getElementById('back').style.display = 'none';
        }
    });
});

// Khi một người chơi rời phòng
document.getElementById('leave-room-button').addEventListener('click', function(e) {
    e.preventDefault();
    // Gửi yêu cầu rời phòng đến server
    socket.emit('leave', { room_code: roomCode }, function(error) {
        location.reload();
    });
});

// Khai báo bảng và người chơi đầu được sử dụng "X"
let boardElement = document.getElementById('board');
let statusElement = document.getElementById('status');
let board = [];
let currentPlayer;

// Tạo biến để theo dõi số lượng người chơi trong phòng
let playerCount = 0;

// Tạo bảng 20x20 
for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleClick, { once: true });
        boardElement.appendChild(cell);
        board.push(cell);
    }
}


let roomCode;
let check = [];
let currentSid;
// Khi một người chơi tham gia phòng, lấy số lượng người chơi từ server
socket.on('join', function(data) {
    roomCode = data.room_code;
    players = data.players;
    currentSid = data.request_sid;

    // Hiển thị số lượng người chơi và thông tin roles trong phòng
    document.getElementById('player-count').textContent = 'Số người chơi: ' + players.length;
    currentPlayer = players.find(player => player.id === currentSid);
    if (check.length === 0 && currentPlayer === players[0]) {
        check.push('X');
    } else if (check.length === 0 && currentPlayer === players[1]) {
        check.push('O');
    }
    // Kiểm tra xem có đủ 2 người chơi hay không và players[0] không phải là undefined
    if (players.length === 2) {
        players[0].symbol = 'X';
        players[1].symbol = 'O';
        // Kiểm tra xem currentPlayer có tồn tại không trước khi gán giá trị
        let playerInfoElement = document.getElementById('player-info');
        if (playerInfoElement) {
            playerInfoElement.textContent = 'Bạn là: ' + check[0];
        }
        resetGame();
    }
});

// Khi một người chơi rời phòng, cập nhật lại thông tin phòng
socket.on('leave', function(data) {
    setTimeout(function() {
        alert('Đối thủ đã rời phòng, bạn hãy tìm một đối thủ mới (làm mới trang)!');
        location.reload();
    }, 1000);
});

// Socket listener để xác định khi có sự kiện cập nhật số người chơi trong phòng
socket.on('playerCountUpdate', function(data) {
    let roomCode = data.room_code;
    let playerCount = data.player_count;
    // Cập nhật giao diện với số người chơi mới
    document.getElementById('player-count').textContent = 'Số người chơi: ' + playerCount;
});

let currentTurn = 1;

// Handle mỗi Click và xử lý logic sau mỗi lần chọn vị trí
function handleClick(e) {
    if (currentTurn % 2 === ((check[0] === players[0].symbol) ? 1 : 0)) {
        // Kiểm tra xem ô đã được đánh chưa và xem có phải lượt của người chơi này không
        if (e.target.textContent === '') {
            e.target.textContent = check[0];
            // Thêm CSS vào symbol
            e.target.classList.add(check[0].toLowerCase());
            e.target.classList.add('highlight');
            if (checkWin(board.indexOf(e.target), check[0])) {
                setTimeout(function() {
                    alert(check[0] + ' wins!');
                    resetGame();
                }, 100); // Thêm trễ 100ms
            } else {
                currentTurn++;
            }
            socket.emit('playerMove', { room_code: roomCode, index: board.indexOf(e.target), player: e.target.textContent, currentTurn: currentTurn });
            stopCountdownme(); // Dừng đếm khi người chơi hiện tại di chuyển
            startCountdownenemy();
        } else {
            alert('Ô này đã được đánh rồi');
        }
    } else {
        alert('Chưa đến lượt của bạn!');
    }
}


// Socket listener để xác định lượt đánh của đối thủ
socket.on('opponentMove', function(data) {
    let index = data.index;
    let opponentSymbol = (check[0] === 'X') ? 'O' : 'X';

    // Kiểm tra xem ô đã được đánh chưa
    if (board[index].textContent === '') {
        board[index].textContent = opponentSymbol;
        board[index].classList.add(opponentSymbol.toLowerCase());
        board[index].classList.add('highlight');

        // Kiểm tra điều kiện thắng và xử lý
        if (checkWin(index, opponentSymbol)) {
            setTimeout(function() {
                alert(opponentSymbol + ' wins!');
                resetGame();
            }, 100); // Thêm trễ 100ms
        }
        // Chuyển lượt cho người chơi hiện tại
        currentTurn++;
        setTimeout(startCountdownme, 0);
        setTimeout(stopCountdownenemy, 0);
    }
});

// Hàm kiểm tra trả về kết quả (Thắng - Hòa)
function checkWin(index, player) {
    let row = Math.floor(index / 20);
    let col = index % 20;
    let directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1]
    ];
    for (let [dx, dy] of directions) {
        let count = 1;
        for (let i = 1; i < 5; i++) {
            let x = row + dx * i;
            let y = col + dy * i;
            if (x < 0 || x >= 20 || y < 0 || y >= 20 || board[x * 20 + y].textContent !== player) {
                break;
            }
            count++;
        }
        for (let i = 1; i < 5; i++) {
            let x = row - dx * i;
            let y = col - dy * i;
            if (x < 0 || x >= 20 || y < 0 || y >= 20 || board[x * 20 + y].textContent !== player) {
                break;
            }
            count++;
        }
        if (count >= 5) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    // Xóa tất cả các nước đi trên bảng
    for (let i = 0; i < board.length; i++) {
        board[i].textContent = '';
        board[i].addEventListener('click', handleClick); // Thêm lại sự kiện click vào ô
        board[i].classList.remove('x', 'o', 'highlight'); // Xóa các sự kiện highlight và tô màu 
    }
    // Đặt lại người chơi hiện tại
    currentPlayer = 'X';
    currentTurn = 1;
    startCountdownenemy();
    startCountdownme();
    stopCountdownme();
    stopCountdownenemy();
}

var countdownne;
var remainingTimeme;
var countdownenemy;
var remainingTimeenemy;

function startCountdownme() {
    clearInterval(countdownme);
    remainingTimeme = 30;
    countdownme = setInterval(function() {
        const minutes = Math.floor(remainingTimeme / 60);
        const seconds = remainingTimeme % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        document.getElementById('countdownme').textContent = 'Thời gian còn lại của bạn: ' + formattedTime;
        remainingTimeme--;
        if (remainingTimeme <= -2) {
            clearInterval(countdownme);
            alert('Hết giờ! Bạn đã thua. Bấm để chơi ván khác!');
            resetGame();
        }
    }, 1000);
}

function startCountdownenemy() {
    clearInterval(countdownenemy);
    remainingTimeenemy = 30;
    countdownenemy = setInterval(function() {
        const minutes = Math.floor(remainingTimeenemy / 60);
        const seconds = remainingTimeenemy % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        document.getElementById('countdownenemy').textContent = 'Thời gian còn lại của đối thủ: ' + formattedTime;
        remainingTimeenemy--;
        if (remainingTimeenemy <= -2) {
            clearInterval(countdownenemy);
            alert('Đối thủ k đưa ra nước đi ->? đã thua . Bấm để chơi ván khác!');
            resetGame();
        }
    }, 1000);
}

// Dừng đếm khi người chơi di chuyển
function stopCountdownme() {
    clearInterval(countdownme);
    document.getElementById('countdownme').textContent = 'Thời gian còn lại của bạn: 0:30';
}

function stopCountdownenemy() {
    clearInterval(countdownenemy);
    document.getElementById('countdownenemy').textContent = 'Thời gian còn lại của đối thủ: 0:30';
}

var content_chat = document.getElementById('content_chat');
var random_icon = ['🤣','😊','😂','😎']
socket.on('message', function(data){
    var item = document.createElement('div');
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    item.textContent = `${random_icon[randomNumber]} ${data.username}: ${data.msg}`;
    content_chat.appendChild(item);
    content_chat.scrollTo(0, document.body.scrollHeight);
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Trả về null nếu cookie không tồn tại
}

document.getElementById("chat-form").addEventListener('submit', function(e){
    e.preventDefault();
    let input = document.getElementById("chat-message");
    const username = getCookie('namedisplay');
    if (input.value) {
        var messageData = {
            msg: input.value,
            username: username
        };
        socket.send(messageData);
        input.value = '';
    } else {
        alert("Please enter your message.");
    }
});


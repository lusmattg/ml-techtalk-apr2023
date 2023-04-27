const socket = io();
socket.on('ping',function() { console.log('pong')});
socket.on('s-updatecursors', function(msg) {
    state.cursors = [];
    for (const m in msg) {
        state.cursors.push(msg[m]);
    }
});

function updateCursorPos(nhx,nhy) {
    socket.emit('c-updatecursor',[nhx,nhy]);
}

function updateAllCursors(msg) {
    console.log(msg);
}

let state = {};

let canvas;
let ctx;

let cursorX = 0;
let cursorY = 0;

function render() {
    ctx.fillStyle = '#ddddee';
    ctx.fillRect(0,0,512,512);

    if (state.cursors) {
        for (c of state.cursors) {
            ctx.fillStyle = c.cursorCol;
            if (c && c.cursorPos) {
              ctx.fillRect(c.cursorPos[0],c.cursorPos[1],16,16);
            }
        }
    }
    else {
      console.log('no cursors found')
    }

    updateCursorPos(cursorX,cursorY);

    setTimeout(render,50)
}

function init() {

    //init canvas
    canvas = document.getElementById('techtalk-socket');
    ctx = canvas.getContext('2d');
    
    canvas.addEventListener('mousedown', function (event) {
     });
  
     canvas.addEventListener('mouseup', function (event) {
//        gameBoard.handleMouseUp(event.clientX,event.clientY,event.button);
    });

     canvas.addEventListener('mousemove', function (event) {

        cursorX = event.clientX;
        cursorY = event.clientY;
        
     });


    render();
}
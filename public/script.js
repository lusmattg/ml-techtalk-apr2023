const socket = io();
socket.on('ping',function() { console.log('pong')});
socket.on('s-updatecursors', function(msg) {
    console.log(knownUsers);
    state.cursors = [];
    for (const m in msg) {
        if (msg[m].sentTime && msg[m].cursorName) {
          if (!knownUsers[msg[m].cursorName]) knownUsers[msg[m].cursorName] = {delta: []}
          knownUsers[msg[m].cursorName].delta.push(Date.now()-msg[m].sentTime);
        }
        else {
            console.log(msg[m])
        }
        state.cursors.push(msg[m]);
    }
});

function updateCursorPos(nhx,nhy) {
    socket.emit('c-updatecursor',{pos: [nhx,nhy], time: Date.now()});
}

function updateAllCursors(msg) {
    console.log(msg);
}

let state = {};

let knownUsers = {};

let canvas;
let ctx;

let cursorX = 0;
let cursorY = 0;
let cursorsUpdated = false;

function render() {
    ctx.fillStyle = '#dddddd';
    ctx.fillRect(0,0,512,512);

    if (state.cursors) {
        for (c of state.cursors) {
            if (c && c.cursorPos) {
              ctx.fillStyle = c.cursorCol;
              let latency = '';
              if (knownUsers[c.cursorName]) {
                latency = ' (' + (knownUsers[c.cursorName].delta[knownUsers[c.cursorName].delta.length-1]) + ')';
              }
              ctx.fillText(c.cursorName + latency,c.cursorPos[0],c.cursorPos[1])
              //ctx.fillRect(c.cursorPos[0],c.cursorPos[1],16,16);
            }
        }
    }
    else {
      console.log('no cursors found')
    }
    if (cursorsUpdated) {
        updateCursorPos(cursorX,cursorY);
        cursorsUpdated=  false;
    }

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
        cursorsUpdated = true;
        
     });


    render();
}
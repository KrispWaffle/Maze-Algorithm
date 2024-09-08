const canvas = document.getElementById('mazeCanvas');
const startPointAdd = document.getElementById('addStart');
const endPointAdd =  document.getElementById('addEnd');
const search = document.getElementById('search')
let startPoint  = false;
let endPoint = false;
const ctx = canvas.getContext('2d');
const cellSize = 20;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;
let isDrawing = false; 
let startPos;
let endPos;

let grid = Array.from({ length: rows }, () => Array(cols).fill(0));



function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] === 1) {
                ctx.fillStyle = 'black'; // Wall
             
            }else if(grid[row][col]==2){
                ctx.fillStyle = 'green'        
            }else if(grid[row][col]==3){
                ctx.fillStyle = 'red'
            }
            else if(grid[row][col]==4){
                ctx.fillStyle = 'yellow'
            }else {
                ctx.fillStyle = 'white'; // Empty space
            }
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}


function getCellFromMouse(x, y) {
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    return { col, row };
}

function drawOnCanvas(x, y) {
    const { col, row } = getCellFromMouse(x, y);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      if(startPoint){
        grid[row][col] = 2;
        startPos = getCellFromMouse(x,y);
        startPoint = false;
        console.log("start position is at " + startPos.col +" "+ startPos.row);
      }else if(endPoint){
        grid[row][col] = 3;
        endPos = getCellFromMouse(x,y);
        endPoint = false;
        console.log("end position is at " + endPos.col +" "+ endPos.row);
      }else{
        grid[row][col] = 1; 
        
      }
      drawGrid();
    }
    
}
startPointAdd.addEventListener('click',(e)=>{
    switch (startPoint) {
        case true:
            startPoint = false
            break;
        case false:
            startPoint = true
        default:
            break;
    }
})
endPointAdd.addEventListener('click',(e)=>{
    switch (endPoint) {
        case true:
            endPoint = false
            break;
        case false:
            endPoint = true
        default:
            break;
    }
})


canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;  
    const rect = canvas.getBoundingClientRect();
    drawOnCanvas(e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        drawOnCanvas(e.clientX - rect.left, e.clientY - rect.top);
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;  
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;  
});


document.getElementById('clearBtn').addEventListener('click', () => {
    grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    drawGrid();
});


function bfs(grid, start, end){
    const queue = [];
    queue.push(start)
    const visited = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(false));
    const parent = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));
    visited[start.row][start.col] = true;  
    const directions = [
        { row: -1, col: 0 },  // Up
        { row: 1, col: 0 },   // Down
        { row: 0, col: -1 },  // Left
        { row: 0, col: 1 }    // Right
    ];

    while(queue.length > 0){
        const current = queue.shift();
        const {row, col} = current;

        if(row == end.row&&col==end.col){
            alert("Reached the end!")
            reconstructPath(parent, start, end)
            return true;
        }

        for( const direction of directions){
            const newRow = row + direction.row
            const newCol = col + direction.col

            if(newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length && grid[newRow][newCol] !== 1 && !visited[newRow][newCol]){
                visited[newRow][newCol] = true
                parent[newRow][newCol] = { row, col }; 
                queue.push({ row: newRow, col: newCol })
            }
        }
      
    }
    console.log("could not reach the end");
    return false;
}

function reconstructPath(parent, start, end) {
    let current = end;

    while (current.row !== start.row || current.col !== start.col) {
        if(!(current.row == end.row && current.col == end.col)){
            grid[current.row][current.col] =4
   
        }
        current = parent[current.row][current.col]; 
    }


    
    drawGrid();  

}
search.addEventListener('click', (e)=>{
    console.log("ran!")
    bfs(grid, startPos, endPos);
})
drawGrid();

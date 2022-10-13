document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'rgb(217, 215, 241)',
        'rgb(255, 227, 169)',
        'rgb(218, 234, 241)',
        'rgb(255, 217, 192)',
        'rgb(211, 235, 205)'
    ]
    
//The Tetrominoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
] 
const zTetromino = [
    [0, width, width+1,width*2+1],
    [width+1,width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1,width+2,width*2,width*2+1]
]
const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
]
const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
    
]
const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
]



const theTetrominoes =[lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]


let currentPosition = 4
let currentRotation = 0


//randomly select tetromino and its first rotation
let random = Math.floor(Math.random()*theTetrominoes.length)
let current = theTetrominoes[random][currentRotation]

//draw the first rotation in the first tetromino
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}

//undraw the Tetromino
function undraw() {
    current.forEach( index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition +index].style.backgroundColor =''
    })
}
//make the tetromino move down every second
// timerId = setInterval(moveDown, 1000)

//assign functions to keyCodes
function control(e) {
    if (e.keyCode === 37) {
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate()
    }  else if (e.keyCode === 39) {
        moveRight()
    } else if (e.keyCode === 40) {
       moveDown()
    }
}
document.addEventListener('keyup', control)
//move down function
function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}
// freeze function 
function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition +index].classList.add('taken'))

    //start a new tetromino falling
    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    current = theTetrominoes[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
    gameOver()
   }
}
//move the tetromino left, unless at the edge or is there is blockage
function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
 
    if(!isAtLeftEdge) currentPosition -=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
    }

    draw()
}
// move the tetromino right, unless at edge or blocked
function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
     
    if(!isAtRightEdge) currentPosition += 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
    }

    draw()
}
//rotate
function rotate() {
    undraw()
    currentRotation ++ 
    if (currentRotation === current.length) { //if current rotation gets to 4, makes it go back to 0
        currentRotation = 0
    }
    //current = theTetrominoes[random][currentRotation]
    if (current.some(index =>(currentPosition + index) % width === 0)) {
        currentPosition += 1
    }
     else if (current.some(index =>(currentPosition + index) % width === width - 1)) {
        currentPosition -=2
    }
    current = theTetrominoes[random][currentRotation]

    draw()
}
//Fixed edge case issue, need to figure out a "Valid move" option



//show up-coming tetromino in mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0

//array of Tetrominoes original shape, for upcoming icon
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]

//display shape in mini-grid display
function displayShape() {
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
 } 

//add functionality to the button
StartBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null 
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()* theTetrominoes.length)
        displayShape()
    }
})
//add score
function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9] 

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score += 10
            ScoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
//add taken off row to top of box so shape doesnt appear to have changed
            const squaresRemoved = squares.splice(i, width) 
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
         }
       }
     }
// game over
function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        ScoreDisplay.innerHTML = ' Game Over, Nice Try!'
        clearInterval(timerId) 
        
    } 
    }
})
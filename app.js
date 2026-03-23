// vars
const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
let currentShooterIndex = 202
const width = 15
const aliensRemoved = []
let invadersId
let isGoingRight = true
let direction = 1
let results = 0
let end_game = false
let walls = false

// msgs
const WIN_MSG = "YOU WIN"
const LOSE_MSG = "YOU LOSE"
const ESCAPE_MSG = "YOU ESCAPED!! True rebel 😎"

// levels
const levels = [900, 600, 400, 200, 50];
const levelButtons = document.querySelectorAll(".level")
levelButtons.forEach(b => b.addEventListener("click", () => setLevel(b)))
let gameSpeed = 1;

// create grid
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll(".grid div"))


const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

// game
draw()
squares[currentShooterIndex].classList.add("shooter")
document.addEventListener("keydown", processKey)
invadersId = setInterval(moveInvaders, levels[gameSpeed])
document.addEventListener('keydown', shoot)

// functions
function setLevel(button) {
    levelButtons[gameSpeed].classList.remove("selected")
    gameSpeed = button.dataset.level
    clearInterval(invadersId)
    invadersId = setInterval(moveInvaders, levels[gameSpeed])
    levelButtons[gameSpeed].classList.add("selected")
}

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader")
        }
    }
}

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader")
    }
}

function processKey(e)
{
    if (e.key == "+") {
        results++
        resultDisplay.innerHTML = results
    } else if (e.key == "-") {
        let n = Math.floor(Math.random() * 30) // random alien
        
        if (aliensRemoved.includes(n)) // if its killed, doesnt do anything
            return

        removeInvader(alienInvaders[n], false, null)
    } else
        moveShooter(e)
}

function moveShooter(e) {
    let win = false
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
        case "ArrowUp":
            if (currentShooterIndex - width < 0)
                win = true
            else
                currentShooterIndex -= width
            break
        case "ArrowDown":
            if (currentShooterIndex + width >= width * width)
                win = true
            else
                currentShooterIndex += width
            break
    }
    if (win) {
        end(ESCAPE_MSG, true)
    } else {
        squares[currentShooterIndex].classList.add("shooter")
    }
}

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            isGoingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains("invader")) {
        end(LOSE_MSG, false)
    }

    if (aliensRemoved.length === alienInvaders.length) {
        end(WIN_MSG, true)
    }
}

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add("laser")

        if (squares[currentLaserIndex].classList.contains("invader")) {
           removeInvader(currentLaserIndex, true, laserId)
        }
    }

    if (e.key === " ") {
        laserId = setInterval(moveLaser, 100)
    }
}

function removeInvader(currentLaserIndex, laser, laserId)
{
    if (laser)
        squares[currentLaserIndex].classList.remove("laser")
    squares[currentLaserIndex].classList.remove("invader")
    squares[currentLaserIndex].classList.add("boom")

    setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
    if (laser)
        clearInterval(laserId)

    const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
    aliensRemoved.push(alienRemoved)
    results++
    resultDisplay.innerHTML = results
}

function end(msg, win)
{
    squares[currentShooterIndex].classList.remove("shooter")

    end_game = true
    setTimeout(() => alert(msg))
    clearInterval(invadersId)
    remove()

    if (win)
        grid.classList.add("win")
    else
        grid.classList.add("lose")
}

'use strict'

//TODO destructuring?? main drug and drop line 30
//TODO font doesn't render after reload
//TODO text align
//TODO shorthandIf line 215

//? grabbing pointer

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gElementDrag = ''

function onOpenEditor(prop, isMeme) {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    createMeme(prop, isMeme)
    addListeners()
    renderMeme()
    renderStickersBtns()
}

function renderMeme() {
    // drawImage()
    const meme = getMeme()

    const memeImg = new Image()
    memeImg.src = getImgURL()

    memeImg.onload = function() {
        gCtx.drawImage(memeImg, 0, 0, gElCanvas.width, gElCanvas.height)
            //!! can I take this out?!
        renderText(meme)
        addBorderLine(meme)
        renderStickers()
    }

    _updateInputs(meme)
}

function renderStickers() {
    const stickers = getMemesStickers()

    stickers.forEach((sticker) => {
        // console.log(sticker);
        drawText(sticker.img, sticker.offsetX, sticker.offsetY, sticker.size)
    })
}

function renderStickersBtns() {
    const stickers = getStickers()

    const strHTMLs = stickers.map(sticker => `
    <button onclick="onStickerBtn('${sticker.img}')">${sticker.img}</button>
    `).join('')

    document.querySelector('.stickers-container').innerHTML = strHTMLs
}
// function drawImage() {
//     const memeImg = new Image()
//     memeImg.src = '/img/1.jpg'

//     memeImg.onload = function() {
//         gCtx.drawImage(memeImg, 0, 0, gElCanvas.width, gElCanvas.height)
//         drawText('text', 50, 50)
//     }
// }
function onStickerBtn(sticker) {
    addSticker(sticker)
    setSelectedElement('sticker')
    renderMeme()
}

function addBorderLine(meme) {
    // if (!meme.lines.length) return //! REMOVE MEME PROPERTY
    const selectedElement = getSelectedElement()
    if (!selectedElement) return
    const currElement = (selectedElement === 'line') ? getCurrLine() : getCurrSticker()
    console.log(currElement);
    gCtx.font = `${currElement.size}px ${currElement.font}`
    gCtx.strokeStyle = 'black'
    gCtx.strokeRect(currElement.offsetX - 10, currElement.offsetY - 10, currElement.width + 20, currElement.height + 20)
}

function renderText(meme) {
    meme.lines.forEach((line) => {
        drawText(line.txt, line.offsetX, line.offsetY, line.size, line.color, line.font)
    })
}

function drawText(text, x, y, textSize, textColor = '#000000', textFont = 'impact') {
    //TODO: add stroke
    gCtx.lineWidth = 2
        // gCtx.strokeStyle = 'brown'
    gCtx.fillStyle = textColor

    gCtx.font = `${textSize}px ${textFont}`
        // gCtx.textAlign = 'center'
    gCtx.textBaseline = 'top'
    gCtx.fillText(text, x, y)
        // gCtx.strokeText(text, x, y)

}

function onChangeText(txt) {
    const currMeme = getMeme()
    if (!currMeme.lines.length) addLine((gElCanvas.width / 2))
    setLineTxt(txt)
    setSelectedElement('line')
    _updateWidtHeight()
    renderMeme()
}

function _updateWidtHeight() {
    const currLine = getCurrLine()

    setTextWidth(gCtx.measureText(currLine.txt).width)
    setTextHeight(gCtx.measureText(currLine.txt).fontBoundingBoxDescent)
}

function onChangeColor(color) {
    setTextColor(color)
    renderMeme()
}

function onIncreaseSize() {
    changeFontSize(0.5)
    _updateWidtHeight()
    renderMeme()
}

function onDecreaseSize() {
    changeFontSize(-0.5)
    _updateWidtHeight()
    renderMeme()
}

function onSwitchLine() {
    switchLines()
    renderMeme()
}

function onAddLine() {
    addLine((gElCanvas.width / 2))
    renderMeme()
}

function onChangeFont(font) {
    changeFont(font)
    renderMeme()
}

function onMoveLeft() {
    moveLineLeft()
    renderMeme()
}

function onMoveRight() {
    moveLineRight()
    renderMeme()
}

function onRemoveLine() {
    removeLine()
    renderMeme()
}

function onSaveMeme() {
    saveMeme()
}

function _updateInputs(meme) {
    if (!meme.lines.length) {
        document.querySelector('.txt-input').value = ''
        document.querySelector('.color-input').value = '#000000'
        document.querySelector('.font-select').value = 'ariel'
    } else {
        const currLine = getCurrLine()
        document.querySelector('.txt-input').value = currLine.txt
        document.querySelector('.color-input').value = currLine.color
        document.querySelector('.font-select').value = currLine.font
    }
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
        //Listen for resize ev 
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    console.log('Im from onDown')
        //Get the ev pos from mouse or touch
    const pos = getEvPos(ev)
        // console.log(isElementClicked(pos));
    const element = ifElementClicked(pos)
        // console.log(element);
    if (!element) {
        clearSelection()
        renderMeme()
        return
    }
    // console.log(gMeme.selectedLineIdx);

    if (element === 'line') gElementDrag = 'line'
    if (element === 'sticker') gElementDrag = 'sticker'
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    console.log('Im from onMove')

    if (!gElementDrag) return
    const pos = getEvPos(ev)
    setElementOffsetX(gElementDrag, pos.x)
    setElementOffsetY(gElementDrag, pos.y)

    renderMeme()
}

function onUp() {
    console.log('Im from onUp')
    gElementDrag = ''
    document.body.style.cursor = 'grab'
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

function getEvPos(ev) {

    //Gets the offset pos , the default pos
    let pos = {
            x: ev.offsetX,
            y: ev.offsetY
        }
        // Check if its a touch ev
    if (TOUCH_EVS.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
            //Gets the first touch point
        ev = ev.changedTouches[0]
            //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}
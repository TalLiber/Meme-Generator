'use strict'

//TODO destructuring?? main drug and drop line 30
//TODO font doesn't render after reload
//TODO text align
//TODO shorthandIf line 215
//TODO share download 

//? grabbing pointer

var gShareData = {
    title: 'Meme',
    text: 'My Meme',
    url: 'https://developer.mozilla.org'
}

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas = document.querySelector('canvas')
let gCtx = gElCanvas.getContext('2d')
let gElementDrag = ''

function onOpenEditor(prop, isMeme) {
    createMeme(prop, isMeme)
    addListeners()
    renderMeme()
    renderStickersBtns()
}

function renderMeme() {
    const meme = getMeme()

    const memeImg = new Image()
    memeImg.src = getImgURL()

    return new Promise(resolve => {
        memeImg.onload = function() {
            resizeCanvas(memeImg.naturalWidth, memeImg.naturalHeight)

            gCtx.drawImage(memeImg, 0, 0, gElCanvas.width, gElCanvas.height)
            renderText(meme)
            addBorderLine(meme)
            renderStickers()

            resolve('resolved')
        }
        _updateInputs(meme)
    })

}

function renderStickers() {
    const stickers = getMemesStickers()

    stickers.forEach((sticker) => {
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

function onStickerBtn(sticker) {
    addSticker(sticker)
    setSelectedElement('sticker')
    renderMeme()
}

function addBorderLine() {
    const selectedElement = getSelectedElement()
    if (!selectedElement) return
    const currElement = (selectedElement === 'line') ? getCurrLine() : getCurrSticker()
    gCtx.font = `${currElement.size}px ${currElement.font}`
    gCtx.strokeStyle = 'black'
    gCtx.strokeRect(currElement.offsetX - 10, currElement.offsetY - 10, currElement.width + 20, currElement.height + 20)
}

function renderText(meme) {
    meme.lines.forEach((line) => {
        drawText(line.txt, line.offsetX, line.offsetY, line.size, line.color, line.font)
    })
}

function drawText(text, x, y, textSize, textColor = '#fff', textFont = 'impact') {
    //TODO: add stroke
    gCtx.font = `${textSize}px ${textFont}`
    gCtx.lineWidth = 2
        // gCtx.strokeStyle = 'brown'
    gCtx.fillStyle = textColor

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

function onRemoveElement() {
    removeElement()
    renderMeme()
}

async function onSaveMeme() {
    clearBorder()
    await renderMeme();

    const imgDataUrl = gElCanvas.toDataURL("image/jpeg")
    saveMeme(imgDataUrl)
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
        renderMeme()
    })

    const btn = document.querySelector('.share-btn');
    btn.addEventListener('click', async() => {
        try {
            await navigator.share(gShareData);
            console.log(gShareData);
            console.log('success')
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    });

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
    // console.log('Im from onDown')
    const pos = getEvPos(ev)
    const element = ifElementClicked(pos)

    if (!element) {
        clearBorder()
        return
    }

    if (element === 'line') gElementDrag = 'line'
    if (element === 'sticker') gElementDrag = 'sticker'
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    // console.log('Im from onMove')

    if (!gElementDrag) return
    const pos = getEvPos(ev)
    setElementOffsetX(gElementDrag, pos.x)
    setElementOffsetY(gElementDrag, pos.y)

    renderMeme()
}

function onUp() {
    // console.log('Im from onUp')
    gElementDrag = ''
    document.body.style.cursor = 'grab'
    if (getSelectedElement()) document.querySelector('.txt-input').focus()
}

function newImage(url) {
    const img = new Image();
    img.src = url
    console.log(img.naturalWidth);
    console.log(img.naturalHeight);
}

function resizeCanvas(width, height) {
    gElCanvas.width = 350
    if (!width) gElCanvas.height = 350
    else gElCanvas.height = ((350 * height) / width)
}

function getEvPos(ev) {

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

function uploadImg() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg")
    gShareData.url = imgDataUrl
    console.log(imgDataUrl);

    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        toggleModal()
        document.querySelector('.share-container').innerHTML = `
          <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
            Share on Facebook   
          </a>`
    }
    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}

function toggleModal() {
    document.body.classList.toggle('modal-open')
}

function downloadImg(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function clearBorder() {
    clearSelection()
    renderMeme()
}
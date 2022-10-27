'use strict'

const STORAGE_KEY = 'memeDB'

var gImgs = []
var gStickers = []
var gMeme = {}

_createImgs()
_createStickers()

// EDITOR

function createMeme(prop, isMeme) {
    if (isMeme) gMeme = setMemeById(prop)
    else gMeme = {
        selectedImgId: prop,
        selectedElement: '',
        selectedLineIdx: 0,
        selectedStickerIdx: 0,
        lines: [],
        stickers: []
    }
}

function getMeme() {
    return gMeme
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getMemesStickers() {
    return gMeme.stickers
}

function getImgURL(currMeme = gMeme) {
    const currImg = gImgs.find(img => currMeme.selectedImgId === img.id)
    return currImg.url
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setTextColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function changeFontSize(change) {
    if (!gMeme.selectedElement) return
    else if (gMeme.selectedElement === 'line') gMeme.lines[gMeme.selectedLineIdx].size += change
    else gMeme.stickers[gMeme.selectedStickerIdx].size += change
}

function switchLines() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx += 1
}

function addLine(offsetX) {
    gMeme.lines.push({
        txt: '',
        size: 40,
        align: 'center',
        color: '#000000',
        font: 'impact',
        offsetX,
        offsetY: 100,
        width: 0,
        height: 0
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function changeFont(selectedFont) {
    gMeme.lines[gMeme.selectedLineIdx].font = selectedFont
}

function moveLineLeft() {
    gMeme.lines[gMeme.selectedLineIdx].offsetX -= 3
}

function moveLineRight() {
    gMeme.lines[gMeme.selectedLineIdx].offsetX += 3
}

function removeLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx += 1
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}

function saveMeme() {
    var savedMemes = loadFromStorage(STORAGE_KEY)
    if (!savedMemes) savedMemes = []

    savedMemes.push({
        id: makeId(),
        meme: gMeme
    })

    saveToStorage(STORAGE_KEY, savedMemes)
}

function setMemeById(memeId) {
    const savedMemes = loadFromStorage(STORAGE_KEY)

    const selectedMeme = savedMemes.find(meme => meme.id === memeId)
    return selectedMeme.meme
}

function setTextWidth(txtWidth) {
    console.log(txtWidth);
    gMeme.lines[gMeme.selectedLineIdx].width = txtWidth
}

function setTextHeight(txtHeight) {
    gMeme.lines[gMeme.selectedLineIdx].height = txtHeight
}

function ifElementClicked(clickedPos) {
    for (var i = 0; i < gMeme.lines.length; i++) {
        // console.log(clickedPos.x >= gMeme.lines[i].offsetX && clickedPos.x <= gMeme.lines[i].offsetX + gMeme.lines[i].width && clickedPos.y >= gMeme.lines[i].offsetY && clickedPos.y <= gMeme.lines[i].offsetY + gMeme.lines[i].height)
        if (clickedPos.x >= gMeme.lines[i].offsetX && clickedPos.x <= gMeme.lines[i].offsetX + gMeme.lines[i].width && clickedPos.y >= gMeme.lines[i].offsetY && clickedPos.y <= gMeme.lines[i].offsetY + gMeme.lines[i].height) {
            // console.log(i)
            gMeme.selectedLineIdx = i
            gMeme.selectedElement = 'line'
            return 'line'
        }

    }

    for (var i = 0; i < gMeme.stickers.length; i++) {
        console.log(clickedPos.x >= gMeme.stickers[i].offsetX && clickedPos.x <= gMeme.stickers[i].offsetX + gMeme.stickers[i].width && clickedPos.y >= gMeme.stickers[i].offsetY && clickedPos.y <= gMeme.stickers[i].offsetY + gMeme.stickers[i].height)
        if (clickedPos.x >= gMeme.stickers[i].offsetX && clickedPos.x <= gMeme.stickers[i].offsetX + gMeme.stickers[i].width && clickedPos.y >= gMeme.stickers[i].offsetY && clickedPos.y <= gMeme.stickers[i].offsetY + gMeme.stickers[i].height) {
            // console.log(i)
            gMeme.selectedStickerIdx = i
            gMeme.selectedElement = 'sticker'
            return 'sticker'
        }

    }

    // gMeme.lines.forEach((line, idx) => {
    //     if (clickedPos.x >= line.offsetX && clickedPos.x <= line.offsetX + line.width &&
    //         clickedPos.y >= line.offsetY && clickedPos.y <= line.offsetY + line.height) {
    //         console.log(clickedPos.x, line.offsetX, clickedPos.y, line.offsetY)
    //         gMeme.selectedLineIdx = idx
    //         return true
    //     }
    // })

    return ''
}

function setElementOffsetX(element, posX) {
    if (element === 'line') gMeme.lines[gMeme.selectedLineIdx].offsetX = posX
    else gMeme.stickers[gMeme.selectedStickerIdx].offsetX = posX

}

function setElementOffsetY(element, posY) {
    if (element === 'line') gMeme.lines[gMeme.selectedLineIdx].offsetY = posY
    else gMeme.stickers[gMeme.selectedStickerIdx].offsetY = posY
}

function getStickers() {
    return gStickers
}

function addSticker(sticker) {
    gMeme.stickers.push({
        img: sticker,
        size: 50,
        offsetX: 50,
        offsetY: 50,
        width: 50,
        height: 50
    })
}

function clearSelection() {
    gMeme.selectedElement = ''
}

function getSelectedElement() {
    return gMeme.selectedElement
}

function setSelectedElement(element) {
    gMeme.selectedElement = element
}

function getCurrSticker() {
    return gMeme.stickers[gMeme.selectedStickerIdx]
}
// GALLERY

function getImgs() {
    return gImgs
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function _createImgs() {
    gImgs = [{
            id: 1,
            url: '/img/1.jpg',
            keywords: ['funny']
        },
        {
            id: 2,
            url: '/img/2.jpg',
            keywords: ['cute', 'dogs']
        },
        {
            id: 3,
            url: '/img/3.jpg',
            keywords: ['cute', 'dogs', 'baby']
        }
    ]
}

function _createStickers() {
    gStickers = [{
            id: 1,
            img: '💜'
        },
        {
            id: 2,
            img: '⭐️'
        }
    ]
}
// var gMeme = {
//     selectedImgId: 1,
//     selectedLineIdx: 0,
//     lines: [{
//             txt: 'I sometimes eat Falafel',
//             size: 40,
//             align: 'left',
//             color: '#ff006e',
//             font: 'ariel',
//             offsetX: 20,
//             offsetY: 50
//         },
//         {
//             txt: 'Tal Liber',
//             size: 20,
//             align: 'left',
//             color: '#ff006e',
//             font: 'ariel',
//             offsetX: 30,
//             offsetY: 200
//         }
//     ]
// }
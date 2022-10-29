'use strict'

const STORAGE_KEY = 'memeDB'

var gImgs = []
var gStickers = []
var gMeme = {}
var gTxtFilter = ''

_createImgs()
_createStickers()

// EDITOR

function createMeme(prop, isMeme) {
    if (isMeme) gMeme = setMemeById(prop)
    else gMeme = {
        url: '',
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
    if (currMeme.url) return currMeme.url
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
        size: 25,
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

function removeElement() {
    console.log('rem');
    if (gMeme.selectedElement === '') return

    var tempIdx

    if (gMeme.selectedElement === 'line') {
        // if (gMeme.selectedLineIdx === gMeme.lines.length - 1) tempIdx = 0
        // else tempIdx = gMeme.selectedLineIdx + 1
        gMeme.lines.splice(gMeme.selectedLineIdx, 1)
            // gMeme.selectedLineIdx = tempIdx
    } else {
        // if (gMeme.selectedStickerIdx === gMeme.stickers.length - 1) tempIdx = 0
        // else tempIdx = gMeme.selectedStickerIdx + 1
        gMeme.stickers.splice(gMeme.selectedStickerIdx, 1)
            // gMeme.selectedStickerIdx = tempIdx
    }

    gMeme.selectedElement = ''
}

function saveMeme(newUrl) {
    gMeme.url = newUrl
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
    selectedMeme.meme.url = ''
    return selectedMeme.meme
}

function setTextWidth(txtWidth) {
    // console.log(txtWidth);
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
        size: 30,
        offsetX: 50,
        offsetY: 50,
        width: 30,
        height: 30
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

// GALLERY

function getImgs() {

    return _filterImgs()
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function setFilterTxt(txt) {
    gTxtFilter = txt
}

function _filterImgs() {

    return gImgs.filter(img => {
        const include = img.keywords.filter(keyword =>
            keyword.toLowerCase().includes(gTxtFilter.toLowerCase()))
        return include.length
    })
}

function addImg(url) {
    gImgs.push({
        id: 'aa',
        url,
        keywords: []
    })
}

function _createImgs() {
    gImgs = [{
            id: 1,
            url: 'img/1.jpg',
            keywords: ['funny']
        },
        {
            id: 2,
            url: 'img/2.jpg',
            keywords: ['cartoon', 'movies']
        },
        {
            id: 3,
            url: 'img/3.jpg',
            keywords: ['celebrity', 'politics']
        },
        {
            id: 4,
            url: 'img/4.jpg',
            keywords: ['cute', 'dogs']
        },
        {
            id: 5,
            url: 'img/5.jpg',
            keywords: ['cute', 'funny', 'baby']
        },
        {
            id: 6,
            url: 'img/6.jpg',
            keywords: ['cute', 'dogs', 'baby']
        },
        {
            id: 7,
            url: 'img/7.jpg',
            keywords: ['cute', 'cat']
        },
        {
            id: 8,
            url: 'img/8.jpg',
            keywords: ['movies']
        },
        {
            id: 9,
            url: 'img/9.jpg',
            keywords: ['cute', 'funny', 'baby']
        },
        {
            id: 10,
            url: 'img/10.jpg',
            keywords: ['celebrity']
        },
        {
            id: 11,
            url: 'img/11.jpg',
            keywords: ['funny', 'celebrity']
        },
        {
            id: 12,
            url: 'img/12.jpg',
            keywords: ['movies']
        },
        {
            id: 13,
            url: 'img/13.jpg',
            keywords: ['movies']
        },
        {
            id: 14,
            url: 'img/14.jpg',
            keywords: ['cute', 'funny', 'baby']
        },
        {
            id: 15,
            url: 'img/15.jpg',
            keywords: ['politics', 'celebrity']
        },
        {
            id: 16,
            url: 'img/16.jpg',
            keywords: ['cute', 'funny', 'baby']
        },
        {
            id: 17,
            url: 'img/17.jpg',
            keywords: ['cute', 'dogs', 'funny']
        },
        {
            id: 18,
            url: 'img/18.jpg',
            keywords: ['politics', 'celebrity']
        },
        {
            id: 19,
            url: 'img/19.jpg',
            keywords: ['movies', 'celebrity']
        },
        {
            id: 20,
            url: 'img/20.jpg',
            keywords: ['movies', 'matrix']
        },
        {
            id: 21,
            url: 'img/21.jpg',
            keywords: ['movies']
        },
        {
            id: 22,
            url: 'img/22.jpg',
            keywords: ['celebrity', 'oprah']
        },
        {
            id: 23,
            url: 'img/23.jpg',
            keywords: ['movies', 'funny']
        },
        {
            id: 24,
            url: 'img/24.jpg',
            keywords: ['politics', 'putin']
        },
        {
            id: 25,
            url: 'img/25.jpg',
            keywords: ['movies', 'toy story', 'buzz']
        },
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
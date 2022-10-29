'use strict'

//TODO remove on MyMemes
function onInit() {
    renderImgs()
}

function renderImgs() {
    const imgs = getImgs()

    const uploadStr = `  
            <label class="gallery-img upload"><div class="upload-header">Upload Image </div><i class="fa-solid fa-upload"></i>
                <input type="file" class="file-input btn" name="image" onchange="onImgInput(event)" />
            </label>
    `

    const strHTMLs = imgs.map(img => `
            <img class="gallery-img" onclick="onImgSelect(${img.id}, false)" src="${img.url}">
    `).join('')

    document.querySelector('.imgs-container').innerHTML = uploadStr + strHTMLs
}

function onSetFilterByTxt(txt) {
    setFilterTxt(txt)
    renderImgs()
}


function onImgSelect(prop, isMeme) {
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.my-memes-container').classList.add('hidden')
    document.querySelector('.main-editor-container').classList.remove('hidden')

    onOpenEditor(prop, isMeme)
}

function onMyMemes() {
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.my-memes-container').classList.remove('hidden')
    document.querySelector('.main-editor-container').classList.add('hidden')

    renderMyMemes()
}

function renderMyMemes() {
    const myMemes = loadFromStorage('memeDB')

    if (!myMemes) return

    const strHTMLs = myMemes.map(currMeme => `
            <img class="gallery-img" onclick="onImgSelect('${currMeme.id}', 'true')" src="${getImgURL(currMeme.meme)}">
    `).join('')

    document.querySelector('.my-memes-container').innerHTML = strHTMLs
}

function onGallery() {
    document.querySelector('.file-input').value = null

    document.querySelector('.gallery-container').classList.remove('hidden')
    document.querySelector('.my-memes-container').classList.add('hidden')
    document.querySelector('.main-editor-container').classList.add('hidden')

    renderImgs()
}

function onClickedFilterItem(item) {
    const style = window.getComputedStyle(item, null).getPropertyValue('font-size');
    const currentSize = parseFloat(style);
    item.style.fontSize = (currentSize + 1) + 'px';
}

function onImgInput(ev) {
    loadImageFromInput(ev, loadImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()

    reader.onload = function(event) {
        let img = new Image()
        img.src = event.target.result
        img.onload = onImageReady.bind(null, img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function loadImg(img) {

    addImg(img.src)
    onImgSelect('aa', false)
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}
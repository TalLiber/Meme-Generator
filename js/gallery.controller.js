'use strict'

//TODO remove on MyMemes
function onInit() {
    renderImgs()
}

function renderImgs() {
    const imgs = getImgs()

    const strHTMLs = imgs.map(img => `
        <article class="gallery-img">
            <img onclick="onImgSelect(${img.id}, false)" src="${img.url}">
        </article>
    `).join('')

    document.querySelector('.imgs-container').innerHTML = strHTMLs
}

function onSetFilterByTxt(txt) {
    console.log('Filtering by txt', txt)
    setFilterTxt(txt)
    renderImgs()
}


function onImgSelect(prop, isMeme, width, height) {
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.my-memes-container').classList.add('hidden')
    document.querySelector('.editor-container').classList.remove('hidden')

    onOpenEditor(prop, isMeme, width, height)
}

function onMyMemes() {
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.my-memes-container').classList.remove('hidden')
    document.querySelector('.editor-container').classList.add('hidden')

    renderMyMemes()
}

function renderMyMemes() {
    const myMemes = loadFromStorage('memeDB')

    if (!myMemes) return

    const strHTMLs = myMemes.map(currMeme => `
        <article class="gallery-img">
            <img onclick="onImgSelect('${currMeme.id}', 'true')" src="${getImgURL(currMeme.meme)}">
        </article>
    `).join('')

    document.querySelector('.my-memes-container').innerHTML = strHTMLs
}

function onGallery() {
    document.querySelector('.file-input').value = null

    document.querySelector('.gallery-container').classList.remove('hidden')
    document.querySelector('.my-memes-container').classList.add('hidden')
    document.querySelector('.editor-container').classList.add('hidden')

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
    const width = img.naturalWidth
    const height = img.naturalHeight

    addImg(img.src)
    onImgSelect('aa', false, width, height)
}
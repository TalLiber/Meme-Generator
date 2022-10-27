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

function onImgSelect(prop, isMeme) {
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.my-memes-container').classList.add('hidden')
    document.querySelector('.editor-container').classList.remove('hidden')

    onOpenEditor(prop, isMeme)
}

function onMyMemes() {
    document.querySelector('.gallery-container').classList.add('hidden')
    document.querySelector('.my-memes-container').classList.remove('hidden')

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
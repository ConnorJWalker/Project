let renderer, song

window.addEventListener('DOMContentLoaded', () => {
    window.postMessage({ message: 'request-song' })
    window.addEventListener('ipc-recieved-song', onRecieveSong)
})

function displaySongDetails() {
    document.getElementById('song-title').innerText = song.title
    document.getElementById('song-artist').innerText = song.artist

    completion = document.getElementById('completion-title')
    completionSpeed = document.getElementById('speed-title')
    completion.innerText = completion.innerText.replace('{}', song.completion.highestPercentage)
    completionSpeed.innerText = completionSpeed.innerText.replace('{}', song.completion.atSpeed)
}

function onRecieveSong(event) {
    song = event.detail
    // TODO: dont hardcode this
    song.completion = { highestPercentage: 72, atSpeed: 90 }

    displaySongDetails()
    renderer = new Renderer(song)
    renderer.renderBars(song.tracks[0].bars.length)

    window.addEventListener('resize', () => renderer.reRenderCanvas(song.tracks[0].bars.length))
}

let renderer, song, tracknameDropdown

window.addEventListener('DOMContentLoaded', () => {
    window.postMessage({ message: 'request-song' })
    window.addEventListener('ipc-recieved-song', onRecieveSong)

    tracknameDropdown = document.getElementById('track-dropdown')
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
    renderer.renderBars(song.tracks[0].bars.length, song.tracks[0].tuningNotes)
    populateTrackSelector(song.tracknames)

    window.addEventListener('resize', () => 
        renderer.reRenderCanvas(song.tracks[tracknameDropdown.value].bars.length, song.tracks[tracknameDropdown.value].tuningNotes))
    tracknameDropdown.addEventListener('change', e => 
        renderer.renderBars(song.tracks[e.target.value].bars.length, song.tracks[e.target.value].tuningNotes))
}

function populateTrackSelector(tracknames) {
    let tracks = tracknameDropdown
    tracknames.forEach((track, i) => tracks.innerHTML += `<option value=${i}>${track}</option>`)
}

/*
 * TEMP SONG
 * TODO: replace with selected song
 */
const song = {
    title: 'Alligator Blood',
    artist: 'Bring me the Horizon',
    tracknames: ['Rhythm Guitar', 'Lead Guitar', 'Bass', 'Background Guitar'],
    tracks: [{ bars: [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]] }],
    completion: {
        highestPercentage: 72,
        atSpeed: 90
    }
}

let renderer

window.addEventListener('DOMContentLoaded', () => {
    displaySongDetails()

    renderer = new Renderer(song)
    renderer.renderBars(song.tracks[0].bars.length)
})

function displaySongDetails() {
    document.getElementById('song-title').innerText = song.title
    document.getElementById('song-artist').innerText = song.artist

    completion = document.getElementById('completion-title')
    completionSpeed = document.getElementById('speed-title')
    completion.innerText = completion.innerText.replace('{}', song.completion.highestPercentage)
    completionSpeed.innerText = completionSpeed.innerText.replace('{}', song.completion.atSpeed)
}

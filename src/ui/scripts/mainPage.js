let renderer, song, tracknameDropdown, isCurrentlyPlaying = false

window.addEventListener('DOMContentLoaded', () => {
    window.postMessage({ message: 'request-song' })
    window.addEventListener('ipc-recieved-song', onRecieveSong)

    tracknameDropdown = document.getElementById('track-dropdown')
    setupControlButtons()
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
    renderer.renderBars(song.tracks[0].bars.length, song.tracks[0].tuningNotes, song.tracks[0].bars)
    populateTrackSelector(song.tracknames)

    window.addEventListener('resize', () => {
        const i = tracknameDropdown.value
        renderer.reRenderCanvas(
            song.tracks[i].bars.length, song.tracks[i].tuningNotes, song.tracks[i].bars
        )  
    })
    tracknameDropdown.addEventListener('change', e => {
        const i = e.target.value
        renderer.renderBars(
            song.tracks[i].bars.length, song.tracks[i].tuningNotes, song.tracks[i].bars
        )
    })
}

function populateTrackSelector(tracknames) {
    let tracks = tracknameDropdown
    tracknames.forEach((track, i) => tracks.innerHTML += `<option value=${i}>${track}</option>`)
}

async function setupControlButtons() {
    const iconsPath = '../../../assets/icons/{}.svg'
    let iconPromiseArray = []; // This semicolon prevents error
    ['chevron-left-solid', 'chevron-right-solid', 'play-solid', 'pause-solid'].forEach(icon => {
        iconPromiseArray.push(fetch(iconsPath.replace('{}', icon)))
    })

    let responses = await Promise.all(iconPromiseArray)
    responses = await Promise.all(responses.map(res => res.text()))

    document.getElementById('prev-btn').innerHTML = responses[0]
    document.getElementById('next-btn').innerHTML = responses[1]
    
    const playButton = document.getElementById('play-btn')
    playButton.innerHTML = responses[2]
    playButton.addEventListener('click', () => {
        playButton.innerHTML = responses[isCurrentlyPlaying ? 2 : 3]
        isCurrentlyPlaying = !isCurrentlyPlaying

        if (isCurrentlyPlaying)
            playButton.classList.add('paused')
        else
            playButton.classList.remove('paused')
    })
}

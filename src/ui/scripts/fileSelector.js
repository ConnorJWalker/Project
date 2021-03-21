let selectedFile = ''

window.addEventListener('DOMContentLoaded', () => {
    const filepathLbl = document.getElementById('filepath-lbl')
    const fileErrorLbl = document.getElementById('recent-file-errors')

    document.getElementById('search-btn').addEventListener('click', () => {
        window.postMessage({ message: 'open-file-dialogue' })
    })

    document.getElementById('continue-btn').addEventListener('click', () => {
        window.postMessage({ message: 'open-gp-file', args: selectedFile })
    })

    window.addEventListener('ipc-loaded-file', event => {
        if (event.detail.canceled) return

        selectedFile = event.detail.filePaths[0]
        filepathLbl.innerText = selectedFile
    })

    window.addEventListener('ipc-recent-files', event => {
        if (!event.detail.success) {
            fileErrorLbl.innerText = 'Could not load recent files :('
            fileErrorLbl.style.display = 'block'
            return
        }
        else if (event.detail.file.recents.length === 0) {
            fileErrorLbl.innerText = 'No recent files :('
            fileErrorLbl.style.display = 'block'
            return
        } else {
            fileErrorLbl.style.display = 'none'
        }

        const template = document.getElementById('recent-file-row')
        const container = document.getElementById('recents-container')
        event.detail.file.recents.forEach(song => {
            let clone = template.content.cloneNode(true)
            clone.getElementById('recent-title').innerText = song.title
            clone.getElementById('recent-artist').innerText = song.artist
            
            date = new Date(song.date)
            day = date.getDate().toString().padStart(2, '0')
            month = date.getMonth().toString().padStart(2, '0')
            year = date.getFullYear()
            clone.getElementById('recent-date').innerText = `${day}/${month}/${year}`

            container.appendChild(clone)
            console.log(song)
        })
    })

    window.addEventListener('ipc-open-gp-file', event => console.log(event.detail))

    window.postMessage({ message: 'get-recent-files' })
})
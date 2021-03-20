window.addEventListener('DOMContentLoaded', () => {
    const filepathLbl = document.getElementById('filepath-lbl')
    const fileErrorLbl = document.getElementById('recent-file-errors')

    document.getElementById('search-btn').addEventListener('click', () => {
        window.postMessage({ message: 'open-file-dialogue' })
    })

    window.addEventListener('ipc-loaded-file', event => {
        if (event.detail.canceled) return

        filepathLbl.innerText = event.detail.filePaths[0]
    })

    window.addEventListener('ipc-recent-files', event => {
        if (!event.detail.success) {
            fileErrorLbl.innerText = 'Could not load recent files :('
            return
        }
        else if (event.detail.file.recents.length === 0) {
            fileErrorLbl.innerText = 'No recent files :('
            return
        }
    })

    window.postMessage({ message: 'get-recent-files' })
})
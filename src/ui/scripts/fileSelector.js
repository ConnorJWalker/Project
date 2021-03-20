let selectedFile = ''

window.addEventListener('DOMContentLoaded', () => {
    const filepathLbl = document.getElementById('filepath-lbl')
    const fileErrorLbl = document.getElementById('recent-file-errors')

    document.getElementById('search-btn').addEventListener('click', () => {
        window.postMessage({ message: 'open-file-dialogue' })
    })

    document.getElementById('continue-btn').addEventListener('click', () => {
        
    })

    window.addEventListener('ipc-loaded-file', event => {
        if (event.detail.canceled) return

        selectedFile = event.detail.filePaths[0]
        filepathLbl.innerText = selectedFile
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
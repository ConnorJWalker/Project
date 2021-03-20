window.addEventListener('DOMContentLoaded', () => {
    const filepathLbl = document.getElementById('filepath-lbl')
    
    document.getElementById('search-btn').addEventListener('click', () => {
        window.postMessage({ message: 'open-file-dialogue' })
    })
})
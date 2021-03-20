const { dialog } = require('electron')
const fs = require('fs')
const path = require('path')

exports.AddEventListeners = ipcMain => {
    ipcMain.on('open-file-dialogue', event => {
        dialog.showOpenDialog({ properties: ['openFile'] })
            .then(file => {
                event.sender.send('message', { message: 'ipc-loaded-file', data: file })
            })
    })

    ipcMain.on('get-recent-files', event => {
        const responseName = 'ipc-recent-files'
        fs.readFile(path.join(__dirname, '../../assets/recentFiles.json'), 'utf8', (err, file) => {
            if (err) {
                console.error(err)
                event.sender.send('message', { message: responseName, data: { success: false }})
                return
            }

            file = JSON.parse(file)
            event.sender.send('message', { message: responseName, data: { success: true, file }})
        })
    })
}

exports.RemoveEventListeners = ipcMain => {
    ['open-file-dialogue', 'get-recent-files'].forEach(listener => {
        ipcMain.removeListener(listener)
    })
}
const { dialog } = require('electron')

exports.AddEventListeners = ipcMain => {
    ipcMain.on('open-file-dialogue', event => {
        dialog.showOpenDialog({ properties: ['openFile'] })
            .then(file => {
                event.sender.send('message', { message: 'ipc-loaded-file', data: file })
            })
    })
}

exports.RemoveEventListeners = ipcMain => {
    ['open-file-dialogue'].forEach(listener => {
        ipcMain.removeListener(listener)
    })
}
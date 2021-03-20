const { dialog } = require('electron')

exports.AddEventListeners = ipcMain => {
    ipcMain.on('open-file-dialogue', event => {
        console.log('main')
        dialog.showOpenDialog({ properties: ['openFile'] })
            .then(file => {
                console.log(file)
            })
    })
}

exports.RemoveEventListeners = ipcMain => {
    ['open-file-dialogue'].forEach(listener => {
        ipcMain.removeListener(listener)
    })
}
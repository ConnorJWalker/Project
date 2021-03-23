const guitarApi = require('../guitarApi')

exports.AddEventListeners = (ipcMain, song) => {
    ipcMain.on('request-song', event => {
        const updatedSong = guitarApi.setSongData(JSON.stringify(song))
        event.sender.send('message', { message: 'ipc-recieved-song', data: JSON.parse(updatedSong) })
    })
}

exports.RemoveEventListeners = ipcMain => {
    ['request-song'].forEach(listener => {
        ipcMain.RemoveEventListeners(listener)
    })
}
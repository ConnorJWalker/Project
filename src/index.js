const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fileSelector = require('./ipcMainScripts/fileSelector')
const guitarApi = require('./guitarApi')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    fileSelector.AddEventListeners(ipcMain)
    win.loadFile('ui/views/fileSelector.html')
    console.log(guitarApi.add(10, 5))
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit()
})
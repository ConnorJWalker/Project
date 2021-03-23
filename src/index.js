const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fileSelector = require('./ipcMainScripts/fileSelector')
const mainPage = require('./ipcMainScripts/mainPage')

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
    
    ipcMain.on('move-to-tabs-page', (_, song) => {
        fileSelector.RemoveEventListeners(ipcMain)
        win.loadFile('ui/views/mainPage.html')
        win.maximize()
        mainPage.AddEventListeners(ipcMain, song)
    })
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
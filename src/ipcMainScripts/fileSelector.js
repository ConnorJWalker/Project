const { dialog } = require('electron')
const { spawn } = require('child_process')
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

    ipcMain.on('open-gp-file', (event, file) => {
        const pyFilepath = '../guitarApi/fileLoaders/main.py'
        const python = spawn('python3', [path.join(__dirname, pyFilepath), file])
        let outputString = ''

        python.stdout.on('data', data => outputString += data.toString())
        python.stderr.on('data', err => console.error(err.toString()))
        python.on('exit', () =>  {
            event.sender.send('message', { message: 'ipc-open-gp-file', data: JSON.parse(outputString) })
        })
    })
}

exports.RemoveEventListeners = ipcMain => {
    ['open-file-dialogue', 'get-recent-files', 'open-gp-file'].forEach(listener => {
        ipcMain.removeListener(listener)
    })
}
const { dialog } = require('electron')
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

let recentFiles
const recentFilesPath = path.join(__dirname, '../../assets/recentFiles.json')

exports.AddEventListeners = ipcMain => {
    ipcMain.on('open-file-dialogue', event => {
        dialog.showOpenDialog({ properties: ['openFile'] })
            .then(file => {
                event.sender.send('message', { message: 'ipc-loaded-file', data: file })
            })
    })

    ipcMain.on('get-recent-files', event => {
        const responseName = 'ipc-recent-files'
        if (!checkRecentsFileExists()) 
            event.sender.send('message', { message: responseName, data: { success: false } })

        fs.readFile(recentFilesPath, 'utf8', (err, file) => {
            if (err) {
                console.error(err)
                event.sender.send('message', { message: responseName, data: { success: false }})
                return
            }

            recentFiles = JSON.parse(file)
            event.sender.send('message', { message: responseName, data: { success: true, file: recentFiles }})
        })
    })

    ipcMain.on('open-gp-file', (event, file) => {
        const pyFilepath = '../guitarApi/fileLoaders/main.py'
        const python = spawn('python3', [path.join(__dirname, pyFilepath), file])
        let outputString = ''

        python.stdout.on('data', data => outputString += data.toString())
        python.stderr.on('data', err => console.error(err.toString()))
        python.on('exit', () =>  updateRecentFiles(event, outputString, file))
    })
}

exports.RemoveEventListeners = ipcMain => {
    ['open-file-dialogue', 'get-recent-files', 'open-gp-file'].forEach(listener => {
        ipcMain.removeAllListeners(listener)
    })
}

function updateRecentFiles(event, file, filepath) {
    if (!checkRecentsFileExists()) return

    file = JSON.parse(file)
    const index = recentFiles.recents.findIndex(element =>
        element.artist === file.artist && element.title === file.title    
    )

    // Selected song is not in recent files list if index is -1
    if (index === -1) {
        if (recentFiles.recents.length >= 5)
            recentFiles.recents.pop()
        recentFiles.recents.unshift({ artist: file.artist, title: file.title, date: Date.now(), path: filepath })
    } else {
        selected = recentFiles.recents[index]
        selected.date = Date.now()
        recentFiles.recents.splice(index, 1)
        recentFiles.recents.unshift(selected)
    }

    fs.writeFile(recentFilesPath, JSON.stringify(recentFiles), 'utf8', () => {
        event.sender.send('message', { message: 'ipc-open-gp-file', data: file })
    })
}

function checkRecentsFileExists() {
    if (fs.existsSync(recentFilesPath)) return true

    const structure = JSON.stringify({ recents: [] })
    try {
        fs.writeFileSync(recentFilesPath, structure, 'utf8')
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}
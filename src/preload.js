const { ipcRenderer } = require('electron')

process.once('loaded', () => {
    window.addEventListener('message', event => {
        const message = event.data
        console.log(event)
        if (message.args)
            ipcRenderer.send(message.message, message.args)
        else
            ipcRenderer.send(message.message)
    })
})
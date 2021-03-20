const { ipcRenderer } = require('electron')

process.once('loaded', () => {
    window.addEventListener('message', event => {
        const message = event.data
        if (message.args)
            ipcRenderer.send(message.message, message.args)
        else
            ipcRenderer.send(message.message)
    })

    ipcRenderer.on('message', (_, data) => {
        window.dispatchEvent(new CustomEvent(data.message, { detail: { ...data.data }}))
    })
})
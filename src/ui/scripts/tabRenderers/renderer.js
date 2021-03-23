class Renderer {
    constructor(song) {
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')

        this.currentX = 0
        this.currentY = 0
        this.canvasWidth = this.getCanvasWidth()
        // TODO: persist settings set by user
        this.settings = {
            barsPerLine:  3,
            barHeight: 100,
        }

        this.canvas.height = (Math.ceil(song.tracks[0].bars.length / this.settings.barsPerLine) * (this.settings.barHeight + 10))
    }

    renderBars(numberOfBars, tuningNotes) {
        // Reset x and y to prevent rerenders apearing off screen
        this.currentX = 0
        this.currentY = 0
        
        for (let i = 0; i < numberOfBars; i++) {
            // TODO: work out height properly without hardcoding
            this.context.strokeRect(this.currentX, this.currentY, this.canvasWidth / 3, this.settings.barHeight)
            this.renderStringsInBar(tuningNotes)

            // We have drawn the max amount of bars per line
            if ((i + 1) % this.settings.barsPerLine === 0) {
                this.currentX = 0;
                this.currentY += this.settings.barHeight + 10 // TODO: not hardcode this
                continue
            }

            this.currentX += this.canvasWidth / this.settings.barsPerLine
        }
    }

    renderStringsInBar(tuningNotes) {
        this.context.beginPath()
        const height = this.settings.barHeight / (tuningNotes.length - 1)
        let currenyY = this.currentY + height

        for (let i = 0; i < tuningNotes.length - 1; i++) {
            this.context.moveTo(this.currentX, currenyY)
            this.context.lineTo(this.currentX + this.canvasWidth / this.settings.barsPerLine, currenyY)
            currenyY += height
        }
        
        this.context.closePath()
        this.context.stroke()
    }

    getCanvasWidth() {
        const width = document.body.offsetWidth - 50 // TODO: dont hardcode margin
        this.canvas.width = width

        return width
    }

    reRenderCanvas(numberOfBars, tuningNotes) {
        this.canvasWidth = this.getCanvasWidth()
        this.renderBars(numberOfBars, tuningNotes)
    }
}
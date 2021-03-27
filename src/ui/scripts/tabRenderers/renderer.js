class Renderer {
    constructor(song) {
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')

        this.canvasWidth = this.getCanvasWidth()
        // TODO: persist settings set by user
        this.settings = {
            barsPerLine:  3,
            barHeight: 100,
        }

        this.canvas.height = (Math.ceil(song.tracks[0].bars.length / this.settings.barsPerLine) * (this.settings.barHeight + 10))
    }

    renderBars(numberOfBars, tuningNotes, bars) {
        // Reset x and y to prevent rerenders apearing off screen
        this.currentX = 0
        this.currentY = 20 // Padding to prevent cut off
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (let i = 0; i < numberOfBars; i++) {
            if (i === 0) {
                this.renderBarWithTuningNotes(tuningNotes, bars[0])
                continue
            }
            
            // TODO: work out height properly without hardcoding
            this.context.strokeRect(this.currentX, this.currentY, this.canvasWidth / 3, this.settings.barHeight)
            this.renderStringsInBar(tuningNotes, bars[i])

            // We have drawn the max amount of bars per line
            if ((i + 1) % this.settings.barsPerLine === 0) {
                this.currentX = 0;
                this.currentY += this.settings.barHeight + 10 // TODO: not hardcode this
                continue
            }

            this.currentX += this.canvasWidth / this.settings.barsPerLine
        }
    }

    renderStringsInBar(tuningNotes, bar, start) {
        this.context.beginPath()
        const height = this.settings.barHeight / (tuningNotes.length - 1)
        let currenyY = this.currentY + height
        start = start || 0
        let yCoords = []

        for (let i = 0; i < tuningNotes.length - 1; i++) {
            this.context.moveTo(this.currentX + start, currenyY)
            this.context.lineTo(this.currentX + this.canvasWidth / this.settings.barsPerLine, currenyY)
            yCoords.push(currenyY)
            currenyY += height
        }
        
        this.context.closePath()
        this.context.stroke()

        this.renderBarNotes(
            bar, 
            this.currentX + start, 
            yCoords, 
            this.canvasWidth / this.settings.barsPerLine + start, 
            tuningNotes.length
        )
    }

    renderBarWithTuningNotes(tuningNotes, bar) {
        let longestWidth = 0
        const height = (this.settings.barHeight / tuningNotes.length) + (parseInt(this.context.font) / 4.6)
        this.context.textBaseline = 'middle'
        tuningNotes.forEach((note, i) => {
            this.context.fillText(note, this.currentX, this.currentY + (height * i))
            longestWidth = Math.max(longestWidth, Math.ceil(this.context.measureText(note).width))
        })
        longestWidth += 10 

        const width = (this.canvasWidth / this.settings.barsPerLine) - longestWidth
        this.context.strokeRect(this.currentX + longestWidth, this.currentY, width, this.settings.barHeight)
        this.renderStringsInBar(tuningNotes, bar, longestWidth)

        this.currentX += this.canvasWidth / this.settings.barsPerLine
    }

    renderBarNotes(bar, barX, barY, width, numStrings) {
        bar.notes.forEach(notes => {
            if (notes.note.length === 0) return
            const padding = 2
            const rectHeight = parseInt(this.context.font) + 4

            notes.note.forEach(val => {
                const x = this.map(notes.start, bar.start, bar.end, barX + 15, barX + (Math.abs(width) - 15))
                const y = barY[val.string - 2]
                console.log(val, x, y - rectHeight * 2, this.context.measureText(val.fret).width + padding * 2, rectHeight)
                this.context.clearRect(x, y, this.context.measureText(val.fret).width + padding * 2, rectHeight)

                this.context.fillText(val.fret, x, y)
            })
        })
    }

    getCanvasWidth() {
        const width = document.body.offsetWidth - 50 // TODO: dont hardcode margin
        this.canvas.width = width

        return width
    }

    reRenderCanvas(numberOfBars, tuningNotes, bars) {
        this.canvasWidth = this.getCanvasWidth()
        this.renderBars(numberOfBars, tuningNotes, bars)
    }

    // https://github.com/processing/p5.js/blob/1.1.9/src/math/calculation.js#L408
    map (n, start1, stop1, start2, stop2) {
        return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    }
}
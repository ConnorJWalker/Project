import sys, json

class Song:
    def __init__(self, file, filename):
        self.title = file.title or filename.split('/')[-1].split('.')[0]
        self.artist = file.artist or 'Unknown Artist'
        self.copyright = 'Unknown Copyright'
        self.tracknames = []
        self.tracks = []
        self.isMissingFields = file.title == '' or file.artist == '' or self.copyright == ''

        for track in file.tracks:
            self.tracknames.append(track.name)
            self.tracks.append(Track(track))

    def printAsJson(self):
        print(json.dumps(self.__dict__, default=lambda o: o.__dict__))
        sys.stdout.flush()

class Track:
    def __init__(self, track):
        self.name = track.name
        self.bars = []
        self.tuning = []

        for string in reversed(track.strings):
            self.tuning.append(string.value)
        for bar in track.measures:
            self.bars.append(Bar(bar, self.tuning))

class Bar:
    def __init__(self, bar, tuning):
        self.notes = []
        self.start = bar.start
        self.end = bar.end

        for voice in bar.voices:
            for beat in voice.beats:
                self.notes.append(Note(beat.notes))

class Note:
    def __init__(self, notes):
        self.note = []

        for note in notes:
            self.note.append({
                "string": note.string,
                "fret": note.value,
            })
            self.start = note.beat.start
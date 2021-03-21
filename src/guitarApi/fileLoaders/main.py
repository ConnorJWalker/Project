import guitarpro
from reader import Song
import sys

file = guitarpro.parse(sys.argv[1])
song = Song(file, sys.argv[1])
song.printAsJson()
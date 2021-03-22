#include <string>
#include <vector>

// TODO create nodeJS wrapper around these classes
class Song {
// Properties
private:
    std::string title;
    std::string artsist;
    std::string copyright;
    std::vector<std::string> tracknames;
    std::vector<Track> tracks;
    bool isMissingFields;
};

class Track {
    // Properties
    std::string name;
    std::vector<Bar> bars;
    std::vector<int> tuning; //TODO: create function to change this from int to letter
};

class Bar {
    // Properties
    std::vector<Note> notes;
};

class Note {
    // Properties
    std::vector<int> notes;
};
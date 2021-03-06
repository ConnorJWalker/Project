#include <string>
#include <vector>
#include <nlohmann/json.hpp>

class Note {
private:
    int string;
    int fret;

public:
    Note(nlohmann::json input);
};

class Notes {
private:
    std::vector<Note> notes;
    int start;

public:
    Notes(nlohmann::json input);
};

class Bar {
private:
    std::vector<Notes> notes;

public:
    Bar(nlohmann::json input);
};

class Track {
private:
    std::string name;
    std::vector<Bar> bars;
    std::vector<int> tuning;

    std::vector<std::string> getTuningNotes();

public:
    std::vector<std::string> tuningNotes;

    Track(nlohmann::json input);
};

// TODO create nodeJS wrapper around these classes
class Song {
private:
    std::string title;
    std::string artist;
    std::string copyright;
    std::vector<std::string> tracknames;
    std::vector<Track> tracks;
    bool isMissingFields;

public:
    Song(std::string inputJson);
    static std::string getUpdatedSongString(std::string input);
};

#include <string>
#include <vector>
#include <nlohmann/json.hpp>

class Note {
private:
    std::vector<int> notes;

public:
    Note(nlohmann::json input);
};

class Bar {
private:
    std::vector<Note> notes;

public:
    Bar(nlohmann::json input);
};

class Track {
private:
    std::string name;
    std::vector<Bar> bars;
    std::vector<int> tuning; //TODO: create function to change this from int to letter
    std::vector<char> tuningNotes;

    std::vector<char> getTuningNotes();

public:
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
};

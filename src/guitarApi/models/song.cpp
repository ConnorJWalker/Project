#include "song.hpp"

Song::Song(std::string inputJson) {
    nlohmann::json input = nlohmann::json::parse(inputJson);

    title = input.at("title").get<std::string>();
    artist = input.at("artist").get<std::string>();
    copyright = input.at("copyright").get<std::string>();
    tracknames = input.at("tracknames").get<std::vector<std::string>>();

    auto tracksJson = input.at("tracks").get<std::vector<nlohmann::json>>();
    for (const auto& track : tracksJson) {
        tracks.emplace_back(Track(track));
    }
}

std::string Song::getUpdatedSongString(std::string input) {
    Song song = Song(input);
    nlohmann::json songJson = nlohmann::json::parse(input);
    
    for (size_t i = 0; i < song.tracks.size(); i++) {
        songJson["tracks"][i]["tuningNotes"] = song.tracks[i].tuningNotes;
    }

    return songJson.dump();
}

Track::Track(nlohmann::json input) {
    name = input.at("name").get<std::string>();
    tuning = input.at("tuning").get<std::vector<int>>();

    auto barsJson = input.at("bars").get<std::vector<nlohmann::json>>();

    for (const auto& bar : barsJson) {
        bars.emplace_back(Bar(bar));
    }

    tuningNotes = getTuningNotes();
}

std::vector<std::string> Track::getTuningNotes() {
    std::vector<std::string> notes = std::vector<std::string>();
    std::vector<std::string> possibleNotes = {
        "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"
    };

    for (int string : tuning) {
        // If the value is zero then it is a drum, not a guitar string
        if (string == 0) {
            notes.emplace_back("DRUM");
            continue;
        }

        notes.push_back(possibleNotes[(string - 1) % possibleNotes.size()]);
    }

    return notes;
}



Bar::Bar(nlohmann::json input) {
    auto notesJson = input.at("notes").get<std::vector<nlohmann::json>>();
    for (const auto& note : notesJson) {
        notes.emplace_back(Notes(note));
    }
}

Notes::Notes(nlohmann::json input) {
    try {
        start = input.at("start").get<int>();
    } catch (nlohmann::detail::out_of_range e) {
        start = -1;
    }
    
    auto notesJson = input.at("note").get<std::vector<nlohmann::json>>();
    for (const auto& note : notesJson) {
        notes.emplace_back(Note(note));
    }
}

Note::Note(nlohmann::json input) {
    string = input.at("string").get<int>();
    fret = input.at("fret").get<int>();
}

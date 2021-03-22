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

Track::Track(nlohmann::json input) {
    name = input.at("name").get<std::string>();
    tuning = input.at("tuning").get<std::vector<int>>();

    auto barsJson = input.get<std::vector<nlohmann::json>>();
    for (const auto& bar : barsJson) {
        bars.emplace_back(Bar(bar));
    }

    tuningNotes = getTuningNotes();
}

std::vector<char> Track::getTuningNotes() {
    return std::vector<char>();
}

Bar::Bar(nlohmann::json input) {
    auto notesJson = input.at("notes").get<std::vector<nlohmann::json>>();
    for (const auto& note : notesJson) {
        notes.emplace_back(Note(note));
    }
}

Note::Note(nlohmann::json input) {
    notes = input.at("note").get<std::vector<int>>();
}

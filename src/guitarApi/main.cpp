#include "models/song.hpp"
#include <napi.h>

using namespace Napi;

// TODO: store in c++ aswell as just return
Value setSongData(const Napi::CallbackInfo& info) {
    Env env = info.Env();
    if (info.Length() != 1 && !info[0].IsString()) {
        Napi::TypeError::New(env, "Invalid Arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string input = info[0].As<String>();

    std::string returnString = Song::getUpdatedSongString(info[0].ToString());
    return String::New(env, returnString);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(String::New(env, "setSongData"), Function::New<setSongData>(env));
    return exports;
}

NODE_API_MODULE(guitarApi, Init);
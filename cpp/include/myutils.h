#pragma once

#define println(args...) fmt::print(args)
#include <fmt/core.h>
#include <fmt/ranges.h>
#include <filesystem>

namespace fs = std::filesystem;
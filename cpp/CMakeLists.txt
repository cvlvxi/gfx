
project(rusticvk)
cmake_minimum_required(VERSION 3.14)

get_filename_component(BIN "bin" ABSOLUTE)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "${BIN}")
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "${BIN}")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${BIN}")

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_BUILD_TYPE Debug)

set(WARNING_FLAGS "-Wall")

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${WARNING_FLAGS}")

find_package(vulkan)
find_package(glfw3 3.3.0 REQUIRED)

get_filename_component(EXTERN "extern" ABSOLUTE)

include_directories(include)

#################################################################
# External Dependencies
#################################################################
## fmt
add_subdirectory("${EXTERN}/fmt")

#################################################################
# Internal Dependencies
#################################################################
## iutils 
add_library(myutils INTERFACE)
target_include_directories(myutils INTERFACE "${EXTERN}/fmt/include" "${EXTERN}/outcome")
target_link_libraries(myutils INTERFACE fmt::fmt)

add_subdirectory(src)
add_subdirectory(playground)

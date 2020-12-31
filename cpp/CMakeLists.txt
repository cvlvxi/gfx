
project(rusticvk)
cmake_minimum_required(VERSION 3.14)


set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_BUILD_TYPE Debug)

set(WARNING_FLAGS "-Wall")

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${WARNING_FLAGS}")

find_package(vulkan)
find_package(glfw3 3.2.1 REQUIRED)


add_executable(main src/main.cpp)

target_link_libraries(main Vulkan::Vulkan glfw)

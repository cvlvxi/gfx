
add_library(vulkanapp STATIC vulkanapp.cpp)
target_link_libraries(vulkanapp glfw Vulkan::Vulkan)

add_executable(triangle triangle.cpp)
target_link_libraries(triangle vulkanapp myutils)

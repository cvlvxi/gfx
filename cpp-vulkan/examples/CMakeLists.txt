set(projectname "triangle")
add_executable(${projectname} triangle.cpp ../src/vulkanapp.cpp)
target_link_libraries(${projectname} glfw Vulkan::Vulkan glm)

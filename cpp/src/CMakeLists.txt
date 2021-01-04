
set(PROJECTS "triangle")

add_executable(triangle triangle.cpp)

foreach(project ${PROJECTS})
    target_link_libraries(${project} Vulkan::Vulkan glfw myutils)
endforeach()
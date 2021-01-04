
set(PROJECT_NAMES "triangle")
set(PROJECT_FILES "triangle.cpp")

add_library(vulkanapp STATIC vulkanapp.cpp)
target_link_libraries(vulkanapp glfw Vulkan::Vulkan)

foreach(projectname filepath IN ZIP_LISTS ${PROJECT_NAMES} ${PROJECT_FILES})
    add_executable(${projectname} ${filepath})
    target_link_libraries(${projectname} myutils vulkanapp)
endforeach()

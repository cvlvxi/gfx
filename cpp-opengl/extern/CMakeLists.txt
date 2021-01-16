
add_definitions(
	-DGLEW_STATIC
)
add_subdirectory(glfw EXCLUDE_FROM_ALL)
add_subdirectory(glew EXCLUDE_FROM_ALL)
add_subdirectory(glm EXCLUDE_FROM_ALL)
#pragma once

#include "includes.hpp"
#include "window.hpp"
#include <memory>

class App {
public:
  GLFWwindow *window_;

  App() { init(); }

  void init() {
    log_info("Initializing Window");
    int success = createWindow("Default Title", 800, 600);
    if (success == -1) {
      throw("Couldn't start window");
    }

    // Initialize GLEW
    glewExperimental = true; // Needed for core profile
    if (glewInit() != GLEW_OK) {
      getchar();
      glfwTerminate();
      throw("Couldn't start GLEW");
    }
    glfwSetInputMode(window_, GLFW_STICKY_KEYS, GL_TRUE);
    glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
  }

  int createWindow(const std::string &title, int width, int height) {
    // Initialise GLFW
    if (!glfwInit()) {
      fprintf(stderr, "Failed to initialize GLFW\n");
      getchar();
      return -1;
    }

    glfwWindowHint(GLFW_SAMPLES, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT,
                   GL_TRUE); // To make MacOS happy; should not be needed
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    // Open a window and create its OpenGL context
    window_ = glfwCreateWindow(width, height, title.c_str(), NULL, NULL);
    if (window_ == NULL) {
      getchar();
      glfwTerminate();
      return -1;
    }
    glfwMakeContextCurrent(window_);
    return 0;
  }

}
;
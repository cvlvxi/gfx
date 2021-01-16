#pragma once

#include "includes.hpp"


class WindowDesc
{
public:
    GLFWwindow *window_;

    WindowDesc() {
        log_info("Initializing Window");
        this->createWindow();
    }

    int createWindow()
    {
        // Initialise GLFW
        if (!glfwInit())
        {
            fprintf(stderr, "Failed to initialize GLFW\n");
            getchar();
            return -1;
        }

        glfwWindowHint(GLFW_SAMPLES, 4);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE); // To make MacOS happy; should not be needed
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

        // Open a window and create its OpenGL context
        window_ = glfwCreateWindow(1024, 768, "Tutorial 02 - Red triangle", NULL, NULL);
        if (window_ == NULL)
        {
            fprintf(stderr, "Failed to open GLFW window. If you have an Intel GPU, they are not 3.3 compatible. Try the 2.1 version of the tutorials.\n");
            getchar();
            glfwTerminate();
            return -1;
        }
        glfwMakeContextCurrent(window_);
        return 0;
    }
};
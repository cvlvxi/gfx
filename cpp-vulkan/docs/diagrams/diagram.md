# Vulkan Diagrams 

<!-- vscode-markdown-toc -->

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


## Flow Chart

```mermaid


stateDiagram-v2

    AppRun
    AppRun --> initWindow
    initWindow --> initVulkan

    %% Initialisation to Objects    
    glfwCreateWindow --> GLFWwindow

    %% Create Instance
    createInstance --> VkInstance
    createInstance --> glfwGetRequiredInstanceExtensions
    glfwGetRequiredInstanceExtensions --> GLFWExtensions

    %% Create Instance
    createSurface --> VkSurfaceKHR
    pickPhysicalDevice --> IntegratedGPU
    IntegratedGPU --> VkPhysicalDevice
    note left of IntegratedGPU
        Must check if device is suitable
        e.g. does it have Swap Chain support
        via existence of a family_queue? 
    end note

    state initWindow {
        glfwCreateWindow
    }

    state initVulkan {
        createInstance
        setupDebugMessenger
        createSurface
        pickPhysicalDevice
        createLogicalDevice
        createSwapChain
        createRenderPass
    }

    state Devices {
        IntegratedGPU
        DedicatedGPU
    }

    state Vulkan {
        VkInstance
        VkSurfaceKHR
        VkPhysicalDevice
        VkDevice
        VkSwapchainKHR

        state Queues {
            VkQueue1
            VkQueue2
        }
        state SwapChainImages {
            VkImage
        }

        state Extensions {
            GLFWExtensions
            ValidationLayerExtensions

        }
    }

    state GLFW {
        GLFWwindow
        glfwGetRequiredInstanceExtensions

        
    }
```
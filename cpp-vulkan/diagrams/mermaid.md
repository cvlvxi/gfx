```mermaid
%% Start Diagram 


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

    %% Create Surface
    createSurface --> glfwCreateWindowSurface
    glfwCreateWindowSurface --> VkSurfaceKHR

    %% Create Physical Device
    pickPhysicalDevice --> IntegratedGPU
    IntegratedGPU --> VkPhysicalDevice
    note left of IntegratedGPU
        Must check if device is suitable
        e.g. does it have Swap Chain support
        via existence of a family_queue? 
    end note

    %% Create Logical Device
    createLogicalDevice --> VkPhysicalDevice: Find devices family_queues
    VkPhysicalDevice --> VkQueue1: Find the graphics Queue
    VkPhysicalDevice --> VkQueue2: Find the present Queue 
    VkPhysicalDevice --> VkDevice: Create the Logical Device

    %% Create Swap Chain
    createSwapChain --> SwapChainSupportDetails: queries via querySwapChainSupport()
    VkSurfaceKHR --> VkSurfaceCapabilitiesKHR
    VkSurfaceCapabilitiesKHR --> extent: Choose the min surface width height
    VkSurfaceFormatKHR[] --> surfaceFormat: Choose the right format 
    VkPresentModeKHR[] --> presentMode: Choose the present mode
    createSwapChain -->  VkImage[]: Resizes to max images from capabilities 
    createSwapChain --> VkFormat: Keep a reference to the swapChainImageFormat
    createSwapChain --> VkExtent2D: Keep a reference to the swapChainExtent 
    

    %% Create Image Views
    createImageViews --> VkImageViews[]: For every image is an imageview with properties

    %% Create Render Pass
    createRenderPass --> VkRenderPass

    %% Shaders to SPIRV
    GLSLC --> VertexShaders: Convert into SPIRV Binary
    GLSLC --> FragmentShaders: Convert into SPIRV Binary

    %% Create Graphics Pipeline
    createGraphicsPipeline --> VertexShaders
    createGraphicsPipeline --> FragmentShaders
    VertexShaders --> ShaderSources
    FragmentShaders --> ShaderSources

    %% States
    state Initialisation {    

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
            createImageViews
            createRenderPass
            createGraphicsPipeline
        }
    }

    GLSLC

    %% Devices 
    state Devices {
        state IntegratedGPU {
           QueueCount0 
        }

        state DedicatedGPU {
            QueueCount100
        }
    }

    %% Shaders
    state Shaders {
        VertexShaders
        FragmentShaders
    }

    state Vulkan {
        state VkInstance {
            state Extensions {
                GLFWExtensions
                ValidationLayerExtensions

                note left of GLFWExtensions
                    GLFW must supply a vulkan extension 
                    for window support. It will deal with a lot
                    of the presentation side of vulkan
                end note

            }
        }

        VkSurfaceKHR
        VkPhysicalDevice
        state VkDevice {
            state Queues {
                VkQueue1: graphicsQueue
                VkQueue2: presentQueue
            }
            
        }

        state SwapChainSupportDetails {
            VkSurfaceCapabilitiesKHR
            VkSurfaceFormatKHR[]
            VkPresentModeKHR[]
        }

        state VkSwapchainKHR {
            extent
            presentMode
            surfaceFormat
            queueFamilyCount
                note left of queueFamilyCount
                    Potentially the graphics and present family queues are the same
                    imageSharingMode = VK_SHARING_MODE_CONCURRENT | VK_SHARING_MODE_EXCLUSIVE
                end note

        }

        state ImageContainers {
            VkImage[]
            VkImageViews[]
        }
        VkExtent2D
        VkFormat

        state VkRenderPass {
            RenderPassColorAttachment
            subpasses
        }

        state VkPipeline {
            ShaderSources
            VkPipelineVertexInputStateCreateInfo
        }

    }

    state GLFW {
        GLFWwindow
        glfwGetRequiredInstanceExtensions
        glfwCreateWindowSurface

        
    }

%% End Diagram
```
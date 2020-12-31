# Vulkan Init 

<!-- vscode-markdown-toc -->
* [Initialization](#Initialization)
	* [Vulkan Objects Methods](#VulkanObjectsMethods)
	* [GLFW](#GLFW)
	* [mainloop](#mainloop)
* [Instance](#Instance)
	* [Vulkan Extensions](#VulkanExtensions)
	* [Common Pattern for Creating Vulkan Objects](#CommonPatternforCreatingVulkanObjects)
	* [VkResult from vulkan methods](#VkResultfromvulkanmethods)
	* [Cleaning up VK Objects](#CleaningupVKObjects)
* [Validation Layer](#ValidationLayer)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

From the official documentation

## <a name='Initialization'></a>Initialization
- [Doc: Base Code](https://vulkan-tutorial.com/Drawing_a_triangle/Setup/Base_code)

### <a name='VulkanObjectsMethods'></a>Vulkan Objects Methods
- vkCreateXXX
- vkAllocateXXX 
- vkDestroyXXX
- vkFreeXXX
- They all share one parameter `pAllocator` default use `nullptr`
    - This gets a custom callback for custom memory allocation

### <a name='GLFW'></a>GLFW
- Window stuff
- glfwInit()
- Disable OpenGL: `glfwWindowHint(GLFW_CLIENT_API, GLFW_NO_API);
- Creating window

```c++
// width, height, title, which window to start on 
window = glfwCreateWindow(800, 600, "Vulkan", nullptr, nullptr);
```

### <a name='mainloop'></a>mainloop

```c++
    void mainLoop() {
        while (!glfwWindowShouldClose(window)) {
            glfwPollEvents();
        }
    }
```

-----------------------------------------------------------

## <a name='Instance'></a>Instance
- [Doc: Instance](https://vulkan-tutorial.com/en/Drawing_a_triangle/Setup/Instance)
- VKInstance requires `#include <vulkan/vulkan.h>`

```c++
    void createInstance() {
        VkApplicationInfo appInfo{};
        appInfo.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;
        appInfo.pApplicationName = "Hello Triangle";
        appInfo.applicationVersion = VK_MAKE_VERSION(1, 0, 0);
        appInfo.pEngineName = "No Engine";
        appInfo.engineVersion = VK_MAKE_VERSION(1, 0, 0);
        appInfo.apiVersion = VK_API_VERSION_1_0;

        VkInstanceCreateInfo createInfo{};
        createInfo.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
        createInfo.pApplicationInfo = &appInfo;

        uint32_t glfwExtensionCount = 0;
        const char** glfwExtensions;
        glfwExtensions = glfwGetRequiredInstanceExtensions(&glfwExtensionCount);

        createInfo.enabledExtensionCount = glfwExtensionCount;
        createInfo.ppEnabledExtensionNames = glfwExtensions;

        createInfo.enabledLayerCount = 0;

        if (vkCreateInstance(&createInfo, nullptr, &instance) != VK_SUCCESS) {
            throw std::runtime_error("failed to create instance!");
        }
```

### <a name='VulkanExtensions'></a>Vulkan Extensions
- Vulkan needs to enable extensions for window drawing from glfw
- See this 

```c++
        uint32_t glfwExtensionCount = 0;
        const char** glfwExtensions;
        glfwExtensions = glfwGetRequiredInstanceExtensions(&glfwExtensionCount);
        createInfo.enabledExtensionCount = glfwExtensionCount;
        createInfo.ppEnabledExtensionNames = glfwExtensions;
```

### <a name='CommonPatternforCreatingVulkanObjects'></a>Common Pattern for Creating Vulkan Objects

- Pointer to struct with creation info
- Pointer to custom allocator callbacks, always nullptr in this tutorial
- Pointer to the variable that stores the handle to the new object
- e.g. `VkResult result = vkCreateInstance(&createInfo, nullptr, &instance);`

### <a name='VkResultfromvulkanmethods'></a>VkResult from vulkan methods
-  that is either VK_SUCCESS or an error code
- Can check this

```c++
if (vkCreateInstance(&createInfo, nullptr, &instance) != VK_SUCCESS) {
    throw std::runtime_error("failed to create instance!");
}
```

### <a name='CleaningupVKObjects'></a>Cleaning up VK Objects

```c++
void cleanup() {
    vkDestroyInstance(instance, nullptr);
```

-----------------------------------------------------------

## <a name='ValidationLayer'></a>Validation Layer
- [Doc: Validation Layer](https://vulkan-tutorial.com/en/Drawing_a_triangle/Setup/Validation_layers)
- Vulkan does `VERY LITTLE ERROR CHECKING` which can result in crashes or undefined behaviour 
- Validation Layers `hook into Vulkan function calls` to apply additional operations such as
    - Checking the values of parameters against the specification to detect misuse
    - Tracking creation and destruction of objects to find resource leaks
    - Checking thread safety by tracking the threads that calls originate from
    - Logging every call and its parameters to the standard output
    - Tracing Vulkan calls for profiling and replaying


### Types of Validation Layers
- two different types of validation layers in Vulkan: instance and device specific. 
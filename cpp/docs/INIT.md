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
	* [Types of Validation Layers](#TypesofValidationLayers)
	* [VK_LAYER_KHRONOS_validation](#VK_LAYER_KHRONOS_validation)
* [Physical Devices & Queue Families](#PhysicalDevicesQueueFamilies)
	* [GPU Device](#GPUDevice)
	* [Array of all devices](#Arrayofalldevices)
	* [Check what stuff device supports](#Checkwhatstuffdevicesupports)
* [Queue Families](#QueueFamilies)
	* [findQueueFamilies](#findQueueFamilies)
* [Logical Devices and Queues](#LogicalDevicesandQueues)

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


### <a name='TypesofValidationLayers'></a>Types of Validation Layers
- two different types of validation layers in Vulkan: instance and device specific. 

### <a name='VK_LAYER_KHRONOS_validation'></a>VK_LAYER_KHRONOS_validation
- All standard validations are bundled in this 

```c++
const std::vector<const char*> validationLayers = {
    "VK_LAYER_KHRONOS_validation"
};

#ifdef NDEBUG
    const bool enableValidationLayers = false;
#else
    const bool enableValidationLayers = true;
#endif
```

-----------------------------------------------------------

## <a name='PhysicalDevicesQueueFamilies'></a>Physical Devices & Queue Families
- [Docs: Physical Devices & Queue Families](https://vulkan-tutorial.com/en/Drawing_a_triangle/Setup/Physical_devices_and_queue_families)

### <a name='GPUDevice'></a>GPU Device
- The graphics card that we'll end up selecting will be stored in a VkPhysicalDevice handle
- `VkPhysicalDevice physicalDevice = VK_NULL_HANDLE;`
    - This object will be implicitly destroyed when the VkInstance is destroyed, 

### <a name='Arrayofalldevices'></a>Array of all devices

```C++
uint32_t deviceCount = 0;
std::vector<VkPhysicalDevice> devices(deviceCount);
vkEnumeratePhysicalDevices(instance, &deviceCount, devices.data());
```

### <a name='Checkwhatstuffdevicesupports'></a>Check what stuff device supports
- See vkGetPhysicalDeviceProperties.

```c++
VkPhysicalDeviceProperties deviceProperties;
vkGetPhysicalDeviceProperties(device, &deviceProperties);
```

## <a name='QueueFamilies'></a>Queue Families
- Different queue families have different functionalities
- e.g. a queue family that only allows processing of compute commands or one that only allows memory transfer related commands.

### <a name='findQueueFamilies'></a>findQueueFamilies
- Look for queue with supported Graphics commands
- Use std optional to say whether it exists or not 


-----------------------------------------------------------

## <a name='LogicalDevicesandQueues'></a>Logical Devices and Queues 
- [Logical Devices and Queues](https://vulkan-tutorial.com/en/Drawing_a_triangle/Setup/Logical_device_and_queues)
- After selecting a physical device to use we need to set up a logical device to interface with it
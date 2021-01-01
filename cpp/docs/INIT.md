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
* [Presenting: Surfaces](#Presenting:Surfaces)
	* [More queues](#Morequeues)
* [SwapChain](#SwapChain)
	* [Enabling](#Enabling)
	* [Compatibility with Window Surface](#CompatibilitywithWindowSurface)
	* [Swap Chain Settings](#SwapChainSettings)
		* [Surface Format](#SurfaceFormat)
		* [Presentation Mode](#PresentationMode)
		* [Swap Extent](#SwapExtent)
	* [Creating Swap Chain](#CreatingSwapChain)
* [Image Views](#ImageViews)
	* [VKImage](#VKImage)
	* [VKImageView](#VKImageView)
	* [Creating ImageView](#CreatingImageView)
	* [viewType](#viewType)
	* [format](#format)
	* [components & swizzling](#componentsswizzling)

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


-----------------------------------------------------------
## <a name='Presenting:Surfaces'></a>Presenting: Surfaces
- [Surfaces](https://vulkan-tutorial.com/Drawing_a_triangle/Presentation/Window_surface)
- VkSurfaceKHR surface;
- Comes with glfw as an extension in order to talk to vulkan

```c++

    void createSurface() {
        if (glfwCreateWindowSurface(instance, window, nullptr, &surface) != VK_SUCCESS) {
            throw std::runtime_error("failed to create window surface!");
        }
    }
```

### <a name='Morequeues'></a>More queues

- Present Family queue 

```c++
VkQueue graphicsQueue;
VkQueue presentQueue;

struct QueueFamilyIndices {
    std::optional<uint32_t> graphicsFamily;
    std::optional<uint32_t> presentFamily;

    bool isComplete() {
        return graphicsFamily.has_value() && presentFamily.has_value();
    }
};
```

- Present may not be applicable think server side gpu

```c++

            VkBool32 presentSupport = false;
            vkGetPhysicalDeviceSurfaceSupportKHR(device, i, surface, &presentSupport);

            if (presentSupport) {
                indices.presentFamily = i;
            }
```

- Create the new queue for the `logical device` (1to1 with physical gfx device)


-----------------------------------------------------------


## <a name='SwapChain'></a>SwapChain

### <a name='Enabling'></a>Enabling 
just like validation layer extensions swapchain is an extension to vulkan

```c++
const std::vector<const char*> validationLayers = {
    "VK_LAYER_KHRONOS_validation"
};

const std::vector<const char*> deviceExtensions = {
    VK_KHR_SWAPCHAIN_EXTENSION_NAME
};
```

- Enabling requires adding this to the Logical Device creation 
- In createLogicalDevice()

```c++

        createInfo.enabledExtensionCount = static_cast<uint32_t>(deviceExtensions.size());
        createInfo.ppEnabledExtensionNames = deviceExtensions.data();
```

### <a name='CompatibilitywithWindowSurface'></a>Compatibility with Window Surface
- Swap chain may not be compatible with the glfw window surface so we need to query the following:
    - Basic surface capabilities (min/max number of images in swap chain, min/max width and height of images)
    - Surface formats (pixel format, color space)
    - Available presentation modes
    

### <a name='SwapChainSettings'></a>Swap Chain Settings

- Surface format (color depth)
- Presentation mode (conditions for "swapping" images to the screen)
- Swap extent (resolution of images in swap chain)

#### <a name='SurfaceFormat'></a>Surface Format
- e.g. Surface can support color channels and types
- `VK_FROMAT_B8G8R8A_SRGB`a
- Can do a ranking of different formats to choose which one is best

#### <a name='PresentationMode'></a>Presentation Mode
- Presents the actual conditions for showing images to the screen
- Modes:
    - `VK_PRESENT_MODE_IMMEDIATE_KHR`: Images submitted right away to screen without tearing
    - `VK_PRESENT_MODE_FIFO_KHR`: FIFO queue similar to vertical sync
    - `VK_PRESENT_MODE_FIFO_RELAXED_KHR` 
    - `VK_PRESENT_MODE_MAILBOX_KHR`: triple bufferring

- `VK_PRESENT_MODE_FIFO_KHR` guaranteed to be there

#### <a name='SwapExtent'></a>Swap Extent 
- Resolution of swap chain images 
- Read up on it more [here](https://vulkan-tutorial.com/en/Drawing_a_triangle/Presentation/Swap_chain)

### <a name='CreatingSwapChain'></a>Creating Swap Chain

```c++

void createSwapChain() {
    SwapChainSupportDetails swapChainSupport = querySwapChainSupport(physicalDevice);

    VkSurfaceFormatKHR surfaceFormat = chooseSwapSurfaceFormat(swapChainSupport.formats);
    VkPresentModeKHR presentMode = chooseSwapPresentMode(swapChainSupport.presentModes);
    VkExtent2D extent = chooseSwapExtent(swapChainSupport.capabilities);
}
```

- set min amount of images + 1 (+1) as acquiring images setting this is better
- set max image count 
- create swapchaininfo struct 
- Set the surface format and colorspace properties

```c++
createInfo.imageFormat = surfaceFormat.format;
createInfo.imageColorSpace = surfaceFormat.colorSpace;
```

-----------------------------------------------------------

## <a name='ImageViews'></a>Image Views
- [Image Views](https://vulkan-tutorial.com/en/Drawing_a_triangle/Presentation/Image_views)

### <a name='VKImage'></a>VKImage
- Used in the swap chain 
- In order to use it we need to create a `VKImageView` object 

### <a name='VKImageView'></a>VKImageView
- View into an Image describes:
    - How to access the image
    - Which part of the image to access

```c++
std::vector<VkImageView> swapChainImageViews;

void createImageViews() {
    swapChainImageViews.resize(swapChainImages.size());
    ...
}

```

- Need to destroy when instance is destroyed

### <a name='CreatingImageView'></a>Creating ImageView

```c++
        for (size_t i = 0; i < swapChainImages.size(); i++) {
            VkImageViewCreateInfo createInfo{};
            createInfo.sType = VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO;
            createInfo.image = swapChainImages[i];
```

sType = VK_STRUCTURE_TYPE_IMAGE_VIEW_CREATE_INFO

Iterating through each swapChainimage... which is `std::vector<VkImage> swapChainImages;`

### <a name='viewType'></a>viewType

```
createInfo.viewType = VK_IMAGE_VIEW_TYPE_2D;
```

What's a view type?

```c
typedef enum VkImageViewType {
    VK_IMAGE_VIEW_TYPE_1D = 0,
    VK_IMAGE_VIEW_TYPE_2D = 1,
    VK_IMAGE_VIEW_TYPE_3D = 2,
    VK_IMAGE_VIEW_TYPE_CUBE = 3,
    VK_IMAGE_VIEW_TYPE_1D_ARRAY = 4,
    VK_IMAGE_VIEW_TYPE_2D_ARRAY = 5,
    VK_IMAGE_VIEW_TYPE_CUBE_ARRAY = 6,
    VK_IMAGE_VIEW_TYPE_MAX_ENUM = 0x7FFFFFFF
} VkImageViewType;
```

### <a name='format'></a>format

```
    VkFormat swapChainImageFormat;
```

Created in the swapchain 

```
        swapChainImageFormat = surfaceFormat.format;
        swapChainExtent = extent;
```

Grabbed from the surfaceFormat (glfw)

```
        VkSurfaceFormatKHR surfaceFormat = chooseSwapSurfaceFormat(swapChainSupport.formats);
```

here

```c++

    VkSurfaceFormatKHR chooseSwapSurfaceFormat(const std::vector<VkSurfaceFormatKHR>& availableFormats) {
        for (const auto& availableFormat : availableFormats) {
            if (availableFormat.format == VK_FORMAT_B8G8R8A8_SRGB && availableFormat.colorSpace == VK_COLOR_SPACE_SRGB_NONLINEAR_KHR) {
                return availableFormat;
            }
        }

        return availableFormats[0];
```

### <a name='componentsswizzling'></a>components & swizzling

```c++
createInfo.components.r = VK_COMPONENT_SWIZZLE_IDENTITY;
createInfo.components.g = VK_COMPONENT_SWIZZLE_IDENTITY;
createInfo.components.b = VK_COMPONENT_SWIZZLE_IDENTITY;
createInfo.components.a = VK_COMPONENT_SWIZZLE_IDENTITY;
```

- Allows for color swizziling 
- What's color swizziling? 

In computer graphics, swizzling is the ability to compose vectors by arbitrarily rearranging and combining components of other vectors.

For example, if `A = {1,2,3,4}`, where the components are x, y, z, and w respectively, you could compute `B = A.wwxy`, whereupon B would equal {4,4,1,2}. Additionally, combining two two-component vectors can create a four-component vector, or any combination of vectors and swizzling. This is common in GPGPU applications

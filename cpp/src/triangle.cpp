#include <myutils.h>
#include <vulkanapp.h>

int main() {
  VulkanApp app;
  whereami();
  try {
    app.run();
  } catch (const std::exception &e) {
    std::cerr << e.what() << std::endl;
    return EXIT_FAILURE;
  }

  return EXIT_SUCCESS;
  return 0;
}
use crate::window::WindowDesc;

pub struct VulkanApp {
    wd: WindowDesc,
}

impl VulkanApp {
    pub fn new(wd: WindowDesc) -> Self {
        VulkanApp { wd }
    }

    pub fn run(self) {
        self.wd.run_event_loop();
    }
}

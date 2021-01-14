use crate::window::WindowDesc;
use winit::event::{Event, VirtualKeyCode, ElementState, KeyboardInput, WindowEvent};
use winit::event_loop::{EventLoop, ControlFlow};

pub struct VulkanApp {
    wd: WindowDesc
}

impl VulkanApp {


    pub fn new(wd: WindowDesc) -> Self {
        VulkanApp {
            wd
        }
    }

    pub fn run(self) {
        self.wd.run_event_loop();
    }
}


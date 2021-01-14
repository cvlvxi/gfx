use winit::event_loop::{EventLoop};
mod vkapp;

fn main() {

    let event_loop = EventLoop::new();
    let _window = vkapp::VulkanApp::init_window(&event_loop);

    vkapp::VulkanApp::main_loop(event_loop);
}


mod vkapp;
mod window;

fn main() {
    let mut app = vkapp::VulkanApp::new(window::WindowDesc::default());
    app.run();
}


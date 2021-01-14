use winit::event::{ElementState, Event, KeyboardInput, VirtualKeyCode, WindowEvent};
use winit::event_loop::{ControlFlow, EventLoop};

// Constants
const WINDOW_TITLE: &'static str = "FIXME TITLE";
const WINDOW_WIDTH: u32 = 800;
const WINDOW_HEIGHT: u32 = 600;

pub struct WindowDesc {
    pub title: &'static str,
    pub width: u32,
    pub height: u32,
    pub eventloop: Option<EventLoop<()>>,
    pub window: Option<winit::window::Window>,
}

impl Default for WindowDesc {
    fn default() -> Self {
        // Create Event loop
        let eventloop = EventLoop::new();
        // Create Window
        let window = winit::window::WindowBuilder::new()
            .with_title(WINDOW_TITLE)
            .with_inner_size(winit::dpi::LogicalSize::new(WINDOW_WIDTH, WINDOW_HEIGHT))
            .build(&eventloop)
            .expect("Failed to create window.");

        WindowDesc {
            title: WINDOW_TITLE,
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
            eventloop: Some(eventloop),
            window: Some(window),
        }
    }
}

impl WindowDesc {
    pub fn run_event_loop(self) {
        self.eventloop
            .unwrap()
            .run(move |event, _, control_flow| match event {
                Event::WindowEvent { event, .. } => match event {
                    WindowEvent::CloseRequested => *control_flow = ControlFlow::Exit,
                    WindowEvent::KeyboardInput { input, .. } => match input {
                        KeyboardInput {
                            virtual_keycode,
                            state,
                            ..
                        } => match (virtual_keycode, state) {
                            (Some(VirtualKeyCode::Escape), ElementState::Pressed) => {
                                dbg!();
                                *control_flow = ControlFlow::Exit
                            }
                            _ => {}
                        },
                    },
                    _ => {}
                },
                _ => (),
            })
    }
}

use vulkano::instance::Instance;
use vulkano::instance::InstanceExtensions;
use vulkano::instance::PhysicalDevice;
use vulkano::device::Device;
use vulkano::device::DeviceExtensions;
use vulkano::device::Features;
use vulkano::buffer::BufferUsage;
use vulkano::buffer::CpuAccessibleBuffer;

use vulkano::device::Queue;
use std::sync::{Arc};

struct RusticVK {
    device: Arc<Device>,
    queue: Arc<Queue>
}

impl RusticVK {
    fn init() -> Self {
        let instance = Instance::new(None, &InstanceExtensions::none(), None)
        .expect("failed to create instance");
        // If you have a gpu you might want to choose not the first thing
        let physical = PhysicalDevice::enumerate(&instance).next().expect("no device available");

        // Queues are equivalent of threads to cpu and queues exist in queue families
        for family in physical.queue_families() {
            println!("Found a queue family with {:?} queue(s)", family.queues_count());
        }
        let queue_family = physical.queue_families()
        .find(|&q| q.supports_graphics())
        .expect("couldn't find a graphical queue family");

        let (device, mut queues) = {
            Device::new(physical, &Features::none(), &DeviceExtensions::none(),
                        [(queue_family, 0.5)].iter().cloned()).expect("failed to create device")
        };
        let queue = queues.next().unwrap();
        RusticVK {
            device,
            queue
        }
    }
}



fn main() {
    let rvk: RusticVK = RusticVK::init();
    println!("Done")
}

use vulkano::buffer::BufferUsage;
use vulkano::buffer::CpuAccessibleBuffer;
use vulkano::command_buffer::AutoCommandBufferBuilder;
use vulkano::command_buffer::CommandBuffer;
use vulkano::device::Device;
use vulkano::device::DeviceExtensions;
use vulkano::device::Features;
use vulkano::instance::Instance;
use vulkano::instance::InstanceExtensions;
use vulkano::instance::PhysicalDevice;
use vulkano::sync::GpuFuture;

use std::sync::Arc;
use vulkano::device::Queue;

pub struct RusticVK {
    device: Arc<Device>,
    queue: Arc<Queue>,
}

impl RusticVK {
    pub fn init() -> Self {
        let instance = Instance::new(None, &InstanceExtensions::none(), None)
            .expect("failed to create instance");
        // If you have a gpu you might want to choose not the first thing
        let physical = PhysicalDevice::enumerate(&instance)
            .next()
            .expect("no device available");

        // Queues are equivalent of threads to cpu and queues exist in queue families
        for family in physical.queue_families() {
            println!(
                "Found a queue family with {:?} queue(s)",
                family.queues_count()
            );
        }
        let queue_family = physical
            .queue_families()
            .find(|&q| q.supports_graphics())
            .expect("couldn't find a graphical queue family");

        let (device, mut queues) = {
            Device::new(
                physical,
                &Features::none(),
                &DeviceExtensions::none(),
                [(queue_family, 0.5)].iter().cloned(),
            )
            .expect("failed to create device")
        };
        let queue = queues.next().unwrap();
        RusticVK {
            device: device.clone(),
            queue: queue.clone(),
        }
    }

    pub fn createBuffers(&self) {
        let source_content = 0..64;
        let source = CpuAccessibleBuffer::from_iter(
            self.device.clone(),
            BufferUsage::all(),
            false,
            source_content,
        )
        .expect("failed to create buffer");

        let dest_content = (0..64).map(|_| 0);
        let dest = CpuAccessibleBuffer::from_iter(
            self.device.clone(),
            BufferUsage::all(),
            false,
            dest_content,
        )
        .expect("failed to create buffer");
        let mut builder =
            AutoCommandBufferBuilder::new(self.device.clone(), self.queue.family()).unwrap();
        builder.copy_buffer(source.clone(), dest.clone()).unwrap();
        let command_buffer = builder.build().unwrap();
        let finished = command_buffer.execute(self.queue.clone()).unwrap();
        // Data is currently being written to the GPU
        finished.then_signal_fence_and_flush().unwrap()
        .wait(None).unwrap();
        let src_content = source.read().unwrap();
        let dest_content = dest.read().unwrap();


        println!("{:?}", &*src_content);
        println!("{:?}", &*dest_content);
    }
}

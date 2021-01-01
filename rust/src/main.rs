mod rusticvk;
use crate::rusticvk::RusticVK;

fn main() {
    let rvk: RusticVK = RusticVK::init();
    rvk.createBuffers();
    println!("Done")
}

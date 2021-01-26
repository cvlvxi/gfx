import Cocoa
import MetalKit

class MetalView: MTKView {
    required init(coder: NSCoder) {
        super.init(coder: coder)
        guard let defaultDevice = MTLCreateSystemDefaultDevice() else {
            fatalError("Device loading error")
        }
        device = defaultDevice
        colorPixelFormat = .bgra8Unorm
        // Clear color
        clearColor = MTLClearColor(red: 0.0, green: 0.0, blue: 1, alpha: 1)
    }

}

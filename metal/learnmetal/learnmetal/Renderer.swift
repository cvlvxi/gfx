import MetalKit



class Renderer: NSObject {

    static var device: MTLDevice!
    static var commandQueue: MTLCommandQueue!
    var mesh: MTKMesh!
    var vertexBuffer: MTLBuffer!
    var pipelineState: MTLRenderPipelineState!
    var timer: Float = 0
    var vertices: [Vertex] = createTree()

    init(metalView: MTKView) {
        super.init()
        guard let device = MTLCreateSystemDefaultDevice() else {
            fatalError("GPU not available")
        }
        metalView.device = device
        Renderer.device = device
        Renderer.commandQueue = device.makeCommandQueue()!

        self.createVerticesBuffers(vertices: vertices)
        self.createPipelineState(metalView)
       
        metalView.clearColor = MTLClearColor(red: 0.0, green: 0.0, blue: 0.0, alpha: 1)
        metalView.delegate = self
    }
    

    func createVerticesBuffers(vertices: [Vertex]) {
        self.vertexBuffer = Renderer.device.makeBuffer(bytes: vertices, length: Vertex.stride(vertices.count),  options: [])
    }
    
    func createPipelineState(_ metalView: MTKView) {
        let library = Renderer.device.makeDefaultLibrary()
        let vertexFunction = library?.makeFunction(name: "vertex_main")
        let fragmentFunction = library?.makeFunction(name: "fragment_main")

        let pipelineDescriptor = MTLRenderPipelineDescriptor()
        pipelineDescriptor.vertexFunction = vertexFunction
        pipelineDescriptor.fragmentFunction = fragmentFunction
        pipelineDescriptor.colorAttachments[0].pixelFormat = metalView.colorPixelFormat
        
        let vertexDescriptor = MTLVertexDescriptor()
        // Position
        vertexDescriptor.attributes[0].format = .float3
        vertexDescriptor.attributes[0].bufferIndex = 0
        vertexDescriptor.attributes[0].offset = 0
        
        // Color
        vertexDescriptor.attributes[1].format = .float4
        vertexDescriptor.attributes[1].bufferIndex = 0
        vertexDescriptor.attributes[1].offset = SIMD3<Float>.size()
        vertexDescriptor.layouts[0].stride = MemoryLayout<Vertex>.stride
        
        pipelineDescriptor.vertexDescriptor = vertexDescriptor
        
        // After doing setup stuff let's make render pipeline state
        do {
            pipelineState = try Renderer.device.makeRenderPipelineState(descriptor: pipelineDescriptor)
        } catch let error {
            fatalError(error.localizedDescription)
        }

    }
}

extension Renderer: MTKViewDelegate {
    func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {
    }

    func draw(in view: MTKView) {
        // Spaz
        vertices = createTree()
        self.vertexBuffer = Renderer.device.makeBuffer(bytes: vertices, length: Vertex.stride(vertices.count),  options: [])
        guard let descriptor = view.currentRenderPassDescriptor,
              let commandBuffer = Renderer.commandQueue.makeCommandBuffer(),
              let renderEncoder =
              commandBuffer.makeRenderCommandEncoder(descriptor: descriptor) else {
            return
        }

        timer += 0.05
        var currentTime: Float = sin(timer)
        renderEncoder.setVertexBytes(&currentTime, length: MemoryLayout<Float>.stride, index: 1)

        renderEncoder.setRenderPipelineState(pipelineState)
        renderEncoder.setVertexBuffer(self.vertexBuffer, offset: 0, index: 0)

        renderEncoder.drawPrimitives(type: .triangle, vertexStart: 0, vertexCount: vertices.count)

        renderEncoder.endEncoding()
        
        guard let drawable = view.currentDrawable else {
            return
        }
        commandBuffer.present(drawable)
        commandBuffer.commit()
    }
}

import MetalKit

class ViewController: NSViewController {

    var renderer: Renderer?

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        guard let metalView = view as? MTKView else {
            fatalError("Metal view not setup")
        }
        renderer = Renderer(metalView: metalView)
    }

    override var representedObject: Any? {
      didSet {
        // Update the view, if already loaded.
      }
    }
}

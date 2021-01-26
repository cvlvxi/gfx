
let DEFAULT_WIDTH: Float = 0.01
var DEFAULT_COLOR: SIMD4<Float> = SIMD4<Float>(1,0,0,1)

class Node {

    var width: Float = -1.0
    var leftChild: Node?
    var rightChild: Node?


    init(_ leftChild: Node?, _ rightChild: Node?) {
        self.leftChild = leftChild
        self.rightChild = rightChild

    }
};

func hoffNodeToNode(hnode: HoffNode?) -> Node? {
    guard let hnode = hnode else {
        return nil
    }
    let newNode = Node(
        hoffNodeToNode(hnode: hnode.leftChild),
        hoffNodeToNode(hnode: hnode.rightChild)
    )
    return newNode
}


func generateNode() -> Node? {
    if Int.random(in: 0...100) >= 50 {
       return nil
    } else {
        return Node(generateNode(), generateNode())
    }
}

/* Current Tree
 *              /\
 *             /\ .
 *            .  .
 */

 func createHoffmanTree() -> HoffNode {
     var someString: String = """
                                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse congue
                                     faucibus arcu. Nulla at facilisis dolor, a efficitur nibh. Donec ac sem
                                     faucibus, rhoncus risus vitae, suscipit velit. Aenean tempus id neque eget
                                     imperdiet. Sed sed mauris id arcu suscipit eleifend ac dictum est. Donec ac arcu
                                     ultricies, cursus lacus a, tempus nibh. Vestibulum sit amet volutpat dui, eget
                                     posuere dui. Integer facilisis eu lectus consectetur rutrum. Donec dapibus augue
                                     rutrum malesuada mollis. Nulla sit amet pretium nisl. Vestibulum placerat vitae
                                     sapien posuere commodo. Donec tristique ultrices vehicula.

                              """
     let h = Hoffman(someString: someString)
     h.makeTrees()
     return h.head!
 }

func createTreeNodes() -> Node {
    let head = Node(generateNode(), generateNode())
    return head
}

func createTreeNodes2() -> Node {
    let head = Node(generateNode(), nil)
    head.rightChild = createSymmetricTree(node: head.leftChild)
    return head
}

func createSymmetricTree(node: Node?) -> Node? {
    guard let node = node else {
        return nil
    }
    return Node(createSymmetricTree(node: node.rightChild), createSymmetricTree(node: node.leftChild))
}



func computeTreeWidths(node: Node?) -> Float {
    guard let node = node else {
        return DEFAULT_WIDTH
    }
    node.width = computeTreeWidths(node: node.leftChild) + computeTreeWidths(node: node.rightChild)
    return node.width
}

func createTreeVertices(_ headNode: Node, x: Float, y: Float, h: Float) -> [Vertex] {
    var vertices: [Vertex] = []
    func buildTree(node: Node?, x: Float, y: Float, h: Float) {
        guard let node = node else {
            return
        }
        var rightWidth: Float? = nil
        var leftWidth: Float? = nil
        if (node.leftChild == nil) {
            leftWidth = DEFAULT_WIDTH
        } else {
            if node.leftChild!.rightChild == nil {
                leftWidth = DEFAULT_WIDTH
            } else {
                leftWidth = node.leftChild!.rightChild!.width
            }
        }
        if (node.rightChild == nil) {
            rightWidth = DEFAULT_WIDTH
        } else {
            if node.rightChild!.leftChild == nil {
                rightWidth = DEFAULT_WIDTH
            } else {
                rightWidth = node.rightChild!.leftChild!.width
            }
        }

        let xl = x - leftWidth!
        let y2 = y - h
        let xr = x + rightWidth!

        vertices.append(Vertex(position: SIMD3<Float>(x, y, 0), color: DEFAULT_COLOR))
        vertices.append(Vertex(position: SIMD3<Float>(xl, y2, 0), color: DEFAULT_COLOR))
        vertices.append(Vertex(position: SIMD3<Float>(xr, y2, 0), color: DEFAULT_COLOR))

        DEFAULT_COLOR = SIMD4<Float>(Float.random(in: 0.0 ... 1.0), Float.random(in: 0.0 ... 1.0), Float.random(in: 0.0 ... 1.0), 1)

        // Recursive
        if (node.leftChild != nil) {
            buildTree(node: node.leftChild!, x: xl, y: y2, h: h)
        }
        if (node.rightChild != nil) {
            buildTree(node: node.rightChild!, x: xr, y: y2, h: h)
        }
    }

    buildTree(node: headNode, x: x, y: y, h: h)
    return vertices
}

//func createTree() -> [Vertex] {
//    var treeHead = createTreeNodes2()
//    computeTreeWidths(node: treeHead)
//    var vertices = createTreeVertices(treeHead, x: 0, y: 1, h: 0.2)
//    return vertices
//}

func createTree() -> [Vertex] {
    let hhead = createHoffmanTree()
    var treeHead = hoffNodeToNode(hnode: hhead)
    computeTreeWidths(node: treeHead)
    var vertices = createTreeVertices(treeHead!, x: 0, y: 1, h: 0.2)
    return vertices

}


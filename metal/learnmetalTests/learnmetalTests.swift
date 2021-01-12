import XCTest
@testable import learnmetal

class learnmetalTests: XCTestCase {

    func testExample() throws {
        // This is an example of a functional test case.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
        XCTAssertEqual(true, true)
    }

//    func testPerformanceExample() throws {
//        // This is an example of a performance test case.
//        self.measure {
//            // Put the code you want to measure the time of here.
//        }
//    }

}

class deflateTests: XCTestCase {
    var someString: String = """
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse congue
            faucibus arcu. Nulla at facilisis dolor, a efficitur nibh. Donec ac sem
            faucibus, rhoncus risus vitae, suscipit velit. Aenean tempus id neque eget
            imperdiet. Sed sed mauris id arcu suscipit eleifend ac dictum est. Donec ac arcu
            ultricies, cursus lacus a, tempus nibh. Vestibulum sit amet volutpat dui, eget
            posuere dui. Integer facilisis eu lectus consectetur rutrum. Donec dapibus augue
            rutrum malesuada mollis. Nulla sit amet pretium nisl. Vestibulum placerat vitae
            sapien posuere commodo. Donec tristique ultrices vehicula.

            Aliquam maximus suscipit odio, sed scelerisque neque suscipit vel. Nam faucibus
            semper augue, at porttitor lorem posuere nec. Suspendisse a ipsum eu lacus
            pharetra sagittis sed eget velit. Quisque viverra facilisis lectus, et placerat
            risus ornare a. Etiam eget nisi ac urna luctus interdum ut vel nisl. Donec
            vestibulum metus neque, vel tempor tellus consequat id. Donec volutpat dui sed
            urna accumsan maximus. Proin ornare tempor diam et luctus. Quisque iaculis justo
            vitae erat ullamcorper efficitur. Morbi ultrices, dui et venenatis lobortis,
            nulla diam ultricies lorem, eget facilisis urna augue ut dolor. Suspendisse
            elementum gravida elit non tincidunt. Fusce molestie ante in vulputate eleifend.
            Aenean lacus mauris, imperdiet ac dui eu, malesuada condimentum arcu. Quisque
            augue nisl, laoreet ut ligula vitae, faucibus tempus nibh.
     """

    func testHoffmanPriorityQueue() throws {
        let h = Hoffman(someString: someString)
        // Check priority queue first element is highest
        XCTAssertTrue(h.priorityQueue[0] is HoffNode)
        XCTAssertTrue(h.priorityQueue[0].value == 326)
        XCTAssertTrue(h.priorityQueue.last!.value == 1)
    }

    func testInsertPriorityQueue() throws {
        let h = Hoffman(someString: someString)
        let newNode = HoffNode(chars: "a+b", value: 20, leftChild: nil, rightChild: nil)
        h.insertIntoPriorityQueue(node: newNode)
        XCTAssertTrue(h.priorityQueue[16].chars == newNode.chars)
    }

    func testMakeTrees() throws {
        let h = Hoffman(someString: someString)
        h.makeTrees()
        h.printTree(node: h.head!, currLevel: 0)
    }


}

import Foundation

class HoffNode {
    var width: Float = -1.0
    var chars: String
    var value: Int = -1
    var leftChild: HoffNode?
    var rightChild: HoffNode?

    init(chars: String, value: Int, leftChild: HoffNode?, rightChild: HoffNode?) {
        self.chars = chars
        self.value = value
        self.leftChild = leftChild
        self.rightChild = rightChild
    }
}

class Hoffman {
    var priorityQueue: [HoffNode] = []
    var head: HoffNode?

    init(someString: String) {
        var freqMap: [Character: Int] = [:]
        for c in someString {
            freqMap[c, default: 0] += 1
        }
        // Sort the freqMap
        var sortedFreqs: [(Int, Character)] = []
        for (c, count) in freqMap {
            sortedFreqs.append((count, c))
        }
        sortedFreqs.sort { tuple, tuple2 in  tuple.0 > tuple2.0 }
        priorityQueue = sortedFreqs.map { i, c -> HoffNode in HoffNode(chars: String(c), value: i, leftChild: nil, rightChild: nil) }
    }

    func insertIntoPriorityQueue(node: HoffNode) {
        if priorityQueue.count == 0 {
            priorityQueue.append(node)
            return
        }
        for (idx, pNode) in priorityQueue.enumerated() {
            if pNode.value < node.value {
                priorityQueue.insert(node, at: idx)
                return
            }
        }
    }

    func joinNodes(node1: HoffNode, node2: HoffNode) -> HoffNode {
        HoffNode(
                chars: [node1.chars, node2.chars].joined(separator: "+"),
                value: node1.value + node2.value,
                leftChild: node1,
                rightChild: node2)
    }

    func makeTrees() {
        guard priorityQueue.count > 1 else {
            fatalError("Cannot make trees")
        }

        while priorityQueue.count > 1 {
            let node1 = priorityQueue.popLast()
            let node2 = priorityQueue.popLast()
            let newNode = joinNodes(node1: node1!, node2: node2!)
            // insert newNode back into the priority queue
            insertIntoPriorityQueue(node: newNode)
        }
        head = priorityQueue[0]
    }

    func printTree(node: HoffNode?, currLevel: Int) {
        guard let node = node else {
            return
        }
        let indent = String(repeating: "\t", count: currLevel)
        print("\(indent)Value: \(node.value), chars: \(node.chars)")
        let newLevel = currLevel + 1
        printTree(node: node.leftChild, currLevel: newLevel)
        printTree(node: node.rightChild, currLevel: newLevel)
    }

    func makeBalancedTrees() {
        // FIXME TODO
        func joinTrees(queue: [HoffNode]) -> [HoffNode] {
            var original: [HoffNode] = queue
            var newQueue : [HoffNode] = []
            guard queue.count > 1 else {
                fatalError("Error")
            }
            var currNode: HoffNode! = original.popLast()
            while queue.count > 1  {
                // We have a node so we can make a new combined HoffNode
                let poppedNode: HoffNode! = original.popLast()
                // Let's check if the newNode has a greater value than the popped node
                if currNode.value > poppedNode.value {
                    newQueue.insert(currNode, at: 0)
                    currNode = poppedNode
                    continue
                }
                var newNode = joinNodes(node1: poppedNode, node2: currNode)
                currNode = newNode
            }
            return newQueue
        }

        // Priority Queue contains the largest value which we add at the end
        var currQueue : [HoffNode] = priorityQueue
        repeat {
            let newQueue = joinTrees(queue: currQueue)
            currQueue = newQueue
        } while currQueue.count > 1


    }
}


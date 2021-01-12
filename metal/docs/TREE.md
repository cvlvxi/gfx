# Tree Prototype

```
Tree Diagrams of non overlapping trees 


Node {
	width
	leftchild Node
	rightchild Node
}


Node {
	width: ? 
	Node {
		width: ?
		leftchild none
		rightchild none

	}

	Node {
		width: ?
		leftchild none
		rightchild none

	}
}


DEFAULTWIDTH = 10


computeTreeWidths(node) -> width {

	if (node == none) {
		return DEFAULTWIDTH
	}
	
	node.width = computeWidthTrees(leftchild) + computewidthtrees(rightchild)
	return node.width 
	
}


// Build the Vertex buffer headnode at X, y, h = height of triangles



buildTree(headNode, x, y, h) {
	// find the left width for the right node
	rightWidth = None
	leftWidth = None
	if (headNode.leftchild == none) {
		rightWidth = DEFAULTWIDTH
	} else {
		if headNode.leftchild.rightchild == None {
			rightwidth = DEFAULTWIDTH
		} else {
			rightWidth = headNode.leftchild.rightchild.widtgh
		}
	}
	if (headNode.rightchild == None) {
		leftWidth = DEFAULTWIDTH
	} else {
		if headNode.rightchild.leftchild == None {
			leftWidth =DEFAULT WIDTH

		} else {
			leftWidth = headNOde.rigtchild.leftchild.wdith
		}

	}
	// Add to the vertices buffer 
	vertices.push(float3(x, y, 0)) // top
	
	xl = x-leftWidth
	y2 = y-h
	xr = x+rightWidth

	vertices.push(float3(xl, y2, 0))
	vertices.push(float3(xr, y2, 0))

	// Recurse on nodes
	if (headNode.leftChild != None ) {
		buildTree(headNode.leftChild, xl, y2, h) 
	} 
	if (headNode.rightChild != None) {
		buildTree(headNOde.rightChild, xr, y2, h)
	}

}
```

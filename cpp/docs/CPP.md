# C++ Stuff 

<!-- vscode-markdown-toc -->
* [Vector](#Vector)
	* [Vector Resize](#VectorResize)
* [size_t](#size_t)
	* [size_t for index iteration for loops](#size_tforindexiterationforloops)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

-----------------------------------------------------------

## <a name='Vector'></a>Vector
### <a name='VectorResize'></a>Vector Resize
- Resize a vector
- [Docs: Vector Resize](http://www.cplusplus.com/reference/vector/vector/resize/)

```c++
        swapChainImageViews.resize(swapChainImages.size());
```

-----------------------------------------------------------

## <a name='size_t'></a>size_t
### <a name='size_tforindexiterationforloops'></a>size_t for index iteration for loops

```c++
        for (size_t i = 0; i < swapChainImages.size(); i++) {
            VkImageViewCreateInfo createInfo{};
```


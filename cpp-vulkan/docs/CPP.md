# C++ Stuff 

<!-- vscode-markdown-toc -->
* [Vector](#Vector)
	* [Vector Resize](#VectorResize)
* [size_t](#size_t)
	* [size_t for index iteration for loops](#size_tforindexiterationforloops)
* [File IO](#FileIO)
	* [Seeking to end of file std::ios::ate](#Seekingtoendoffilestd::ios::ate)
	* [Getting the filesize with tellg](#Gettingthefilesizewithtellg)

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

-----------------------------------------------------------

## <a name='FileIO'></a>File IO
- iostream and fstream

### <a name='Seekingtoendoffilestd::ios::ate'></a>Seeking to end of file std::ios::ate
- Specify this to go straight to the end (usually for getting size of file)

```
std::ifstream file(filename, std::ios::ate | std::ios::binary);
```

### <a name='Gettingthefilesizewithtellg'></a>Getting the filesize with tellg

```c++
size_t fileSize = (size_t) file.tellg();
```


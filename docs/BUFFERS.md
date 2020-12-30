# Vulkan Buffers 

<!-- vscode-markdown-toc -->

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## Types of Buffers

- if you want to continuously upload data you should use a CpuBufferPool
- while on the other hand if you have some data that you are never going to modify you should use an ImmutableBuffer.
- simple kind of buffer that exists is the CpuAccessibleBuffer, 
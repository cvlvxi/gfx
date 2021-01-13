export interface AttributeDescription {
  location?: GLuint;
  size: number;
  type: GLenum;
  normalize: boolean;
  stride: number;
  offset: number;
}

export type AttributeIdxMap = Map<string, AttributeDescription>;
export type UniformMap = Map<string, UniformDescription>;

export interface UniformDescription {
  location?: WebGLUniformLocation;
  transpose?: boolean;
  type: UniformType;
}

enum UniformType {
  uniform1f = "uniform1f",
  uniform1fv = "uniform1fv",
  uniform1i = "uniform1i",
  uniform1iv = "uniform1iv",

  uniform2f = "uniform2f",
  uniform2fv = "uniform2fv",
  uniform2i = "uniform2i",
  uniform2iv = "uniform2iv",

  uniform3f = "uniform3f",
  uniform3fv = "uniform3fv",
  uniform3i = "uniform3i",
  uniform3iv = "uniform3iv",

  uniform4f = "uniform4f",
  uniform4fv = "uniform4fv",
  uniform4i = "uniform4i",
  uniform4iv = "uniform4iv",

  uniformMatrix2fv = "uniformMatrix2fv",
  uniformMatrix3fv = "uniformMatrix3fv",
  uniformMatrix4fv = "uniformMatrix4fv",
}

export interface ShaderBundle {
  shader?: WebGLShader;
  source: string;
  attributeMap?: AttributeIdxMap;
  uniformMap?: UniformMap;
}

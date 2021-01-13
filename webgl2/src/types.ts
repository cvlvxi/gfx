export interface AttributeDescription {
  location?: GLuint;
  size: number;
  type: GLenum;
  normalize: boolean;
  stride: number;
  offset: number;
}

export type AttributeIdxMap = Map<string, AttributeDescription>;
export type UniformMap = Map<string, WebGLUniformLocation | null>;
export interface ShaderBundle {
  shader?: WebGLShader;
  source: string;
  attributeMap?: AttributeIdxMap;
  uniformMap?: UniformMap;
}

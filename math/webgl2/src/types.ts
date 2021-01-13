export type AttributeIdxMap = Map<string, GLuint | null>;
export type UniformMap = Map<string, WebGLUniformLocation | null>;
export interface ShaderBundle {
  shader?: WebGLShader;
  source: string;
  attributeMap?: AttributeIdxMap;
  uniformMap?: UniformMap;
}

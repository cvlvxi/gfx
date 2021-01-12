import { AnimationLoop, Timeline } from "@luma.gl/engine";
import { InstancedCube } from "./mesh.js";
import { readPixelsToArray } from "@luma.gl/webgl";
import { cssToDevicePixels, setParameters } from "@luma.gl/gltools";
import { Matrix4, radians } from "math.gl";
import { SIDE } from "./globals.js";

export default class AppAnimationLoop extends AnimationLoop {
  constructor() {
    super({ createFramebuffer: true, debug: false });
  }

  onInitialize({ gl }) {
    setParameters(gl, {
      clearColor: [0, 0, 0, 1],
      clearDepth: 1,
      depthTest: true,
      depthFunc: gl.LEQUAL,
    });

    this.attachTimeline(new Timeline());
    this.timeline.play();

    const timelineChannels = {
      timeChannel: this.timeline.addChannel({
        rate: 0.01,
      }),

      eyeXChannel: this.timeline.addChannel({
        rate: 0.0003,
      }),

      eyeYChannel: this.timeline.addChannel({
        rate: 0.0004,
      }),

      eyeZChannel: this.timeline.addChannel({
        rate: 0.0002,
      }),
    };

    this.cube = new InstancedCube(gl);

    return { timelineChannels };
  }

  onRender(animationProps) {
    const { gl, aspect, tick, timelineChannels } = animationProps;
    const { framebuffer, _mousePosition } = animationProps;
    const { timeChannel, eyeXChannel, eyeYChannel, eyeZChannel } =
      timelineChannels;

    // Draw the cubes
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.cube.setUniforms({
      uTime: this.timeline.getTime(timeChannel),
      // Basic projection matrix
      uProjection: new Matrix4().perspective(
        { fov: radians(60), aspect, near: 1, far: 2048.0 },
      ),
      // Move the eye around the plane
      uView: new Matrix4().lookAt({
        center: [0, 0, 0],
        eye: [
          (Math.cos(this.timeline.getTime(eyeXChannel)) * SIDE) / 2,
          (Math.sin(this.timeline.getTime(eyeYChannel)) * SIDE) / 2,
          ((Math.sin(this.timeline.getTime(eyeZChannel)) + 1) * SIDE) / 4 + 32,
        ],
      }),
      // Rotate all the individual cubes
      uModel: new Matrix4().rotateX(tick * 0.01).rotateY(tick * 0.013),
    });
    this.cube.draw();
  }

  onFinalize() {
    this.cube.delete();
  }
}

# Shader 与 WebGL 模式

## Technique Routing

| Goal | Start With | Watch |
| --- | --- | --- |
| Mathematical 3D forms | SDF + ray marching | Step count, normal quality, soft shadow cost |
| Organic motion | Noise + domain warp | Overdraw, repeated noise calls |
| Particles | Instancing or shader particles | Mobile particle cap, blending cost |
| Bloom/glitch/color grade | Post-processing pass | Extra framebuffer memory |
| Persistent simulation | Ping-pong framebuffer | Texture format support |
| White screen debugging | Compile/link logs | Function order, uniforms optimized out |

## WebGL2 Adaptation Checklist

- Fragment shader starts with `#version 300 es`.
- Add `precision highp float;` and `out vec4 fragColor;`.
- Use `in`/`out` instead of legacy `varying`.
- Use `texture()` instead of `texture2D()`.
- Wrap ShaderToy-style `mainImage` with a standard `main`.
- Use `gl_FragCoord.xy` for fragment coordinates.
- Declare helper functions before they are called.
- Precompute constants instead of putting function calls inside macros.

## Runtime Skeleton

```ts
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("WebGL2 is unavailable");

function compile(type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Cannot create shader");
  gl.shaderSource(shader, source.trim());
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compile failed");
  }

  return shader;
}
```

## Performance Budget

- Ray marching steps: start at 64, raise only when artifacts prove it is needed.
- Volume samples: start at 16-24 per ray on desktop, lower on mobile.
- FBM octaves: start at 4; avoid nested FBM inside ray loops.
- DPR: cap at 2 on desktop and 1.5 on mobile-heavy scenes.
- Texture size: use compressed or resized assets; do not assume 4K textures are safe.

## Debug Views

- Normals: output normalized normal mapped to 0-1.
- Step count: output steps divided by max steps.
- Distance/depth: output hit distance as grayscale.
- UV: output `vec3(uv, 0.0)` after mapping.
- Material id: map ids to a small fixed palette.

## Visual Verification

- Canvas is nonblank at desktop and mobile sizes.
- Resize updates drawing buffer, viewport, camera aspect, and uniforms.
- Reduced-power mode still responds or has a static fallback.
- Console has no shader compile/link errors.
- Animation stops on unmount or when the scene is hidden.

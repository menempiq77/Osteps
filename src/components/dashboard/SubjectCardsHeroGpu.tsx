"use client";

import { useEffect, useMemo, useRef } from "react";

type SubjectCardsHeroGpuProps = {
  colors: string[];
};

const FALLBACK_COLORS = ["#38C16C", "#0ea5e9", "#8b5cf6", "#f97316"];

const hexToVec4 = (value: string): [number, number, number, number] => {
  const normalized = value.replace("#", "").trim();
  const expanded = normalized.length === 3
    ? normalized.split("").map((part) => `${part}${part}`).join("")
    : normalized.padEnd(6, "0");

  const red = parseInt(expanded.slice(0, 2), 16) / 255;
  const green = parseInt(expanded.slice(2, 4), 16) / 255;
  const blue = parseInt(expanded.slice(4, 6), 16) / 255;
  return [red, green, blue, 1];
};

const shaderSource = /* wgsl */`
struct Uniforms {
  resolution: vec2f,
  time: f32,
  alpha: f32,
  colorA: vec4f,
  colorB: vec4f,
  colorC: vec4f,
  colorD: vec4f,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vsMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOut {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -3.0),
    vec2f(-1.0, 1.0),
    vec2f(3.0, 1.0)
  );
  var uvs = array<vec2f, 3>(
    vec2f(0.0, 2.0),
    vec2f(0.0, 0.0),
    vec2f(2.0, 0.0)
  );

  var out: VertexOut;
  out.position = vec4f(positions[vertexIndex], 0.0, 1.0);
  out.uv = uvs[vertexIndex];
  return out;
}

fn mixPalette(t: f32) -> vec3f {
  let phase = fract(t * 3.0);
  if (t < 0.3333) {
    return mix(uniforms.colorA.xyz, uniforms.colorB.xyz, phase);
  }
  if (t < 0.6666) {
    return mix(uniforms.colorB.xyz, uniforms.colorC.xyz, phase);
  }
  return mix(uniforms.colorC.xyz, uniforms.colorD.xyz, phase);
}

@fragment
fn fsMain(in: VertexOut) -> @location(0) vec4f {
  let uv = in.uv;
  let centered = uv * 2.0 - vec2f(1.0, 1.0);
  let t = uniforms.time * 0.12;

  let waveA = sin((centered.x + t) * 3.2) * 0.18;
  let waveB = cos((centered.y - t * 1.4) * 4.3) * 0.14;
  let swirl = sin((centered.x + centered.y) * 2.4 - t * 3.0) * 0.08;
  let gradient = clamp(uv.x * 0.58 + uv.y * 0.42 + waveA + waveB + swirl, 0.0, 1.0);

  let radial = length(centered * vec2f(1.15, 0.8));
  let glow = exp(-3.4 * radial * radial);
  let sparkle = 0.025 / (0.18 + length(centered + vec2f(sin(t * 4.0) * 0.28, cos(t * 3.0) * 0.18)));
  let color = mixPalette(gradient);
  let accent = mixPalette(fract(gradient + 0.22));
  let blended = mix(color, accent, glow * 0.55 + 0.12) + sparkle;
  let vignette = smoothstep(1.25, 0.15, radial);

  return vec4f(blended * (0.62 + 0.38 * vignette), uniforms.alpha);
}
`;

export default function SubjectCardsHeroGpu({ colors }: SubjectCardsHeroGpuProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const palette = useMemo(() => {
    const resolved = [...colors, ...FALLBACK_COLORS].slice(0, 4);
    return resolved.map(hexToVec4);
  }, [colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId = 0;
    let mounted = true;
    let context: any = null;
    let device: any = null;
    let observer: ResizeObserver | null = null;

    const setup = async () => {
      try {
        const gpu = (navigator as Navigator & { gpu?: any }).gpu;
        if (!gpu) return;

        const adapter = await gpu.requestAdapter();
        if (!adapter || !mounted) return;

        device = await adapter.requestDevice();
        if (!device || !mounted) return;

        context = canvas.getContext("webgpu");
        if (!context) return;

        const format = gpu.getPreferredCanvasFormat();
        const uniformData = new Float32Array(24);
        const uniformBuffer = device.createBuffer({
          size: uniformData.byteLength,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const pipeline = device.createRenderPipeline({
          layout: "auto",
          vertex: {
            module: device.createShaderModule({ code: shaderSource }),
            entryPoint: "vsMain",
          },
          fragment: {
            module: device.createShaderModule({ code: shaderSource }),
            entryPoint: "fsMain",
            targets: [{
              format,
              blend: {
                color: {
                  srcFactor: "src-alpha",
                  dstFactor: "one-minus-src-alpha",
                  operation: "add",
                },
                alpha: {
                  srcFactor: "one",
                  dstFactor: "one-minus-src-alpha",
                  operation: "add",
                },
              },
            }],
          },
          primitive: {
            topology: "triangle-list",
          },
        });

        const bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
        });

        const resize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const rect = canvas.getBoundingClientRect();
          const width = Math.max(1, Math.floor(rect.width * dpr));
          const height = Math.max(1, Math.floor(rect.height * dpr));
          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }
          context.configure({
            device,
            format,
            alphaMode: "premultiplied",
          });
        };

        resize();
        observer = new ResizeObserver(resize);
        observer.observe(canvas);

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const start = performance.now();

        const render = () => {
          if (!mounted) return;

          resize();

          const elapsed = (performance.now() - start) / 1000;
          uniformData[0] = canvas.width;
          uniformData[1] = canvas.height;
          uniformData[2] = reducedMotion ? 0 : elapsed;
          uniformData[3] = reducedMotion ? 0.3 : 0.58;

          palette.forEach((color, index) => {
            const offset = 4 + index * 4;
            uniformData[offset] = color[0];
            uniformData[offset + 1] = color[1];
            uniformData[offset + 2] = color[2];
            uniformData[offset + 3] = color[3];
          });

          device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer, uniformData.byteOffset, uniformData.byteLength);

          const commandEncoder = device.createCommandEncoder();
          const textureView = context.getCurrentTexture().createView();
          const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
              view: textureView,
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
              loadOp: "clear",
              storeOp: "store",
            }],
          });

          renderPass.setPipeline(pipeline);
          renderPass.setBindGroup(0, bindGroup);
          renderPass.draw(3);
          renderPass.end();

          device.queue.submit([commandEncoder.finish()]);
          animationFrameId = window.requestAnimationFrame(render);
        };

        render();
      } catch {
        // Keep the CSS hero as the fallback path.
      }
    };

    void setup();

    return () => {
      mounted = false;
      window.cancelAnimationFrame(animationFrameId);
      observer?.disconnect();
      try {
        device?.destroy?.();
      } catch {
        // ignore cleanup issues
      }
    };
  }, [palette]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}
import { useRef, useEffect } from 'react';

const SHADER = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}
float stars(vec2 uv, float t){
  float s=0.;
  for(float i=0.;i<3.;i++){
    vec2 grid=floor(uv*( 15.+i*10.))+i*100.;
    float r=rnd(grid);
    if(r>.92){
      vec2 center=fract(uv*(15.+i*10.))-.5;
      float d=length(center);
      float brightness=smoothstep(.04,.0,d);
      float twinkle=sin(t*2.+r*6.28)*.5+.5;
      twinkle=mix(.4,1.,twinkle);
      float size=mix(.5,1.5,rnd(grid+1.));
      s+=brightness*twinkle*size;
    }
  }
  return s;
}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  vec2 starUv=FC/R;
  starUv.x*=R.x/R.y;
  float s=stars(starUv+vec2(T*.02,T*.01),T);
  col+=vec3(.9,.95,1.)*s;
  O=vec4(col,1);
}`;

const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

export default function ShaderBackground() {
  const ref = useRef(null);
  const frame = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const gl = c.getContext('webgl2');
    if (!gl) return;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    const resize = () => { c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr; gl.viewport(0, 0, c.width, c.height); };
    resize();
    const vs = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vs, VERT); gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(fs, SHADER); gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(fs)); return; }
    const pg = gl.createProgram(); gl.attachShader(pg, vs); gl.attachShader(pg, fs); gl.linkProgram(pg);
    if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(pg)); return; }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(pg, 'position'); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const rL = gl.getUniformLocation(pg, 'resolution'), tL = gl.getUniformLocation(pg, 'time');
    const loop = (now) => { gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(pg); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.uniform2f(rL, c.width, c.height); gl.uniform1f(tL, now*1e-3); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); frame.current = requestAnimationFrame(loop); };
    loop(0);
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); if (frame.current) cancelAnimationFrame(frame.current); gl.deleteProgram(pg); gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteBuffer(buf); };
  }, []);

  return <canvas ref={ref} style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', opacity:0.45, pointerEvents:'none', zIndex:0 }} />;
}

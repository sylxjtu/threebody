console.log("Hello, world!\n");

const canvas = document.getElementById("main") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const bgcanvas = document.getElementById("bg") as HTMLCanvasElement;
const bgctx = bgcanvas.getContext("2d") as CanvasRenderingContext2D;
console.log(canvas.height, canvas.width);
const WIDTH = 800;
const HEIGHT = 600;

let G = -1;
const stepPerFrame = 1000;
const timeFac = 1 / stepPerFrame;

console.log(timeFac);

class Obj {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  mass: number;
  color: string;

  constructor(x: number, y: number, vx: number, vy: number, r: number, mass: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.mass = mass;
    this.color = color;
  }
}

let M_MOON = 10
let M_EARTH = 50
let M_MARS = 40

function getObjects(): Obj[] {
  let vxearth = (document.getElementById('vxearth') as HTMLInputElement).valueAsNumber;
  let vyearth = (document.getElementById('vyearth') as HTMLInputElement).valueAsNumber;
  let vxmoon = (document.getElementById('vxmoon') as HTMLInputElement).valueAsNumber;
  let vymoon = (document.getElementById('vymoon') as HTMLInputElement).valueAsNumber;
  let vxmars = (document.getElementById('vxmars') as HTMLInputElement).valueAsNumber;
  let vymars = (document.getElementById('vymars') as HTMLInputElement).valueAsNumber;

  console.log(vxearth, vyearth, vxmoon, vymoon, vxmars, vymars);

  return [
    new Obj(WIDTH / 2 + 100, HEIGHT / 2, vxearth, vyearth, 25, M_EARTH, '#0072c6'),
    new Obj(WIDTH / 2, HEIGHT / 2, vxmoon, vymoon, 5, M_MOON, '#c0c0c0'),
    new Obj(WIDTH / 2 - 100, HEIGHT / 2, vxmars, vymars, 20, M_MARS, '#ff5733'),
  ]
}

let objects: Obj[] = []

function draw(obj: Obj): void {
  ctx.beginPath();
  const grad = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, obj.r);
  grad.addColorStop(0.75, obj.color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
  ctx.fill();
}

function trace(obj: Obj): void {
  bgctx.strokeStyle = obj.color;
  bgctx.strokeRect(obj.x - 0.5, obj.y - 0.5, 1, 1);
  bgctx.stroke();
}

function update(obj: Obj): Obj {
  let ax = 0;
  let ay = 0;

  objects.forEach((nobj) => {
    if (obj === nobj) return;

    const dist2 = Math.pow(obj.x - nobj.x, 2) + Math.pow(obj.y - nobj.y, 2);
    const force = G * obj.mass * nobj.mass / dist2;
    const acc = force / obj.mass;
    ax += acc / Math.sqrt(dist2) * (nobj.x - obj.x);
    ay += acc / Math.sqrt(dist2) * (nobj.y - obj.y);
  })

  return new Obj(
    obj.x + obj.vx * timeFac + ax * timeFac * timeFac,
    obj.y + obj.vy * timeFac + ay * timeFac * timeFac,
    obj.vx + ax * timeFac,
    obj.vy + ay * timeFac,
    obj.r,
    obj.mass,
    obj.color);
}

let handle = -1

function frame() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  for (let i = 0; i < stepPerFrame; i++) {
    objects.forEach(trace);
    objects = objects.map(update);
  }
  objects.forEach(draw);

  handle = window.requestAnimationFrame(frame);
}

function getG() {
 return (document.getElementById('g') as HTMLInputElement).valueAsNumber;
}

function reset() {
  objects = getObjects();
  bgctx.fillStyle = "#000000";
  bgctx.fillRect(0, 0, WIDTH, HEIGHT);
  G = getG();
  if (handle != -1) {
    window.cancelAnimationFrame(handle);
  }
  handle = window.requestAnimationFrame(frame);
}

function randomizeZeroM() {
  const vscale = (document.getElementById("vscale") as HTMLInputElement).valueAsNumber;
  const vxmoon = Math.random() * vscale;
  const vymoon = Math.random() * vscale;
  const vxmars = Math.random() * vscale;
  const vymars = Math.random() * vscale;
  const curMx = vxmoon * M_MOON + vxmars * M_MARS;
  const curMy = vymoon * M_MOON + vymars * M_MARS;
  const vxearth = - curMx / M_EARTH;
  const vyearth = - curMy / M_EARTH;
  (document.getElementById("vxmoon") as HTMLInputElement).valueAsNumber = vxmoon;
  (document.getElementById("vymoon") as HTMLInputElement).valueAsNumber = vymoon;
  (document.getElementById("vxearth") as HTMLInputElement).valueAsNumber = vxearth;
  (document.getElementById("vyearth") as HTMLInputElement).valueAsNumber = vyearth;
  (document.getElementById("vxmars") as HTMLInputElement).valueAsNumber = vxmars;
  (document.getElementById("vymars") as HTMLInputElement).valueAsNumber = vymars;
}

function randomizeFull() {
  const vscale = (document.getElementById("vscale") as HTMLInputElement).valueAsNumber;
  const toFillIds = ["vxearth", "vyearth", "vxmoon", "vymoon", "vxmars", "vymars"];
  toFillIds.forEach(id => {
    (document.getElementById(id) as HTMLInputElement).valueAsNumber = Math.random() * vscale;
  })
}

function randomize() {
 if (Boolean((document.getElementById("zerom") as HTMLInputElement).value)) {
  randomizeZeroM();
 } else {
  randomizeFull();
 }
}

randomize();
reset();

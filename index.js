console.log("Hello, world!\n");
var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");
var bgcanvas = document.getElementById("bg");
var bgctx = bgcanvas.getContext("2d");
console.log(canvas.height, canvas.width);
var WIDTH = 800;
var HEIGHT = 600;
var G = -1;
var stepPerFrame = 1000;
var timeFac = 1 / stepPerFrame;
console.log(timeFac);
var Obj = /** @class */ (function () {
    function Obj(x, y, vx, vy, r, mass, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
        this.mass = mass;
        this.color = color;
    }
    return Obj;
}());
var M_MOON = 10;
var M_EARTH = 50;
var M_MARS = 40;
function getObjects() {
    var vxearth = document.getElementById('vxearth').valueAsNumber;
    var vyearth = document.getElementById('vyearth').valueAsNumber;
    var vxmoon = document.getElementById('vxmoon').valueAsNumber;
    var vymoon = document.getElementById('vymoon').valueAsNumber;
    var vxmars = document.getElementById('vxmars').valueAsNumber;
    var vymars = document.getElementById('vymars').valueAsNumber;
    console.log(vxearth, vyearth, vxmoon, vymoon, vxmars, vymars);
    return [
        new Obj(WIDTH / 2 + 100, HEIGHT / 2, vxearth, vyearth, 25, M_EARTH, '#0072c6'),
        new Obj(WIDTH / 2, HEIGHT / 2, vxmoon, vymoon, 5, M_MOON, '#c0c0c0'),
        new Obj(WIDTH / 2 - 100, HEIGHT / 2, vxmars, vymars, 20, M_MARS, '#ff5733'),
    ];
}
var objects = [];
function draw(obj) {
    ctx.beginPath();
    var grad = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, obj.r);
    grad.addColorStop(0.75, obj.color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
    ctx.fill();
}
function trace(obj) {
    bgctx.strokeStyle = obj.color;
    bgctx.strokeRect(obj.x - 0.5, obj.y - 0.5, 1, 1);
    bgctx.stroke();
}
function update(obj) {
    var ax = 0;
    var ay = 0;
    objects.forEach(function (nobj) {
        if (obj === nobj)
            return;
        var dist2 = Math.pow(obj.x - nobj.x, 2) + Math.pow(obj.y - nobj.y, 2);
        var force = G * obj.mass * nobj.mass / dist2;
        var acc = force / obj.mass;
        ax += acc / Math.sqrt(dist2) * (nobj.x - obj.x);
        ay += acc / Math.sqrt(dist2) * (nobj.y - obj.y);
    });
    return new Obj(obj.x + obj.vx * timeFac + ax * timeFac * timeFac, obj.y + obj.vy * timeFac + ay * timeFac * timeFac, obj.vx + ax * timeFac, obj.vy + ay * timeFac, obj.r, obj.mass, obj.color);
}
var handle = -1;
function getBaryCenter(objects) {
    var bmcx = 0, bmcy = 0;
    var msum = 0;
    objects.forEach(function (obj) {
        bmcx += obj.x * obj.mass;
        bmcy += obj.y * obj.mass;
        msum += obj.mass;
    });
    return [bmcx / msum, bmcy / msum];
}
function getMomentum(objects) {
    var mmx = 0, mmy = 0;
    objects.forEach(function (obj) {
        mmx += obj.vx * obj.mass;
        mmy += obj.vy * obj.mass;
    });
    return [mmx, mmy];
}
function getAngularMomentum(objects, bmx, bmy) {
    var am = 0;
    objects.forEach(function (obj) {
        var p = [obj.vx * obj.mass, obj.vy * obj.mass];
        var r = [obj.x - bmx, obj.y - bmy];
        am += p[0] * r[1] - p[1] * r[0];
    });
    return am;
}
function frame() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (var i = 0; i < stepPerFrame; i++) {
        objects.forEach(trace);
        objects = objects.map(update);
    }
    objects.forEach(draw);
    if (document.getElementById('debugInfo').checked) {
        var _a = getBaryCenter(objects), bcx = _a[0], bcy = _a[1];
        document.getElementById('baryCenterDisplay').textContent = "BaryCenter: " + bcx.toFixed(2) + ", " + bcy.toFixed(2);
        var _b = getMomentum(objects), mx = _b[0], my = _b[1];
        document.getElementById('momentumDisplay').textContent = "Momentum: " + mx.toFixed(2) + ", " + my.toFixed(2);
        var am = getAngularMomentum(objects, bcx, bcy);
        document.getElementById('angularMomentumDisplay').textContent = "AngularMomentum: " + am.toFixed(2);
    }
    handle = window.requestAnimationFrame(frame);
}
function getG() {
    return document.getElementById('g').valueAsNumber;
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
    var vscale = document.getElementById("vscale").valueAsNumber;
    var vxmoon = Math.random() * vscale;
    var vymoon = Math.random() * vscale;
    var vxmars = Math.random() * vscale;
    var vymars = Math.random() * vscale;
    var curMx = vxmoon * M_MOON + vxmars * M_MARS;
    var curMy = vymoon * M_MOON + vymars * M_MARS;
    var vxearth = -curMx / M_EARTH;
    var vyearth = -curMy / M_EARTH;
    document.getElementById("vxmoon").valueAsNumber = vxmoon;
    document.getElementById("vymoon").valueAsNumber = vymoon;
    document.getElementById("vxearth").valueAsNumber = vxearth;
    document.getElementById("vyearth").valueAsNumber = vyearth;
    document.getElementById("vxmars").valueAsNumber = vxmars;
    document.getElementById("vymars").valueAsNumber = vymars;
}
function randomizeFull() {
    var vscale = document.getElementById("vscale").valueAsNumber;
    var toFillIds = ["vxearth", "vyearth", "vxmoon", "vymoon", "vxmars", "vymars"];
    toFillIds.forEach(function (id) {
        document.getElementById(id).valueAsNumber = Math.random() * vscale;
    });
}
function randomize() {
    if (document.getElementById("zerom").checked) {
        randomizeZeroM();
    }
    else {
        randomizeFull();
    }
}
randomize();
reset();

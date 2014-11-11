"use strict";
var VIEW_ANGLE = 45;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var ASPECT = WIDTH/HEIGHT;
var NEAR = 0.1;
var FAR = 10000;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);
camera.position.z = 50;
scene.add(camera);

var bird = require("./bird");
var material = new THREE.MeshLambertMaterial({ color: "blue"});
var myBird = new THREE.Mesh(new bird(20, 15), material);
myBird.rotation.x = Math.PI / 4;
scene.add(myBird);

var light = new THREE.PointLight(0xFFFFFF);
light.position.y = 50;
scene.add(light);

var stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);

var flapLoop = makeLerpLoop(500, 250);

function render() {
	stats.begin();

	renderer.render(scene, camera);
	myBird.rotation.y -= 0.01;
	myBird.geometry.setAnimLerp(flapLoop());
	requestAnimationFrame(render);

	stats.end();
}
render();

function makeLerpLoop(period, offset) {
	var startTime = new Date();
	offset |= 0;

	return function() {
		return ((new Date()) - startTime + offset) % period / period;
	};
}

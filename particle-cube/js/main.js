"use strict";

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

function resizeCallback() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
}
window.addEventListener("resize", resizeCallback, false);

scene.add(camera);
camera.position.z = 300;

var planetsystem = require("./planetsystem.js");
var systemGeom = new planetsystem(100, 2);
var material = new THREE.PointCloudMaterial({
	color: "blue",
	size: 2
});
var system = new THREE.PointCloud(systemGeom, material);
scene.add(system);

var light = new THREE.PointLight();
scene.add(light);

light.position.x = 10;
light.position.y = 50;
light.position.z = 130;

var stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.right = "0px";
stats.domElement.style.bottom = "0px";
document.body.appendChild(stats.domElement);

function render() {
	stats.begin();

	renderer.render(scene, camera);

	system.rotation.x += 0.01;
	system.rotation.y += 0.01;
	
	system.geometry.nextFrame();

	requestAnimationFrame(render);

	stats.end();
}
render();

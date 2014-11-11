(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./planetsystem.js":2}],2:[function(require,module,exports){
"use strict";

function PlanetSystem(bound, maxExpandSpeed) {
	THREE.Geometry.call(this);

	this.bound = bound || 1000;
	var numParticles = 10000;

	this.particles = [];

	maxExpandSpeed = maxExpandSpeed !== undefined ? maxExpandSpeed : 4;
	for(var i = 0; i < numParticles; i++) {
		var position = new THREE.Vector3(
				(Math.random() - 0.5) * 2 * this.bound,
				(Math.random() - 0.5) * 2 * this.bound,
				(Math.random() - 0.5) * 2 * this.bound);

		var velocity = new THREE.Vector3(
				(Math.random() * 2 - 1) * maxExpandSpeed,
				(Math.random() * 2 - 1) * maxExpandSpeed,
				(Math.random() * 2 - 1) * maxExpandSpeed);

		this.particles.push({position: position, velocity: velocity});
		this.vertices.push(position);
	}
}

PlanetSystem.prototype = Object.create(THREE.Geometry.prototype);
PlanetSystem.prototype.constructor = PlanetSystem;

PlanetSystem.prototype.nextFrame = function() {
	var bound = this.bound;
	this.particles.forEach(function(particle) {
		var vertex = particle.position;
		vertex.add(particle.velocity);

		if(vertex.x > bound) {
			vertex.x = -bound;
		} else if(vertex.x < -bound) {
			vertex.x = bound;
		}
		if(vertex.y > bound) {
			vertex.y = -bound;
		} else if(vertex.y < -bound) {
			vertex.y = bound;
		}
		if(vertex.z > bound) {
			vertex.z = -bound;
		} else if(vertex.z < -bound) {
			vertex.z = bound;
		}
	});

	this.verticesNeedUpdate = true;
};

module.exports = PlanetSystem;

},{}]},{},[1]);

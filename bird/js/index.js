(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
function Bird(wingSpan, depth) {
	THREE.Geometry.call(this);

	wingSpan |= 10;

	var wingLen = wingSpan / 2;
	var halfDepth = depth / 2;

	this.vertices = [
		new THREE.Vector3(-wingLen, 0, 0),   // Left tip
		new THREE.Vector3(wingLen, 0, 0),    // Right tip
		new THREE.Vector3(0, 0, halfDepth),  // Front face
			new THREE.Vector3(0, 0, -halfDepth) // Back face
	];

	this.faces = [
		new THREE.Face3(2, 3, 0),
		new THREE.Face3(3, 2, 1)
	];

	this.computeFaceNormals();
}

Bird.prototype = Object.create(THREE.Geometry.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.setAnimLerp = function(lerp) {
	var innerAmplitude = 3;
	var outerAmplitude = 10;

	lerp %= 1;

	var sinTheta = Math.sin(2 * Math.PI * lerp);

	this.vertices[2].y = sinTheta * innerAmplitude;
	this.vertices[3].y = sinTheta * innerAmplitude;

	this.vertices[0].y = -sinTheta * outerAmplitude;
	this.vertices[1].y = -sinTheta * outerAmplitude;

	this.verticesNeedUpdate = true;
};

module.exports = Bird;

},{}],2:[function(require,module,exports){
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

},{"./bird":1}]},{},[2]);

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

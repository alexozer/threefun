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

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Initial Setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
var mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

var colors = ['#494f66', '#3c404f', '#272930', '#47484c'];

// Event Listeners
addEventListener('mousemove', function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
});

// Utility Functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
    var xDist = x2 - x1;
    var yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    var rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    var xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    var yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    var xDist = otherParticle.x - particle.x;
    var yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        var angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        var m1 = particle.mass;
        var m2 = otherParticle.mass;

        // Velocity before equation
        var u1 = rotate(particle.velocity, angle);
        var u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        var v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        var v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        var vFinal1 = rotate(v1, -angle);
        var vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

// Objects

function Particle(x, y, radius, color) {
    var _this = this;

    this.x = x;
    this.y = y;
    this.velocity = {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1;
    this.opacity = 0.1;

    this.update = function (particles) {
        _this.draw();

        //other particle collisions
        for (var i = 0; i < particles.length; i++) {
            if (_this === particles[i]) continue;
            if (distance(_this.x, _this.y, particles[i].x, particles[i].y) - _this.radius * 2 < 0) {
                resolveCollision(_this, particles[i]);
            }
        }

        //wall collisions
        if (_this.x - _this.radius <= 0 || _this.x + _this.radius >= innerWidth) {
            _this.velocity.x = -_this.velocity.x;
        }
        if (_this.y - _this.radius <= 0 || _this.y + _this.radius >= innerHeight) {
            _this.velocity.y = -_this.velocity.y;
        }

        //mouse collision detection
        if (distance(mouse.x, mouse.y, _this.x, _this.y) < 120) {
            if (_this.opacity < .5) _this.opacity += 0.05;
        } else {
            if (_this.opacity > .1) _this.opacity -= 0.05;
        }

        //particle movement
        _this.x += _this.velocity.x;
        _this.y += _this.velocity.y;
    };

    this.draw = function () {
        c.beginPath();
        c.arc(_this.x, _this.y, _this.radius, 0, Math.PI * 2, false);
        c.save();
        c.globalAlpha = _this.opacity;
        c.fillStyle = _this.color;
        c.fill();
        c.restore();
        c.strokeStyle = _this.color;
        c.stroke();
        c.closePath();
    };
}

//Mountain
function Mountain(base, height, xOffset, color) {
    var _this2 = this;

    this.base = base;
    this.height = height;
    this.xOffset = xOffset;
    this.color = color;

    this.draw = function () {
        c.beginPath();
        c.fillStyle = _this2.color;
        c.moveTo(_this2.xOffset, innerHeight);
        c.lineTo(_this2.xOffset + _this2.base / 2, innerHeight - _this2.height);
        c.lineTo(_this2.xOffset + _this2.base, innerHeight);
        c.lineTo(_this2.xOffset, innerHeight);
        c.fill();
    };
}

// Implementation
var particles = void 0;
var mountains = void 0;

function init() {
    particles = [];
    mountains = [];

    for (var i = 1; i <= 3; i++) {
        var base = 400;
        var height = base - base * 4 / 7;
        var xOffset = base / 2 * i - base / 3;
        // ['#494f66', '#3c404f', '#272930', '#242535', '#202133']
        var color = '#202133';
        mountains.push(new Mountain(base, height, xOffset, color));
    }

    for (var _i = 0; _i <= 200; _i++) {
        var x = randomIntFromRange(radius, canvas.width - radius);
        var y = randomIntFromRange(radius, canvas.height - radius);
        var radius = 15;
        var _color = randomColor(colors);

        if (_i !== 0) {
            for (var j = 0; j < particles.length; j++) {
                if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
                    x = randomIntFromRange(radius, canvas.width - radius);
                    y = randomIntFromRange(radius, canvas.height - radius);

                    j = -1;
                }
            }
        }

        particles.push(new Particle(x, y, radius, _color));
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    mountains.forEach(function (mountain) {
        mountain.draw();
    });

    particles.forEach(function (particle) {
        particle.update(particles);
    });
}

init();
animate();

/***/ })
/******/ ]);
//# sourceMappingURL=canvas.bundle.js.map
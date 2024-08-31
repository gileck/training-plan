import React, { useRef, useEffect } from 'react';

const Fireworks = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let fireworks = [];
        let particles = [];
        let hue = 120;
        let timerTick = 0;
        let timerTotal = 20; // Frequency of creating new sets of fireworks

        // Helper function to create random numbers
        const random = (min, max) => Math.random() * (max - min) + min;

        // Create a Firework object
        class Firework {
            constructor(sx, sy, tx, ty) {
                this.x = sx;
                this.y = sy;
                this.sx = sx;
                this.sy = sy;
                this.tx = tx;
                this.ty = ty;
                this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
                this.distanceTraveled = 0;
                this.coordinates = Array(3).fill([sx, sy]);
                this.angle = Math.atan2(ty - sy, tx - sx);
                this.speed = random(3, 5); // Increased speed
                this.acceleration = 1; // Increased acceleration
                this.brightness = random(50, 70);
            }

            update() {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);

                this.speed *= this.acceleration;

                let vx = Math.cos(this.angle) * this.speed;
                let vy = Math.sin(this.angle) * this.speed;

                this.distanceTraveled = Math.hypot(this.sx - this.x, this.sy - this.y);

                if (this.distanceTraveled >= this.distanceToTarget) {
                    createParticles(this.tx, this.ty);
                    return false;
                } else {
                    this.x += vx;
                    this.y += vy;
                    return true;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;
                ctx.stroke();
            }
        }

        // Create a Particle object
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.coordinates = Array(5).fill([x, y]);
                this.angle = random(0, Math.PI * 2);
                this.speed = random(6, 12); // Increased minimum speed
                this.friction = 0.95;
                this.gravity = 1;
                this.hue = random(hue - 20, hue + 20);
                this.brightness = random(50, 80);
                this.alpha = 1;
                this.decay = random(0.01, 0.03); // Increased decay for faster fade
            }

            update() {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);
                this.speed *= this.friction;
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed + this.gravity;
                this.alpha -= this.decay;
                return this.alpha > this.decay;
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
                ctx.stroke();
            }
        }

        // Function to create particles
        const createParticles = (x, y) => {
            for (let i = 0; i < 100; i++) { // Increased number of particles
                particles.push(new Particle(x, y));
            }
        };

        // Main animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            fireworks = fireworks.filter(firework => {
                firework.draw();
                return firework.update();
            });

            particles = particles.filter(particle => {
                particle.draw();
                return particle.update();
            });

            if (timerTick >= timerTotal) {
                // Create multiple fireworks at the same time
                for (let i = 0; i < 6; i++) { // Number of simultaneous fireworks
                    fireworks.push(new Firework(
                        canvas.width / 2,
                        canvas.height,
                        random(0, canvas.width),
                        random(0, canvas.height / 2)
                    ));
                }
                timerTick = 0;
            } else {
                timerTick++;
            }

            hue += 0.5;
            requestAnimationFrame(animate);
        };

        animate();

        // Clean up function to stop animation on unmount
        return () => {
            fireworks = [];
            particles = [];
            cancelAnimationFrame(animate);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000, pointerEvents: 'none' }} />;
};

export default Fireworks;

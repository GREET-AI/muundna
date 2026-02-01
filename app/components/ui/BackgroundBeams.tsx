'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const beams: Array<{
      x: number;
      y: number;
      length: number;
      angle: number;
      speed: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 5; i++) {
      beams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 100 + Math.random() * 200,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1,
        opacity: 0.1 + Math.random() * 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;

      beams.forEach((beam) => {
        beam.x += Math.cos(beam.angle) * beam.speed;
        beam.y += Math.sin(beam.angle) * beam.speed;

        if (beam.x < 0 || beam.x > canvas.width) beam.angle = Math.PI - beam.angle;
        if (beam.y < 0 || beam.y > canvas.height) beam.angle = -beam.angle;

        ctx.globalAlpha = beam.opacity;
        ctx.beginPath();
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(
          beam.x + Math.cos(beam.angle) * beam.length,
          beam.y + Math.sin(beam.angle) * beam.length
        );
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
    />
  );
}


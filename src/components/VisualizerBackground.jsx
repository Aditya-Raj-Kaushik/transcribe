import React, { useEffect, useRef } from "react";

const VisualizerBackground = () => {
  const canvasRef = useRef(null);
  const bars = 64;
  const smoothFactor = 0.1; // Adjust this value to slow down bar movements

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId;
    let audioCtx, analyser, dataArray;
    const barWidth = canvas.width / bars;
    const barHeights = new Array(bars).fill(0); // To store the smooth bar heights

    const setupAudio = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);

      draw();
    };

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < bars; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const targetHeight = Math.min(canvas.height * percent * 1.2, canvas.height);

        // Smooth the transition between current bar height and target height
        barHeights[i] += (targetHeight - barHeights[i]) * smoothFactor;

        const height = barHeights[i];
        const x = centerX + (i - bars / 2) * barWidth;
        const y = centerY - height / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, "#3b82f6");
        gradient.addColorStop(1, "#93c5fd");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth * 0.6, height);
      }
    };

    setupAudio();

    return () => {
      cancelAnimationFrame(animationId);
      if (audioCtx) audioCtx.close();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default VisualizerBackground;

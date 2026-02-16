"use client";

import { useEffect, useRef } from "react";

interface GeometricGridProps {
  className?: string;
  cellSize?: number;
  colors?: string[];
}

export function GeometricGrid({
  className = "",
  cellSize = 50,
  colors = ["#FFED00", "#0066FF", "#00CED1", "#B8E6E6"]
}: GeometricGridProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const updateSize = () => {
      svg.setAttribute("width", window.innerWidth.toString());
      svg.setAttribute("height", window.innerHeight.toString());
    };
    updateSize();

    const cols = Math.ceil(window.innerWidth / cellSize);
    const rows = Math.ceil(window.innerHeight / cellSize);

    svg.innerHTML = "";

    // Create filter for glow effect
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "glow");

    const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    feGaussianBlur.setAttribute("stdDeviation", "3");
    feGaussianBlur.setAttribute("result", "coloredBlur");

    const feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
    const feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
    feMergeNode1.setAttribute("in", "coloredBlur");
    const feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
    feMergeNode2.setAttribute("in", "SourceGraphic");

    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    // Horizontal lines
    for (let row = 0; row <= rows; row++) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", "0");
      line.setAttribute("y1", (row * cellSize).toString());
      line.setAttribute("x2", window.innerWidth.toString());
      line.setAttribute("y2", (row * cellSize).toString());
      line.setAttribute("stroke", colors[Math.floor(Math.random() * colors.length)]);
      line.setAttribute("stroke-width", "2");
      line.setAttribute("opacity", "0");
      line.setAttribute("filter", "url(#glow)");
      line.classList.add("animate-grid-pulse");
      line.style.animationDelay = `${Math.random() * 3}s`;
      svg.appendChild(line);
    }

    // Vertical lines
    for (let col = 0; col <= cols; col++) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", (col * cellSize).toString());
      line.setAttribute("y1", "0");
      line.setAttribute("x2", (col * cellSize).toString());
      line.setAttribute("y2", window.innerHeight.toString());
      line.setAttribute("stroke", colors[Math.floor(Math.random() * colors.length)]);
      line.setAttribute("stroke-width", "2");
      line.setAttribute("opacity", "0");
      line.setAttribute("filter", "url(#glow)");
      line.classList.add("animate-grid-pulse");
      line.style.animationDelay = `${Math.random() * 3}s`;
      svg.appendChild(line);
    }

    // Random highlighted cells with architectural patterns
    const randomCells: SVGElement[] = [];
    for (let i = 0; i < 20; i++) {
      const randomCol = Math.floor(Math.random() * cols);
      const randomRow = Math.floor(Math.random() * rows);
      const color = colors[Math.floor(Math.random() * colors.length)];

      const pattern = Math.random();

      if (pattern < 0.5) {
        // Filled rectangle
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", (randomCol * cellSize).toString());
        rect.setAttribute("y", (randomRow * cellSize).toString());
        rect.setAttribute("width", cellSize.toString());
        rect.setAttribute("height", cellSize.toString());
        rect.setAttribute("fill", color);
        rect.setAttribute("opacity", "0");
        rect.setAttribute("filter", "url(#glow)");
        rect.classList.add("animate-grid-cell-pulse");
        rect.style.animationDelay = `${Math.random() * 4}s`;
        svg.appendChild(rect);
        randomCells.push(rect);
      } else {
        // Diagonal cross pattern
        const x = randomCol * cellSize;
        const y = randomRow * cellSize;

        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.setAttribute("x1", x.toString());
        line1.setAttribute("y1", y.toString());
        line1.setAttribute("x2", (x + cellSize).toString());
        line1.setAttribute("y2", (y + cellSize).toString());
        line1.setAttribute("stroke", color);
        line1.setAttribute("stroke-width", "3");
        line1.setAttribute("opacity", "0");
        line1.setAttribute("filter", "url(#glow)");
        line1.classList.add("animate-grid-cell-pulse");
        line1.style.animationDelay = `${Math.random() * 4}s`;

        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.setAttribute("x1", (x + cellSize).toString());
        line2.setAttribute("y1", y.toString());
        line2.setAttribute("x2", x.toString());
        line2.setAttribute("y2", (y + cellSize).toString());
        line2.setAttribute("stroke", color);
        line2.setAttribute("stroke-width", "3");
        line2.setAttribute("opacity", "0");
        line2.setAttribute("filter", "url(#glow)");
        line2.classList.add("animate-grid-cell-pulse");
        line2.style.animationDelay = `${Math.random() * 4}s`;

        svg.appendChild(line1);
        svg.appendChild(line2);
        randomCells.push(line1, line2);
      }
    }

    const handleResize = () => {
      updateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [cellSize, colors]);

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}

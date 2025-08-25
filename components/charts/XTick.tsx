"use client";

import React from "react";

function wrapLabel(text: string, limit = 12) {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > limit && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

export default function XTick(props: any) {
  const { x, y, payload } = props;
  const lines = wrapLabel(String(payload.value));
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" className="fill-gray-400" fontSize={12}>
        {lines.map((ln: string, i: number) => (
          <tspan key={i} x={0} dy={i === 0 ? 0 : 14}>
            {ln}
          </tspan>
        ))}
      </text>
    </g>
  );
}

'use client'

import { useEffect, useState } from 'react'

interface SpeedometerProps {
  value: number
  maxValue: number
}

export function Speedometer({ value, maxValue }: SpeedometerProps) {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const angle = (value / maxValue) * 240
    setRotation(angle)
  }, [value, maxValue])

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Outer ring */}
        <circle cx="100" cy="100" r="90" fill="#1e293b" stroke="#334155" strokeWidth="4" />

        {/* Inner circle */}
        <circle cx="100" cy="100" r="80" fill="#0f172a" />

        {/* Ticks and numbers */}
        {Array.from({ length: 11 }, (_, i) => i * 10).map((tick) => {
          const angle = -120 + (tick / maxValue) * 240
          const x1 = 100 + 70 * Math.cos((angle * Math.PI) / 180)
          const y1 = 100 + 70 * Math.sin((angle * Math.PI) / 180)
          const x2 = 100 + 80 * Math.cos((angle * Math.PI) / 180)
          const y2 = 100 + 80 * Math.sin((angle * Math.PI) / 180)
          const textX = 100 + 60 * Math.cos((angle * Math.PI) / 180)
          const textY = 100 + 60 * Math.sin((angle * Math.PI) / 180)

          return (
            <g key={tick}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="2" />
              <text
                x={textX}
                y={textY}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {tick}
              </text>
            </g>
          )
        })}

        {/* Colored arc */}
        <path
          d="M100,100 m-80,0 a80,80 0 1,1 160,0"
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="419.8"
          strokeDashoffset={419.8 * (1 - rotation / 240)}
          transform="rotate(-120 100 100)"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Needle */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="#56c70a"
          strokeWidth="3"
          transform={`rotate(${rotation - 120} 100 100)`}
          style={{ transition: 'transform 0.5s ease-out' }}
        />
        <circle cx="100" cy="100" r="5" fill="#56c70a" />

        {/* Center text */}
        <text
          x="100"
          y="130"
          fill="white"
          fontSize="24"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          className="drop-shadow-md"
        >
          {Math.round(value)}
        </text>
      </svg>
    </div>
  )
}


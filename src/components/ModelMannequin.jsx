import React, { useRef, useState } from 'react'
import { useGLTF, Center, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ANTERIOR_BEACONS = [
  { key: 'chest-l', id: 'chest', label: 'Chest', pos: [-0.075, 0.435, 0.102] },
  { key: 'chest-r', id: 'chest', label: 'Chest', pos: [0.075, 0.435, 0.102] },
  { key: 'delt-l', id: 'shoulders', label: 'Shoulder', pos: [-0.170, 0.444, 0.065] },
  { key: 'delt-r', id: 'shoulders', label: 'Shoulder', pos: [0.170, 0.444, 0.065] },
  { key: 'abs', id: 'abs', label: 'Abs (Core)', pos: [0, 0.220, 0.118] },
  { key: 'bicep-l', id: 'biceps', label: 'Bicep', pos: [-0.224, 0.325, 0.055] },
  { key: 'bicep-r', id: 'biceps', label: 'Bicep', pos: [0.224, 0.325, 0.055] },
  { key: 'forearm-l', id: 'forearms', label: 'Forearm', pos: [-0.310, 0.205, 0.052] },
  { key: 'forearm-r', id: 'forearms', label: 'Forearm', pos: [0.310, 0.205, 0.052] },
  { key: 'quad-l', id: 'quads', label: 'Quad', pos: [-0.102, -0.120, 0.088] },
  { key: 'quad-r', id: 'quads', label: 'Quad', pos: [0.102, -0.120, 0.088] },
]

const POSTERIOR_BEACONS = [
  { key: 'back-upper', id: 'back', label: 'Upper Back', pos: [0, 0.460, -0.105] },
  { key: 'back-lower', id: 'lower_back', label: 'Lower Back', pos: [0, 0.200, -0.090] },
  { key: 'rdelt-l', id: 'shoulders', label: 'Rear Delt', pos: [-0.170, 0.444, -0.065] },
  { key: 'rdelt-r', id: 'shoulders', label: 'Rear Delt', pos: [0.170, 0.444, -0.065] },
  { key: 'tricep-l', id: 'triceps', label: 'Tricep', pos: [-0.224, 0.325, -0.055] },
  { key: 'tricep-r', id: 'triceps', label: 'Tricep', pos: [0.224, 0.325, -0.055] },
  { key: 'ham-l', id: 'hamstrings', label: 'Hamstring', pos: [-0.102, -0.120, -0.088] },
  { key: 'ham-r', id: 'hamstrings', label: 'Hamstring', pos: [0.102, -0.120, -0.088] },
  { key: 'calf-l', id: 'calves', label: 'Calf', pos: [-0.108, -0.410, -0.115] },
  { key: 'calf-r', id: 'calves', label: 'Calf', pos: [0.108, -0.410, -0.115] },
]

function SensorNode({ beacon, status, onHover, isHovered }) {
  const color = status?.color || '#22c55e'
  const ringRef = useRef()

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isHovered ? 2.5 : 0.8)
    }
  })

  return (
    <group position={beacon.pos}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(beacon.key)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          onHover(null)
        }}
      >
        <sphereGeometry args={[0.009, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 3.0 : 1.5}
          roughness={0.1}
        />
      </mesh>

      <mesh ref={ringRef}>
        <ringGeometry args={[0.014, 0.019, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isHovered ? 0.95 : 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Renders solely on the exact hovered node */}
      {isHovered && (
        <Html distanceFactor={2.0} position={[0.05, 0.02, 0]} style={{ pointerEvents: 'none' }}>
          <div className="hover-muscle-card" style={{ borderColor: color }}>
            <div className="hover-card-header">
              <span className="hover-card-title">{beacon.label.toUpperCase()}</span>
              <span className="hover-card-badge" style={{ color: color }}>
                {status?.status ? status.status.toUpperCase() : 'RECOVERED'}
              </span>
            </div>
            <div className="hover-card-body">
              <span>{status?.hours != null ? `Trained ${status.hours}h ago` : '100% Ready (No Fatigue)'}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function ModelMannequin({ recoveryStatus, hoveredMuscle, onHoverMuscle }) {
  const { scene } = useGLTF('/models/mannequin.glb')
  const groupRef = useRef()
  const [isFrontFacing, setIsFrontFacing] = useState(true)

  useFrame(({ camera }) => {
    const isFront = camera.position.z > 0
    if (isFront !== isFrontFacing) {
      setIsFrontFacing(isFront)
    }
  })

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#475569'),
        roughness: 0.38,
        metalness: 0.25,
      })
    }
  })

  const visibleBeacons = isFrontFacing ? ANTERIOR_BEACONS : POSTERIOR_BEACONS

  return (
    <group ref={groupRef}>
      <Center>
        <primitive
          object={scene}
          scale={0.09}
          rotation={[0, Math.PI, 0]}
        />
      </Center>

      {visibleBeacons.map((b) => (
        <SensorNode
          key={b.key}
          beacon={b}
          status={recoveryStatus[b.id]}
          isHovered={hoveredMuscle === b.key}
          onHover={onHoverMuscle}
        />
      ))}
    </group>
  )
}

useGLTF.preload('/models/mannequin.glb')
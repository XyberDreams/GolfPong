import React from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

export function Character(props: any) {
  const group = React.useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/character.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)
  return (
    <group ref={group} {...props} dispose={null} scale={25} position={[0,-0.22,0]}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, -Math.PI / 2]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <group name="Plane002">
            <skinnedMesh
              name="Plane011mesh004"
              geometry={(nodes.Plane011mesh004 as THREE.SkinnedMesh).geometry}
              material={materials['Material.004']}
              skeleton={(nodes.Plane011mesh004 as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Plane011mesh004_1"
              geometry={(nodes.Plane011mesh004_1 as THREE.SkinnedMesh).geometry}
              material={materials['Material.008']}
              skeleton={(nodes.Plane011mesh004_1 as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Plane011mesh004_2"
              geometry={(nodes.Plane011mesh004_2 as THREE.SkinnedMesh).geometry}
              material={materials['Material.002']}
              skeleton={(nodes.Plane011mesh004_2 as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Plane011mesh004_3"
              geometry={(nodes.Plane011mesh004_3 as THREE.SkinnedMesh).geometry}
              material={materials['Material.027']}
              skeleton={(nodes.Plane011mesh004_3 as THREE.SkinnedMesh).skeleton}
            />
            <skinnedMesh
              name="Plane011mesh004_4"
              geometry={(nodes.Plane011mesh004_4 as THREE.SkinnedMesh).geometry}
              material={materials['croclogo.010']}
              skeleton={(nodes.Plane011mesh004_4 as THREE.SkinnedMesh).skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/character.glb')
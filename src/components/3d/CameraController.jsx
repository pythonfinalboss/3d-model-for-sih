import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStationData } from '../../context/StationDataContext';
import { STATIONS_METADATA } from '../../data/mockStationData';

export default function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef();
  const { selectedStation, selectedAsset, cameraPreset } = useStationData();

  // Target positions to lerp towards
  const targetCamPos = useRef(new THREE.Vector3(24, 18, 26));
  const targetLookAt = useRef(new THREE.Vector3(0, 2, 0));
  const isTransitioning = useRef(true);

  // Update target coordinates when station, asset, or preset changes
  useEffect(() => {
    if (selectedAsset) {
      // Focus on specific asset
      const [ax, ay, az] = selectedAsset.position;
      
      // If we are in combined view, add station offset
      let stationOffsetX = 0;
      let stationOffsetZ = 0;
      if (selectedStation === 'combined') {
        if (selectedAsset.stationId === 'maitri') {
          stationOffsetX = -35;
          stationOffsetZ = -5;
        } else {
          stationOffsetX = 35;
          stationOffsetZ = 5;
        }
      }

      const worldX = ax + stationOffsetX;
      const worldY = ay;
      const worldZ = az + stationOffsetZ;

      targetLookAt.current.set(worldX, worldY + 1.2, worldZ);
      targetCamPos.current.set(worldX + 9, worldY + 7, worldZ + 9);
      isTransitioning.current = true;
    } else if (cameraPreset === 'topDown') {
      const meta = STATIONS_METADATA[selectedStation] || STATIONS_METADATA.maitri;
      const [tx, ty, tz] = meta.topDownCamera ? meta.topDownCamera.position : [0, 50, 0.1];
      targetCamPos.current.set(tx, ty, tz);
      targetLookAt.current.set(0, 0, 0);
      isTransitioning.current = true;
    } else {
      // Station level default camera
      const meta = STATIONS_METADATA[selectedStation] || STATIONS_METADATA.maitri;
      const [cx, cy, cz] = meta.defaultCamera.position;
      const [lx, ly, lz] = meta.defaultCamera.target;
      targetCamPos.current.set(cx, cy, cz);
      targetLookAt.current.set(lx, ly, lz);
      isTransitioning.current = true;
    }
  }, [selectedStation, selectedAsset, cameraPreset]);

  // Frame loop for smooth lerping
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      const lerpFactor = Math.min(delta * 3.5, 0.15);
      camera.position.lerp(targetCamPos.current, lerpFactor);
      controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
      controlsRef.current.update();

      // Check if close enough to stop transition mode
      if (
        camera.position.distanceTo(targetCamPos.current) < 0.2 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.2
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going below ground plane
      minDistance={6}
      maxDistance={selectedStation === 'combined' ? 180 : 90}
      autoRotate={cameraPreset === 'orbit'}
      autoRotateSpeed={0.8}
    />
  );
}

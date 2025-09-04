import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const Lab = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cubeRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  
  const [lightIntensity, setLightIntensity] = useState(1);
  const [wireframe, setWireframe] = useState(false);
  
  // Mouse interaction state
  const mouseRef = useRef({ 
    isDown: false, 
    previousX: 0, 
    previousY: 0 
  });
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.set(3, 3, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    
    // Clear any existing children
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      wireframe: wireframe
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    scene.add(cube);
    cubeRef.current = cube;
    

    
    // Mouse event handlers
    const canvas = renderer.domElement;
    
    const onMouseDown = (event) => {
      mouseRef.current.isDown = true;
      mouseRef.current.previousX = event.clientX;
      mouseRef.current.previousY = event.clientY;
    };
    
    const onMouseUp = () => {
      mouseRef.current.isDown = false;
    };
    
    const onMouseMove = (event) => {
      if (!mouseRef.current.isDown || !cubeRef.current) return;
      
      const deltaX = event.clientX - mouseRef.current.previousX;
      const deltaY = event.clientY - mouseRef.current.previousY;
      
      cubeRef.current.rotation.y += deltaX * 0.01;
      cubeRef.current.rotation.x += deltaY * 0.01;
      
      mouseRef.current.previousX = event.clientX;
      mouseRef.current.previousY = event.clientY;
    };
    
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    
    // Render function
    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();
    
    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  
  // Update light intensity
  useEffect(() => {
    if (sceneRef.current) {
      const light = sceneRef.current.children.find(child => child instanceof THREE.DirectionalLight);
      if (light) {
        light.intensity = lightIntensity;
      }
    }
  }, [lightIntensity]);
  
  // Update wireframe
  useEffect(() => {
    if (cubeRef.current) {
      cubeRef.current.material.wireframe = wireframe;
    }
  }, [wireframe]);
  
  const randomizeOrientation = () => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x = Math.random() * Math.PI * 2;
      cubeRef.current.rotation.y = Math.random() * Math.PI * 2;
      cubeRef.current.rotation.z = Math.random() * Math.PI * 2;
    }
  };
  
  const resetOrientation = () => {
    if (cubeRef.current) {
      cubeRef.current.rotation.set(0, 0, 0);
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">3D Sketching Tool</h1>
        <p className="text-gray-600">Click and drag to rotate the cube</p>
      </div>
      
      <div className="flex gap-6">
        {/* 3D Viewport */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div 
              ref={mountRef} 
              className="w-full flex justify-center cursor-grab active:cursor-grabbing"
              style={{ minHeight: '600px' }}
            />
          </div>
        </div>
        
        {/* Controls */}
        <div className="w-80 space-y-6">
          {/* Orientation Controls */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Orientation</h3>
            <div className="space-y-3">
              <button
                onClick={randomizeOrientation}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Random Orientation
              </button>
              <button
                onClick={resetOrientation}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Reset Orientation
              </button>
            </div>
          </div>
          
          {/* Lighting Controls */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Lighting</h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Light Intensity: {lightIntensity.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Display Options */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Display</h3>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Wireframe</label>
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  wireframe 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {wireframe ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lab;
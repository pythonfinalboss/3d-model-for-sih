import { useState, useRef, useCallback, useEffect } from 'react';

export function useSvgPanZoom(initialViewBox = { x: 0, y: 0, width: 1400, height: 950 }) {
  const [viewBox, setViewBox] = useState(initialViewBox);
  const [isPanning, setIsPanning] = useState(false);
  const startPointRef = useRef({ x: 0, y: 0 });
  const startViewBoxRef = useRef({ ...initialViewBox });
  const svgRef = useRef(null);

  // Update initial viewBox when station changes
  useEffect(() => {
    setViewBox(initialViewBox);
  }, [initialViewBox.width, initialViewBox.height]);

  // Zoom by factor around center or specific client coordinate
  const zoom = useCallback((factor, clientPoint = null) => {
    setViewBox((prev) => {
      const minWidth = 350;
      const maxWidth = 2800;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, prev.width * factor));
      const newHeight = newWidth * (initialViewBox.height / initialViewBox.width);

      let newX, newY;
      if (clientPoint && svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const mouseXRatio = (clientPoint.clientX - rect.left) / rect.width;
        const mouseYRatio = (clientPoint.clientY - rect.top) / rect.height;

        newX = prev.x + (prev.width - newWidth) * mouseXRatio;
        newY = prev.y + (prev.height - newHeight) * mouseYRatio;
      } else {
        newX = prev.x + (prev.width - newWidth) / 2;
        newY = prev.y + (prev.height - newHeight) / 2;
      }

      return {
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      };
    });
  }, [initialViewBox]);

  const zoomIn = useCallback(() => zoom(0.8), [zoom]);
  const zoomOut = useCallback(() => zoom(1.25), [zoom]);

  const resetView = useCallback(() => {
    setViewBox(initialViewBox);
  }, [initialViewBox]);

  // Focus and center on specific building coordinates
  const focusOn = useCallback((x, y, zoomFactor = 0.6) => {
    const targetWidth = initialViewBox.width * zoomFactor;
    const targetHeight = initialViewBox.height * zoomFactor;
    setViewBox({
      x: Math.round(x - targetWidth / 2),
      y: Math.round(y - targetHeight / 2),
      width: Math.round(targetWidth),
      height: Math.round(targetHeight),
    });
  }, [initialViewBox]);

  // Handle Wheel Zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 0.9 : 1.1;
    zoom(factor, { clientX: e.clientX, clientY: e.clientY });
  }, [zoom]);

  // Mouse pan handlers
  const handleMouseDown = useCallback((e) => {
    // Only pan if clicking on background canvas or svg root (button 0)
    if (e.button !== 0) return;
    setIsPanning(true);
    startPointRef.current = { x: e.clientX, y: e.clientY };
    startViewBoxRef.current = { ...viewBox };
  }, [viewBox]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning || !svgRef.current) return;
    const dxClient = e.clientX - startPointRef.current.x;
    const dyClient = e.clientY - startPointRef.current.y;

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = startViewBoxRef.current.width / rect.width;
    const scaleY = startViewBoxRef.current.height / rect.height;

    setViewBox({
      ...startViewBoxRef.current,
      x: Math.round(startViewBoxRef.current.x - dxClient * scaleX),
      y: Math.round(startViewBoxRef.current.y - dyClient * scaleY),
    });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  return {
    viewBox,
    viewBoxString: `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`,
    svgRef,
    isPanning,
    zoomIn,
    zoomOut,
    resetView,
    focusOn,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}

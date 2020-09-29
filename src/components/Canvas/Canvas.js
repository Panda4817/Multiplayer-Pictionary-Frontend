import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css'

const Canvas = () => {

    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current;
        const width = document.querySelector('#canvas').clientWidth;
        const height = document.querySelector('#canvas').clientHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const context = canvas.getContext("2d")
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 5
        contextRef.current = context;
    }, [])

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
    }

    const finishDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
    }

    const draw = ({nativeEvent}) => {
        if(!isDrawing){
        return
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
    }

    function touchstart(event) {
        if (event.target == Canvas) {
            event.preventDefault();
        }
        const {clientX, clientY } = event.touches[0];
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        const x = clientX - canvasDom.left
        const y = clientY - canvasDom.top
        contextRef.current.beginPath()
        contextRef.current.moveTo(x, y)
        setIsDrawing(true)

    }
    function touchmove(event) { 
        if(!isDrawing){
            return
        }
        if (event.target == Canvas) {
            event.preventDefault();
        }
        const {clientX, clientY } = event.touches[0];
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        const x = clientX - canvasDom.left
        const y = clientY - canvasDom.top
        contextRef.current.lineTo(x, y)
        contextRef.current.stroke()
    }
    function touchend() { 
        contextRef.current.closePath()
        setIsDrawing(false)
    }

  return (
    <canvas
        id="realCanvas"
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onTouchStart={touchstart}
        onTouchEnd={touchend}
        onTouchMove={touchmove}
        ref={canvasRef}
    />
  );
}

export default Canvas;

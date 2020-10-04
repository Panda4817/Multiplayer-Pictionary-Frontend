import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css'

const Canvas = ({ 
    canvasDisable,
    reset,
    setReset, 
    emitDrawing,
    playerX, 
    playerY,
    drawType
}) => {

    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [disable, setDisable] = useState(canvasDisable)
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')

    useEffect(() => {
        const canvas = canvasRef.current;
        const width = document.querySelector('#canvas').clientWidth;
        const height = document.querySelector('#canvas').clientHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        setHeight(height);
        setWidth(width);
        const context = canvas.getContext("2d")
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 5
        contextRef.current = context;
        setReset(false)
    }, [reset, setReset])

    useEffect(() => {
        setDisable(canvasDisable);
    }, [canvasDisable])

    useEffect(() => {
        if (drawType === 'start') {
            playerStart(playerX, playerY);
            console.log("start", playerX, playerY)
        }
        else if (drawType === 'move') {
            playerMove(playerX, playerY);
            console.log("drag", playerX, playerY)
        }
        else if (drawType === 'end') {
            playerEnd();
            console.log("end draw")
        }
        
    })

    const startDrawing = ({nativeEvent}) => {
        if (disable) {
            return;
        }
        const {offsetX, offsetY} = nativeEvent;
        
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
        emitDrawing(offsetX/width, offsetY/height, "start")
    }

    const finishDrawing = () => {
        
        contextRef.current.closePath()
        setIsDrawing(false)
        emitDrawing(0, 0, "end")
    }

    const draw = ({nativeEvent}) => {
        if(!isDrawing || disable){
            return;
        }
        const {offsetX, offsetY} = nativeEvent;
        
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
        emitDrawing(offsetX/width, offsetY/height,"move")
    }

    function touchstart(event) {
        if (disable) {
            return;
        }
        if (event.target === Canvas) {
            event.preventDefault();
        }
       
        const {clientX, clientY } = event.touches[0];
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        const x = clientX - canvasDom.left
        const y = clientY - canvasDom.top
        
        contextRef.current.beginPath()
        contextRef.current.moveTo(x, y)
        setIsDrawing(true)
        emitDrawing(x/width, y/height, "start")

    }
    function touchmove(event) { 
        if(!isDrawing || disable){
            return;
        }
        if (event.target === Canvas) {
            event.preventDefault();
        }
        const {clientX, clientY } = event.touches[0];
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        const x = clientX - canvasDom.left
        const y = clientY - canvasDom.top
        contextRef.current.lineTo(x, y)
        contextRef.current.stroke()
        emitDrawing(x/width, y/height, "move")
    }
    function touchend() { 
        
        contextRef.current.closePath()
        setIsDrawing(false)
        emitDrawing(0, 0, "end")
    }

    function playerStart(x, y) {
        contextRef.current.beginPath()
        contextRef.current.moveTo(x*width, y*height)
    }
    
    function playerMove(x, y) {
        contextRef.current.lineTo(x*width, y*height)
        contextRef.current.stroke()
    }

    function playerEnd() {
        contextRef.current.closePath()   
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

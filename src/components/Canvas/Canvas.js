import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css'

const Canvas = ({ 
    canvasDisable,
    reset,
    setReset, 
    startDraw, 
    endDraw, 
    moveDraw, 
    playerX, 
    playerY,
    drawStart,
    drawEnd,
    drawMove
}) => {

    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [disable, setDisable] = useState(canvasDisable)
    const [x, setX] = useState(playerX)
    const [y, setY] = useState(playerY)

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
        setReset(false)
    }, [reset, setReset])

    useEffect(() => {
        setDisable(canvasDisable);
    }, [canvasDisable])

    useEffect(() => {
        setX(() => playerX);
        setY(() => playerY);
    }, [playerX, playerY])

    useEffect(() => {
        if (drawStart === true) {
            playerStart(x, y);
        }
        else if (drawEnd === true) {
            playerEnd();
        }
        else if (drawMove === true) {
            playerMove(x, y);
        }
    }, [x, y, drawEnd, drawMove, drawStart])

    const startDrawing = ({nativeEvent}) => {
        if (disable) {
            return;
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
        startDraw(offsetX, offsetY)
    }

    const finishDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
        endDraw()
    }

    const draw = ({nativeEvent}) => {
        if(!isDrawing || disable){
            return;
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
        moveDraw(offsetX, offsetY)
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
        startDraw(x, y)

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
        moveDraw(x, y)
    }
    function touchend() { 
        contextRef.current.closePath()
        setIsDrawing(false)
        endDraw()
    }

    function playerStart(x, y) {
        contextRef.current.beginPath()
        contextRef.current.moveTo(x, y)
    }
    
    function playerMove(x, y) {
        contextRef.current.lineTo(x, y)
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

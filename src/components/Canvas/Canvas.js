import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css'

const Canvas = ({ 
    canvasDisable,
    reset,
    setReset, 
    emitDrawing,
    data,
    waiting,
    colour,
    lineWidth
}) => {

    const canvasRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [disable, setDisable] = useState(canvasDisable)
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [current, setCurrent] = useState({'x': null, 'y': null});
    const [canvas, setCanvas] = useState(null)
    const [context, setContext] = useState(null)
    const [color, setColor] = useState(colour)
    const [line, setLineWidth] = useState(lineWidth)

    const drawLine = (x0, y0, x1, y1, emit, c, l) => {
        if (context !== null && reset !== true) {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.lineCap = "round"
            context.strokeStyle = c
            context.lineWidth = l
            context.stroke();
            context.closePath();
        }
        

        if (emit) {
            emitDrawing({ 
                'x0': (x0/width), 
                'y0': (y0/height) , 
                'x1': (x1/width), 
                'y1': (y1/height),
                'c': c,
                'l': l
            });
        }
        
    }

    const down = (event, type) => {
        if (disable) {
            return;
        }
        let clientX;
        let clientY;
        if (type === 'mouse') {
            clientX = event.clientX;
            clientY = event.clientY
        } else {
            if (event.target === Canvas) {
                event.preventDefault();
            }
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY
        }
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        const x = clientX - canvasDom.left
        const y = clientY - canvasDom.top
        let c = {'x': x, 'y': y}
        setCurrent(() => c)
        setIsDrawing(true)

    }

    const move = (event, type) => {
        if(!isDrawing || disable){
            return;
        }
        let clientX;
        let clientY;
        let x, y;
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        if (type === 'mouse') {
            clientX = event.clientX;
            clientY = event.clientY
            x = clientX - canvasDom.left
            y = clientY - canvasDom.top
            drawLine(
                current.x, 
                current.y, 
                x,
                y,
                true,
                color,
                line
            );
        } else {
            if (event.target === Canvas) {
                event.preventDefault();
            }
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY
            x = clientX - canvasDom.left
            y = clientY - canvasDom.top
            drawLine(
                current.x, 
                current.y, 
                x,
                y,
                true,
                color,
                line
            );
        }
        
        let c = {'x': x, 'y': y}
        setCurrent(() => c)
        setIsDrawing(true)
    }

    const up = (event, type) => {
        if(!isDrawing || disable){
            return;
        }
        let clientX;
        let clientY;
        let x, y;
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        if (type === 'mouse') {
            clientX = event.clientX;
            clientY = event.clientY
            x = clientX - canvasDom.left
            y = clientY - canvasDom.top
            drawLine(
                current.x, 
                current.y, 
                x,
                y,
                true,
                color,
                line
            );
        } else {
            if (event.target === Canvas) {
                event.preventDefault();
            }
            if (event.touches[0] !== undefined) {
               clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY
                x = clientX - canvasDom.left
                y = clientY - canvasDom.top
                drawLine(
                    current.x, 
                    current.y, 
                    x,
                    y,
                    true,
                    color,
                    line
                ); 
            }
            
        }
        setIsDrawing(false)
    }

    useEffect(() => {
        var canvas = canvasRef.current
        var width = document.querySelector('#canvas').clientWidth;
        var height = document.querySelector('#canvas').clientHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        setCanvas(() => canvas);
        setHeight(height);
        setWidth(width);
        setContext(canvas.getContext('2d'));
        setCurrent({'x': null, 'y': null})
        setReset(false)
    }, [reset, waiting, setReset, canvas, context])

    useEffect(() => {
        setDisable(canvasDisable);
    }, [canvasDisable])

    useEffect(() => {
        if (data !== null && reset === false) {
            drawLine(
                data.x0 * width, 
                data.y0 * height, 
                data.x1 * width, 
                data.y1 * height, 
                false,
                data.c,
                data.l
            );
        }
        
    }, [data])

    useEffect(() => {
        setColor(colour)
    }, [colour])

    useEffect(() => {
        setLineWidth(lineWidth)
    }, [lineWidth])

  return (
    <canvas
        id="realCanvas"
        onMouseDown={event => down(event, 'mouse')}
        onMouseUp={event => up(event, 'mouse')}
        onMouseMove={event => move(event, 'mouse')}
        onTouchStart={event => down(event, 'touch')}
        onTouchEnd={event => up(event, 'touch')}
        onTouchMove={event => move(event, 'touch')}
        ref={canvasRef}
    />
  );
}

export default Canvas;

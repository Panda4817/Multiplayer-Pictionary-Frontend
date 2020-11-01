import React, { useRef, useEffect, useState } from 'react'
import './Canvas.css'

const Canvas = ({
    canvasDisable,
    reset,
    setReset,
    emitDrawing,
    data,
    waiting,
    colour,
    lineWidth,
    undo,
    setUndo
}) => {

    const canvasRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [disable, setDisable] = useState(canvasDisable)
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [current, setCurrent] = useState({ 'x': null, 'y': null })
    const [canvas, setCanvas] = useState(null)
    const [context, setContext] = useState(null)
    const [color, setColor] = useState(colour)
    const [line, setLineWidth] = useState(lineWidth)
    const [resize, setResize] = useState(false)
    const [lines, setLines] = useState([])

    // Function that draws a line on the canvas
    
    const drawLine = (x0, y0, x1, y1, emit, c, l) => {
        if (context !== null && reset !== true) {
            context.beginPath()
            context.moveTo(x0, y0)
            context.lineTo(x1, y1)
            context.lineCap = "round"
            context.strokeStyle = c
            context.lineWidth = l
            context.stroke()
            context.closePath()
        }

        // Only emit that line if drawn by player
        if (emit) {
            let data = {
                'x0': (x0 / width),
                'y0': (y0 / height),
                'x1': (x1 / width),
                'y1': (y1 / height),
                'c': c,
                'l': l
            }
            setLines((lines) => [...lines, data])
            emitDrawing(data)
        }

    }

    const down = (event, type) => {
        if (disable) {
            return
        }
        let clientX
        let clientY
        if (type === 'mouse') {
            clientX = event.clientX
            clientY = event.clientY
        } else {
            event.preventDefault()
            clientX = event.touches[0].clientX
            clientY = event.touches[0].clientY
        }
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        const x = clientX - canvasDom.left
        const y = clientY - canvasDom.top
        let c = { 'x': x, 'y': y }
        setCurrent(() => c)
        setIsDrawing(true)

    }

    const move = (event, type) => {
        if (!isDrawing || disable) {
            return
        }
        let clientX
        let clientY
        let x, y
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        if (type === 'mouse') {
            clientX = event.clientX
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
            )
        } else {
            event.preventDefault()
            clientX = event.touches[0].clientX
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
            )
        }

        let c = { 'x': x, 'y': y }
        setCurrent(() => c)
        setIsDrawing(true)
    }

    const up = (event, type) => {
        if (!isDrawing || disable) {
            return
        }
        let clientX
        let clientY
        let x, y
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        if (type === 'mouse') {
            clientX = event.clientX
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
            )
        } else {
            event.preventDefault()
            if (event.touches[0] !== undefined) {
                clientX = event.touches[0].clientX
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
                )
            }

        }
        setIsDrawing(false)
    }

    const throttle = (callback, delay) => {
        let previousCall = new Date().getTime();
        return function() {
          const time = new Date().getTime();
  
          if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
          }
        };
      };

    useEffect(() => {
        var canvas = canvasRef.current
        var width = document.querySelector('#canvas').clientWidth
        var height = document.querySelector('#canvas').clientHeight
        canvas.width = width
        canvas.height = height
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        setCanvas(() => canvas)
        setHeight(height)
        setWidth(width)
        setContext(canvas.getContext('2d'))
        setCurrent({ 'x': null, 'y': null })
        if (undo === true) {
            setLines((lines) => {lines.slice(0,lines.length - 1)})
        }
        if (reset === true) {
            setLines([])
        }
        if (lines) {
            lines.map((data) => {
                drawLine(
                    data.x0 * width,
                    data.y0 * height,
                    data.x1 * width,
                    data.y1 * height,
                    false,
                    data.c,
                    data.l
                )
                return true
            })
        }
        setResize(false)
        setReset(false)
        setUndo(false)
    }, [reset, waiting, resize, setReset, canvas, undo, setUndo])

    useEffect(() => {
        function handleResize() {
            console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
            setResize(true)

        }

        window.addEventListener('resize', handleResize)
        return _ => {
            window.removeEventListener('resize', handleResize)

        }
    })

    useEffect(() => {
        setDisable(canvasDisable)
    }, [canvasDisable])

    useEffect(() => {
        if (data !== null && reset === false) {
            setLines((lines) => [...lines, data])
            drawLine(
                data.x0 * width,
                data.y0 * height,
                data.x1 * width,
                data.y1 * height,
                false,
                data.c,
                data.l
            )
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
            onMouseMove={event => throttle(move(event, 'mouse'), 10)}
            onMouseOut={event => up(event, 'mouse')}
            onTouchStart={event => down(event, 'touch')}
            onTouchEnd={event => up(event, 'touch')}
            onTouchMove={event => throttle(move(event, 'touch'), 10)}
            onTouchCancel={event => up(event, 'touch')}
            ref={canvasRef}
            className={disable === false ? "noTouch" : ""}
        />
    )
}

export default Canvas

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

    // Canvas states
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
    const [canvasClass, setCanvasClass] = useState('')

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

    // Function handling mouse press or touch
    const down = (event, type) => {
        // Check if disabled
        if (disable) {
            return
        }
        // Set up variables to store coordinates
        let clientX
        let clientY
        // Get the appropriate values dependent on method of drawing
        if (type === 'mouse') {
            clientX = event.clientX
            clientY = event.clientY
        } else {
            event.preventDefault()
            clientX = event.touches[0].clientX
            clientY = event.touches[0].clientY
        }
        // Set the current coordinates of drawing
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        const x = clientX - canvasDom.left
        const y = clientY - canvasDom.top
        let c = { 'x': x, 'y': y }
        setCurrent(() => c)
        setIsDrawing(true)

    }

    // Function handling mouse movement and touch drag
    const move = (event, type) => {
        // Check if canvas is disabled or isDrawing is not true
        if (!isDrawing || disable) {
            return
        }
        // Set up variables to store coordinates
        let clientX
        let clientY
        let x, y
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
        // Get the appropriate values and draw the line on the canvas
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

        
        // Set the current coordinates to that value
        let c = { 'x': x, 'y': y }
        setCurrent(() => c)
        setIsDrawing(true)
    }

    // Function handling mouse up and touch finish
    const up = (event, type) => {
         // Check if canvas is disabled or isDrawing is not true
        if (!isDrawing || disable) {
            return
        }
         // Set up variables to store coordinates
        let clientX
        let clientY
        let x, y
        const canvasDom = document.querySelector('#realCanvas').getBoundingClientRect()
         // Get the appropriate values and draw the final line on the canvas before mouse up/touch finish 
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
        // Set drawing to false as mouse is up/ touch is finished
        setIsDrawing(false)
    }

    // A function to stop overloading the server with drawing data
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

    // Handle resetting and clearing the canvas
    useEffect(() => {
        // Set up canvas
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
        // Check for undo button being pressed
        if (undo === true) {
            setLines(lines => lines.slice(0, -10))
        }
        // Check if reset if pressed
        if (reset === true) {
            setLines([])
        }
        // Check if any data in lines, recreate drawing on the canvas (for resizing canvas)
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
        // Set the variables back to false
        setResize(false)
        setReset(false)
        setUndo(false)
        // eslint-disable-next-line
    }, [reset, waiting, resize, setReset, canvas, undo, setUndo])

    // Handle the resizing of the canvas with view-width changing
    useEffect(() => {
        function handleResize() {
            setResize(true)

        }

        window.addEventListener('resize', handleResize)
        return _ => {
            window.removeEventListener('resize', handleResize)

        }
    })

    // Handles if the canvas is disabled
    useEffect(() => {
        setDisable(canvasDisable)
    }, [canvasDisable])

    // Handles drawing on canvas from emitted data over web sockets
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
        // eslint-disable-next-line
    }, [data])

    // Handles changing brush colour
    useEffect(() => {
        setColor(colour)
    }, [colour])

    // Handles changing line width
    useEffect(() => {
        setLineWidth(lineWidth)
    }, [lineWidth])

    //Handle canvas class string
    useEffect(() => {
        let s = ''
        if (disable === false) {
            s += 'noTouch'
        }
        setCanvasClass(() => s)
    }, [disable])

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
            className={canvasClass}
        />
    )
}

export default Canvas

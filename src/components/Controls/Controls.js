import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons'

const Controls = ({
    changeColour,
    clearCanvas,
    changeWidth,
    controlsDisable,
    lineWidth,
    undoCanvas
}) => {
    // Brush colours
    const colours = [
        "#000000", //black
        "#FF0000", //red
        "#0000FF", //blue
        "#00FFFF", //cyan
        "#008000", //dark green
        "#FFFF00", //yellow
        "#FFA500", //orange
        "#FFC0CB", //light pink
        "#FF0065", //dark pink
        "#800080", //purple
        "#A52A2A", //brown
        "#00FF00", //light green
    ]
    // State to choose if the controls are disabled for a player
    const [disable, setDisable] = useState(false)

    // Handle if the controls are disabled
    useEffect(() => {
        setDisable(controlsDisable)
    }, [controlsDisable])

    return (
        <>
            <div className="row justify-content-around p-2">
                {colours.map((c, i) => {
                    return (
                        <button
                            key={"colour" + i}
                            className="btn btn-outline-light btn-block col-1 m-0"
                            style={{ backgroundColor: c }}
                            type="button"
                            onClick={event => {
                                event.preventDefault()
                                if (!disable) {
                                    changeColour(c)
                                }

                            }
                            }
                        >
                        </button>
                    )
                })}
            </div>
            <div className="row justify-content-around p-2">
                <button
                    className="btn btn-outline-light btn-block col-1 mx-auto my-auto p-0"
                    type="button"
                    onClick={event => {
                        event.preventDefault()
                        if (!disable) {
                            changeColour("#FFFFFF")
                        }

                    }
                    }
                >
                    <FontAwesomeIcon icon={faEraser} className="my-auto"/>
                </button>
                <button
                    className="btn btn-outline-light btn-block col-1 mx-auto my-auto p-0"
                    type="button"
                    onClick={event => {
                        event.preventDefault()
                        if (!disable) {
                            undoCanvas()
                        }

                    }
                    }
                >
                    <FontAwesomeIcon icon={faUndoAlt} className="my-auto"/>
                </button>
                <button
                    className="btn btn-outline-light btn-block col-2 mx-auto my-auto p-0"
                    type="button"
                    onClick={event => {
                        event.preventDefault()
                        if (!disable) {
                            clearCanvas()
                        }

                    }
                    }
                >
                    Clear
            </button>
                <FontAwesomeIcon icon={faCircle} style={{ fontSize: "5px" }} className="col-1 mx-auto my-auto p-0" />
                <input
                    type="range"
                    className="custom-range col-4 my-auto"
                    min="5"
                    max="50"
                    defaultValue={lineWidth}
                    onChange={
                        event => {
                            changeWidth(event.target.value)
                        }
                    }
                ></input>
                <FontAwesomeIcon icon={faCircle} style={{ fontSize: "50px" }} className="col-1 mx-auto my-auto p-0" />
            </div>
        </>
    )
}

export default Controls
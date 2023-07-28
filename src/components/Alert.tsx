import React, {useState} from "react";
import { AlertProps } from "../types";
import colors from "../assets/colors";



export default function Alert({show, alert}: AlertProps) {
    const end =  [
        'Amazing!',
        'Wow!',
        'Impressive!',
        'Not Bad!',
        'Good Job!',
        "That's It!",
        'Oh No!'
    ]

    return (
        <div className='alert shake' style={{display: show ? 'flex' : 'none'}}>
            <strong>{alert.substring(0,3) === 'end' ?  end[Number(alert.substring(3))]: alert}</strong>
        </div>
    )

}
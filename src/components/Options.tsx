import React from "react";
import { OptionsProps } from "../types";
import { Modal } from "react-bootstrap";
import colors from "../assets/colors";

export default function Options({show, hide, contrast, setContrast, hard, setHard}: OptionsProps) {
    const colorKey: string[] = contrast ? colors.highC : colors.reg
    const color = contrast ? '#f5793a' : '#1e8326';
    

    return (
        <Modal show={show} onHide={hide}>
            <Modal.Header closeButton closeVariant="white">
            </Modal.Header>
            <Modal.Body>
                <h1>Settings</h1>
                <div className="optionsLine">
                    <h6>High Contrast</h6>
                    <label className='toggleLabel'>
                        <input type="checkbox" className='toggleInput' checked={contrast} onChange={()=>setContrast()}/>
                        <span className='toggleSpan' style={{backgroundColor: contrast ? color : '#2c3e50'}}/>
                    </label>
                </div>
                <hr/>
                <div className="optionsLine">
                    <div>
                        <h6>Hard Mode</h6>
                        <p className='optionsLineDetail'>All hints must be used in subsequent guesses</p>
                    </div>
                    <label className='toggleLabel'>
                        <input type="checkbox" className='toggleInput' checked={hard} onChange={()=>setHard()}/>
                        <span className='toggleSpan'  style={{backgroundColor: hard ? color : '#2c3e50'}}/>
                    </label>
                </div>
            </Modal.Body>
        </Modal>
    )

}
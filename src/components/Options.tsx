import React from "react";
import { OptionsProps } from "../types";
import { Modal } from "react-bootstrap";
import colors from "../assets/colors";

export default function Options({show, hide, setContrast, contrast}: OptionsProps) {
    const colorKey: string[] = contrast ? colors.highC : colors.reg

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
                        <span className='toggleSpan'/>
                    </label>
                </div>
            </Modal.Body>
        </Modal>
    )

}
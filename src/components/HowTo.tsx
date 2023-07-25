import React, {useState, useEffect} from "react";
import { ModalProps } from "../types";
import { Modal } from "react-bootstrap";
import colors from "../assets/colors";


export default function HowTo({show, hide, contrast}: ModalProps) {

    const colorKey: string[] = contrast ? colors.highC : colors.reg

    return (
        <Modal show={show} onHide={hide}>
            <Modal.Header closeButton closeVariant="white" >
            </Modal.Header>
            <Modal.Body>
                <h1>How To Play</h1>
                <h3>Guess the word in 6 tries</h3>
                <ul>
                    <li>Each guess must be a valid 5-letter word</li>
                    <li>The color of the tiles will change to show how close your guess was</li>
                </ul>
                <h6>Examples</h6>
                <ExampleLine word={'WRECK'} color={colorKey[1]} tile={0} contrast={contrast}/>
                <p>W is in the correct spot </p>
                <ExampleLine word={'PLANT'} color={colorKey[2]} tile={1} contrast={contrast}/>
                <p>L is in the word but in the wrong spot</p>
                <ExampleLine word={'VAGUE'} color={colorKey[0]} tile={3} contrast={contrast}/>
                <p>U is not in the word</p>
            </Modal.Body>
        </Modal>
    )

}

interface ExampleLineProps {
    word: string,
    color: string,
    tile: number,
    contrast: boolean,
}
function ExampleLine ({ word, color, tile, contrast}: ExampleLineProps) {
    const [flip, setFlip] = useState(false)
    useState(() => {
        setTimeout(()=>setFlip(true), 200)
    })
    
    const colorKey: string[] = [
        '#454545',
        '#e26060',
        '#7bc0ee',
    ]

    return (<>
            {/* <button onClick={()=>{setReveal(!reveal); console.log(reveal)}}> revss</button> */}
        <div className="ExampleLine">
            
            {word.split('').map((letter, n) => 

            <div key={`${word}-${n}`} className='tileCon letterBox'>

                <div className={(flip && n === tile) ? 'tileP flipper' : 'tileP'} > 
                    <div className="tileF letterFront">
                        {letter}</div>
                    <div className="tileB letterBack"  
                        style={{backgroundColor: n === tile ? color : 'none'}}>
                       {letter}</div>

                </div>
            </div>
            )}
        </div>
        </>
    )
}


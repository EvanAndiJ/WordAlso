import React, { useState, useEffect } from "react";
import colors from "../assets/colors";

interface KeyboardProps {
    onPress: (key: string)=>void,
    guessed: string[],
    colorKey: {[index:string]: number},
    contrast: boolean,

}
function Keyboard ({onPress, guessed, colorKey, contrast}: KeyboardProps) {
    const [alpha, setAlpha] = useState<string>('')
    const row1 = 'QWERTYUIOP'
    const row2 = 'ASDFGHJKL'
    const row3 = 'ZXCVBNM'
    const colorCodes: string[] = contrast ? colors.highC : colors.reg

    useEffect(()=> {
        guessed.forEach((guess, i) => {
            setAlpha(alpha + guess)
        })
        
    }, [guessed])

    const handleKeyPress = (event: React.MouseEvent<HTMLButtonElement>) => {
        const key = event.currentTarget.name
        onPress(key)
    }
    
    return (
        <div id='keyboard'>
            <div className='kbRow'>
                {row1.split('').map(letter => 
                <button name={letter} key={letter} className='kbKey'
                style={letter in colorKey ? {backgroundColor: colorCodes[colorKey[letter]]} : undefined}
                onClick={handleKeyPress}>{letter}</button>)}
            </div>
            <div className='kbRow'>
                {row2.split('').map(letter => 
                <button name={letter} key={letter} className='kbKey'
                style={letter in colorKey ? {backgroundColor: colorCodes[colorKey[letter]]} : undefined}
                onClick={handleKeyPress}>{letter}</button>)}
            </div>
            <div className='kbRow'>
                <button name='enter' className='kbKey enterKey' onClick={handleKeyPress}>ENTER</button>
                {row3.split('').map(letter => 
                <button name={letter} key={letter} className='kbKey'
                style={letter in colorKey ? {backgroundColor: colorCodes[colorKey[letter]]} : undefined}
                onClick={handleKeyPress}>{letter}</button>)}
                <button name='Backspace' className='kbKey backKey' onClick={handleKeyPress}>Back</button>
            </div>

        </div>
    )
}

export default Keyboard;
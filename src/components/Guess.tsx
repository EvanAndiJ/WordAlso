import React, {useEffect, useState} from "react";
import colors from "../assets/colors";
import { GuessProps, GuessLineProps } from "../types";



export default function Guess({currentGuess, prevGuess, winWord, guessNum, shake, win, contrast, children}: GuessProps) {
    
    return (
       <div className="GuessDiv">
        <div className='alertDiv'>{children}</div>
           {[0,1,2,3,4,5].map(line => 
           <GuessLine 
           line={line}  key={line}
           isCurrent={prevGuess.length === line ? true : false}
           word={prevGuess.length === line ? currentGuess : prevGuess[line]}
           winWord={winWord}
           reveal={ guessNum <= line ? true : false }
           bounce={(win && guessNum-1 === line) ? true : false}
           shake={(shake && guessNum === line) ? true : false}
           contrast={contrast}
           />
           )}

       </div>
    )
}

function GuessLine ({isCurrent, line, word, winWord, reveal, bounce, shake, contrast}: GuessLineProps) {
    const [colorCode, setColorCode] = useState<number[]>([])
    // const [colorObj, setColorObj] = useState<{[index: string]:number}>({})
    const [winKey, setWinKey] = useState<{[index: string]: number}>({})
    const [wordKey, setWordKey] = useState<{[index: string]: number}>({})
    const [classes, setClasses] = useState<string>('letterBox')
    
    useEffect(()=>{
        if (!Object.values(winKey).length) {
            const key: {[index: string]: number} = {}
            winWord.split('').map(letter => letter in key ? key[letter]++ : key[letter] = 1)
            setWinKey(key);
        }
        const colors: number[] = []
        if (word) {   
            const key: {[index: string]: number} = {}
            word.split('').map(letter => letter in key ? key[letter]++ : key[letter] = 1)   
            setWordKey(key)     
            const wordCheck = winWord.split('')

            word.split('').forEach((letter, n) => {
            let code = 0
            if (letter === winWord[n]) {
                if (word.substring(0, n).includes(letter)) {
                    const i = word.indexOf(letter)
                    if (!(word.substring(n+1).includes(letter))) {
                        if (colors[i] != 1) {
                            colors.splice(i,1,0)
                        }
                    } else {
                        colors.splice(i,1,2)
                    }
                }
                code = 1
            } else
            if (wordCheck.includes(letter)) {
                if ((winKey[letter] <= wordKey[letter] && !word.substring(0,n).includes(letter)) || !word.substring(0,n).includes(letter)) {
                    
                    code = 2
                }
            } 
            colors.push(code)
            })
            setColorCode(colors)
        } 
        else {
            setWordKey({})
        }
        if (bounce) {
            setClasses(classes + ' bounce')
            // setTimeout(()=>{
            //     // classes.pop()
            //     setClasses(classes.substring(0,9))
            // }, 2000)
        }
        if (shake) {
            setClasses(classes + ' shake')
            setTimeout(()=>{
                setClasses(classes.substring(0,9))
            }, 1000)
        }
    },[word, bounce, shake])

    const colorKey: string[] = contrast ? colors.highC : colors.reg
    // const colorKey: string[] = [
    //     '#454545',
    //     '#f5793a',
    //     '#7bc0ee',
    // ] 

    return (<>
        <div className="GuessLine ">

            {[0,1,2,3,4].map(n => 

            <div key={`g${line}-${n}`} id={`g${line}-${n}`} className={classes}>

                <div className={ reveal ? `tileP` : 'tileP flipper' } > 
                    <div className="tileF letterFront">
                        {(word && word[n]) ? word[n] : null}</div>

                    <div className="tileB letterBack" style={(word && !isCurrent) ? {backgroundColor: colorKey[colorCode[n]]} : {}}>
                        {(word && word[n]) ? word[n] : null}</div>
                </div>
            </div>
            )}
        </div>
        </>
    )
}


import { useState } from "react";
import words from '../assets/words'

const useGame = () => {
    const newObj = {
        date: Date(), 
        id: Math.floor(Math.random()*words.answers.length), 
        words: [],
        kb: {}, 
        prevColors: [], 
        hard: false,
        hardReq: [],
        contrast: false,
    }

    const getGuessed = () => {
        let guessedString: string | null = localStorage.getItem('wordGuessed')
        if (!guessedString) { 
            localStorage.setItem('wordGuessed', JSON.stringify(newObj)) 
            return newObj
        } else {
            const guessedObj = JSON.parse(guessedString)
            const today = new Date()
            const old =  new Date(Date.parse(guessedObj.date))
            if (today.getDate() > old.getDate() || today.getMonth() > old.getMonth() || today.getFullYear() > old.getFullYear()) {
                localStorage.setItem('wordGuessed', JSON.stringify(newObj)) 
                return newObj
            }
            return JSON.parse(guessedString)
        }
    }

    const [game, setGame] = useState(getGuessed())
    
    //@ts-ignore
    const saveGame = (guessed) => {
        guessed.date = Date()
        localStorage.setItem('wordGuessed', JSON.stringify(guessed))
        setGame(guessed)
    }

    return {
        game,
        setGame: saveGame,
    }
}

export default useGame;
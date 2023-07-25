import { useState } from "react";

const useGuessed = () => {
    const getGuessed = () => {
        let guessedString: string | null = localStorage.getItem('wordGuessed')
        if (!guessedString) { localStorage.setItem('wordGuessed', JSON.stringify({guessed:[]})) }
        return guessedString ? JSON.parse(guessedString) : [];
    }

    const [guessed, setGuessed] = useState(getGuessed())
    
    //@ts-ignore
    const saveGuessed = (guessed) => {
        localStorage.setItem('wordGuessed', JSON.stringify(guessed))
        setGuessed(guessed)
    }

    return {
        guessed,
        setGuessed: saveGuessed,
    }
}

export default useGuessed;
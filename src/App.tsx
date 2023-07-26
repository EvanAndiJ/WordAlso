import logo from './logo.svg';
import './App.css';
import words from './assets/words'
import React, {useState, useEffect} from 'react';
import { Modal } from 'react-bootstrap';
//@ts-expect-error
import useKeypress from 'react-use-keypress';
import useStats from './hooks/useStats';
import useGame from './hooks/useGame';

import Guess from './components/Guess';
import Keyboard from './components/Keyboard';
import HowTo from './components/HowTo';
import Stats from './components/Stats';
import Options from './components/Options';
import { stringify } from 'querystring';


function App() {
  // @ts-expect-error
  useKeypress('abcdefghijklmnopqurstuvwxyz'.split(''), (e)=>{ handleKeyPress(e.key)})
  //@ts-expect-error
  useKeypress('Backspace', (e)=>{ handleKeyPress(e.key)})
  //@ts-expect-error
  useKeypress('Enter', (e)=>{ handleKeyPress('enter')})
  
  // const [winWord, setWinWord] = useState<string>(words.answers[Math.floor(Math.random()*words.answers.length)].toUpperCase())
  const [winWord, setWinWord] = useState<string>('start') 

  const [currentGuess, setCurrentGuess] = useState<string>('')
  const {game, setGame} = useGame() //This should probably replace PrevGuess
  const [prevGuess, setPrevGuess] = useState<string[]>([])
  
  const [currentColors, setCurrentColors] = useState<number[]>([])
  const [prevColors, setPrevColors] = useState<number[][]>([])
  const [kbColorKey, setKbColorKey] = useState<{[index: string]:number}>({})
  

  const [guessNum, setGuessNum] = useState(0)
  const [shake, setShake] = useState(false)
  const [play, setPlay] = useState(true)
  const [win, setWin] = useState(false)
  
  const [hard, setHard] = useState(false)
  const toggleHard = () => {
    setGame({...game, hard: !hard})
    setHard(!hard)
  }
  const [contrast, setContrast] = useState(true)
  const toggleContrast = () => {
    setGame({...game, contrast: !contrast})
    setContrast(!contrast)
  }

  const {stats, setStats} = useStats()
  const [showStats, setShowStats] = useState(false)
  // CHANGE HOW TO BACK TO TRUE INITIAL STATE
  const [howTo, setHowTo] = useState(true)
  const [options, setOptions] = useState(false)

  useEffect(()=>{
    if (winWord === 'start') {
      const win = words.answers[game.id].toUpperCase()
      setWinWord(win)
      setPrevGuess(game.words)
      setGuessNum(game.words.length)
      setPrevColors(game.prevColors)
      setContrast(game.contrast)
      setHard(game.hard)
      setTimeout(()=>{setKbColorKey(game.kb)}, 2500)
      if (game.words.includes(win)) {
        setPlay(false)
        setWin(true)
      }
    }
    
    //needed to record whole game, for sharing results
    const colors: number[] = []
    if (currentGuess) {  
        currentGuess.split('').forEach((letter, n) => {
        let code = 0
        if (letter === winWord[n].toUpperCase()) {
            code = 1
        } else
        if (winWord.includes(letter.toUpperCase())) {
            code = 2
        } 
        colors.push(code)
        })
        setCurrentColors(colors)
    }
    
  },[currentGuess])

  const toggleHowTo = () => {
    setHowTo(!howTo)
  }
  const toggleStats = () => {
    setShowStats(!showStats)
  }
  const toggleOptions = () => {
    setOptions(!options)
  }
  const submitGuess = () => {
    const guess = currentGuess.toLocaleLowerCase()

    if (words.allowed.includes(guess) || words.answers.includes(guess)) {

      setPrevGuess([...prevGuess, currentGuess])
      setPrevColors([...prevColors, currentColors])

      const newColors = {...kbColorKey}
      currentGuess.split('').forEach((letter, i) => {
        if (!(letter in newColors) || newColors[letter] != 1) { 
          newColors[letter] = currentColors[i] 
        }
      })

      setGame({
        words: [...game.words, currentGuess], 
        kb: newColors, 
        id: game.id, 
        prevColors:[...prevColors, currentColors], 
        contrast: contrast,
        hard: hard,
      })
      setTimeout(()=>{setKbColorKey(newColors)}, 2500)

      let g = guessNum+1
      setGuessNum(g)

      const isWin = currentGuess === winWord
      if (isWin || g === 6) { 
        
        setPlay(false)
        let newStats = stats
        newStats.total += 1
        if (isWin) { setWin(true) }


        if (g === 6 && !isWin) {
          newStats.loss = newStats.loss + 1
          newStats.current = 0
        } else {
          newStats.current += 1
          newStats.dist[g-1] = newStats.dist[g-1] + 1
        }
        if (newStats.current > newStats.max) { newStats.max = newStats.current }

        setStats(newStats)
        setTimeout(()=>setShowStats(true), isWin ? 3600 : 1700)
      }  
      
      setCurrentGuess('')
      setCurrentColors([])
    } 
    else {
      setShake(true)
      setTimeout(()=>setShake(false), 1)
    }
  }
  const handleKeyPress = (key: string) => {
    const code = key.toLowerCase().charCodeAt(0)
    if (play) {
      if (key === 'Backspace' && currentGuess.length>0) {
        setCurrentGuess(currentGuess.substring(0, currentGuess.length-1))
      } else 
      if (key === 'enter') {
        submitGuess()
      } else
      if (currentGuess.length < 5 && code > 96 && code < 123 && key.length === 1) {
        setCurrentGuess(currentGuess + key.toUpperCase())
      }
    }
  }
  const copyResults = () => {
    const guesses = win ? guessNum : 0
    let uniGraph = `WordAlso ${guesses}/6\n\n`
    //copy results to the clipboard to share on social media
    if (!play) {

      // const rainbow = `\u{1f308}`
      const green = `\u{1F7E9}`
      const yellow = `\u{1F7E8}`
      const red = `\u{1F7E5}`
      const blue = `\u{1F7E6}`
      const black = `\u{2B1B}`
      const key: {[index:number]: string} = {
        0: black,
        1: contrast ? red : green,
        2: contrast ? blue : yellow
      }
      prevColors.forEach(row => {
        let uniRow = ``
        row.map(block => uniRow = uniRow + key[block])
        uniGraph = uniGraph + uniRow + `\n`
      })
      navigator?.clipboard.writeText(uniGraph)
    }

  }
  
  
  return (
    <div className="App">
      <header className="App-header">
        <h1 className={'title'}>WordAlso</h1>
        <div className="headerButtonsDiv">
          <button className="headerButtons" onClick={toggleHowTo}><img src="question-circle-white.svg" alt="How To Play"/></button>
          <button className="headerButtons" onClick={toggleStats}><img src="bar-chart-fill-white.svg" alt="Stats"/></button>
          <button className="headerButtons" onClick={toggleOptions}><img src="gear-fill-white.svg" alt="Optpions"/></button>
        </div>
      </header>
      <hr/>
      <main>

        {/* <button onClick={()=>console.log(winWord)}>app</button>  */}
        <Guess 
          currentGuess={currentGuess} 
          prevGuess={prevGuess} 
          winWord={winWord}
          guessNum={guessNum} 
          win={win}
          bounce={false}
          shake={shake}
          contrast={contrast}
        />
          
        <Keyboard 
          onPress={handleKeyPress} 
          guessed={prevGuess} 
          colorKey={kbColorKey} 
          contrast={contrast}
        />

        <HowTo 
          show={howTo} hide={toggleHowTo}
          contrast={contrast}
        />

        <Stats show={showStats} hide={toggleStats} contrast={contrast}
          stats={stats} onShare={copyResults} 
          thisGame={guessNum} play={play} win={win}
        /> 
          
        <Options show={options} hide={toggleOptions}
          setContrast={toggleContrast} contrast={contrast}
          setHard={toggleHard} hard={hard}
        />

      </main>
    </div>
  );
}

export default App;

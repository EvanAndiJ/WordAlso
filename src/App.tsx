import logo from './logo.svg';
import howToIcon from './img/question-circle-white.svg'
import gearIcon from './img/gear-fill-white.svg'
import statsIcon from './img/bar-chart-fill-white.svg'
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
//@ts-ignore
import Alert from './components/Alert';


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
  

  const [guessNum, setGuessNum] = useState<number>(0)
  const [shake, setShake] = useState<boolean>(false)
  const [play, setPlay] = useState<boolean>(true)
  const [win, setWin] = useState<boolean>(false)
  
  const [hard, setHard] = useState<boolean>(false)
  const [hardReq, setHardReq] = useState<string[]>([])
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
  const [showHowTo, setShowHowTo] = useState(true)
  const [showOptions, setShowOptions] = useState(false)

  const [alert, setAlert] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const toggleAlert = (alert: string) => {
    setAlert(alert)
    setShowAlert(true)
    setTimeout(()=>{
      setShowAlert(false)
      setAlert('')
    }, 800)
  }
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
    setShowHowTo(!showHowTo)
  }
  const toggleStats = () => {
    setShowStats(!showStats)
  }
  const toggleOptions = () => {
    setShowOptions(!showOptions)
  }
  const submitGuess = () => {
    const guess = currentGuess.toLocaleLowerCase()

    if (!words.allowed.includes(guess) && !words.answers.includes(guess)) { 
      setShake(true)
      setTimeout(()=>setShake(false), 1)
      toggleAlert('Not in word List')
      return
    } 

    if (hard) {
      const check = currentGuess.split('')
      for (let i=0, len=hardReq.length; i < len; i++) {
        const letter = hardReq[i]
        if (check.includes(letter)) {
          check.splice(check.indexOf(letter),1)
        } else {
          setShake(true)
          setTimeout(()=>setShake(false), 1)
          toggleAlert(`Word must contain ${letter}`)
          return
        }
      }
    }

    const newColors = {...kbColorKey}
    const newReq: string[] = []
    currentGuess.split('').forEach((letter, i) => {
      if (!(letter in newColors) || newColors[letter] != 1) { 
        newColors[letter] = currentColors[i] 
      }
      if (newColors[letter] > 0) {
        newReq.push(letter)
      }
    })

    

    setPrevGuess([...prevGuess, currentGuess])
    setPrevColors([...prevColors, currentColors])
    setGame({
      words: [...game.words, currentGuess], 
      kb: newColors, 
      id: game.id, 
      prevColors:[...prevColors, currentColors], 
      contrast: contrast,
      hard: hard,
      hardReq: newReq,
    })
    setHardReq(newReq)
    setTimeout(()=>{setKbColorKey(newColors)}, 2500)

    let g = guessNum+1
    setGuessNum(g)

    const isWin = currentGuess === winWord
    if (isWin || g === 6) { 
      
      setPlay(false)
      toggleAlert(`end${g}`)
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

          <button className="headerButtons" onClick={toggleHowTo}>
            <img src={howToIcon} alt="How To Play"/>
          </button>

          <button className="headerButtons" onClick={toggleStats}>
            <img src={statsIcon} alt="Stats"/>
          </button>
          
          <button className="headerButtons" onClick={toggleOptions}>
            <img src={gearIcon} alt="Options"/>
          </button>
        </div>
      </header>
      <hr/>
      <main>
        
        <Guess 
          currentGuess={currentGuess} 
          prevGuess={prevGuess} 
          winWord={winWord}
          guessNum={guessNum} 
          win={win}
          bounce={false}
          shake={shake}
          contrast={contrast}
        >
          <Alert show={showAlert} alert={alert} />
        </Guess>
          
        <Keyboard 
          onPress={handleKeyPress} 
          guessed={prevGuess} 
          colorKey={kbColorKey} 
          contrast={contrast}
        />

        <HowTo 
          show={showHowTo} hide={toggleHowTo}
          contrast={contrast}
        />

        <Stats show={showStats} hide={toggleStats} contrast={contrast}
          stats={stats} onShare={copyResults} 
          thisGame={guessNum} play={play} win={win}
        /> 
          
        <Options show={showOptions} hide={toggleOptions}
          setContrast={toggleContrast} contrast={contrast}
          setHard={toggleHard} hard={hard}
        />

      </main>
    </div>
  );
}

export default App;

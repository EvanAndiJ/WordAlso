import { ReactElement } from "react"
import { JsxElement } from "typescript"

export interface AlertProps {
    show: boolean,
    alert: string,

}
export interface GuessProps {
    currentGuess: string, 
    prevGuess: string[],
    winWord: string,
    guessNum: number,
    shake: boolean,
    bounce: boolean,
    win: boolean,
    contrast:boolean,
    children: ReactElement
}
export interface GuessLineProps {
    isCurrent: boolean,
    line: number,
    word: string,
    winWord: string,
    reveal: boolean,
    shake: boolean,
    bounce: boolean,
    contrast:boolean,
}

export interface ModalProps {
    show: boolean,
    hide: ()=>void
    contrast: boolean,
}
export interface StatsObj {
    dist: number[]
    loss: number,
    total: number,
    current: number,
    max: number,
}
export interface StatsProps extends  ModalProps {
    stats: StatsObj,
    onShare: ()=>void,
    thisGame: number,
    play: boolean,
    win: boolean,
}

export interface OptionsProps extends ModalProps {
    setContrast: ()=>void,
    hard: boolean,
    setHard: ()=>void,
}

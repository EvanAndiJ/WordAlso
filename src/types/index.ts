
export interface GuessProps {
    currentGuess: string, 
    prevGuess: string[]
}
export interface GuessLineProps {
    isCurrent: boolean,
    line: number,
    word: string,
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
    // contrast: boolean,
}
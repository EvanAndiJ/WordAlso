import React, { useState, useEffect } from "react";
import { StatsObj, StatsProps } from "../types";
import { Modal } from "react-bootstrap";
import useStats from "../hooks/useStats";

export default function Stats({show, hide, stats, onShare, thisGame, play, win}: StatsProps) {
    const [dist, setDist] = useState<number[]>([])

    useEffect(()=>{
        const bars: number[] = []
        
        if (show) {
            const most = stats.dist.reduce((a,b)=> a > b ? a : b)
            stats.dist.forEach((num, i)=>{
                let y = 6
                if (num)  {
                    y = Math.floor((num/most)*100)
                }
                bars.push(y)
            })
            setDist(bars)
        }
    },[show])
    return (
        <Modal show={show} onHide={hide} className='statsModal' >
            <Modal.Header closeButton closeVariant="white" className="statsHeaderClear">
            </Modal.Header>
            <Modal.Body >
            <div className='statsBody'>
                <h1>Statistics</h1>
                    <div className="statsCon">
                        {/* <div><span>Statistics</span></div> */}
                        <div className="statsBox">
                            <div className='statSlot'>
                                <p>{stats.total}</p>
                                <p>Played</p>
                            </div>
                            <div className='statSlot'>
                                <p>{Math.round(((stats.total - stats.loss) / stats.total)*100)}</p>
                                <p>Win %</p>
                            </div>
                            <div className='statSlot'>
                                <p>{stats.current}</p>
                                <p>Current Streak</p>
                            </div>
                            <div className='statSlot'>
                                <p>{stats.max}</p>
                                <p>Max Streak</p>
                            </div>
                        </div>
                    </div>
                    <div className='graphBox'>
                        <h6>Guess Distribution</h6>
                        {[0,1,2,3,4,5].map(num =>
                        <div key={`graphline${num}`} className='graphLine'>
                            <div className='graphLabel'>{num+1}</div>
                            <div id={`graphBar${num}`} className='graphBar'
                                style={{width:`${dist[num]}%`, backgroundColor: (win && num === thisGame-1) ? '#e26060' : '#454545'}}>
                                    {stats.dist[num]}</div>
                        </div>
                        )}
                    </div>
                    <button onClick={onShare} className='shareButton'>
                        <span>Share</span>
                        <img src="share-fill-white.svg" alt="Share"/>
                    </button>

            </div>
            </Modal.Body>
        </Modal>
    )

}
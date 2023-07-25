import { useState } from "react";
import { StatsObj } from "../types";

// const newStats = {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, total:0, current:0, max:0}
const newStats = {dist: [0, 0, 0, 0, 0, 0], total:0, loss:0, current:0, max:0}

const useStats = () => {
    const getStats = () => {
        let statsString: string | null = localStorage.getItem('wordStats')
        if (!statsString) { localStorage.setItem('wordStats', JSON.stringify(newStats)) }
        return statsString ? JSON.parse(statsString) : newStats;
    }

    const [stats, setStats] = useState(getStats())
    
    const saveStats = (stats: StatsObj) => {
        localStorage.setItem('wordStats', JSON.stringify(stats))
        setStats(stats)
    }

    return {
        stats,
        setStats: saveStats,
    }
}

export default useStats;
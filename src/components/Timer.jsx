import React, {useState, useEffect} from 'react';

export default function Timer(props){

    //секунды
    const [sec, setSec] = useState(props.time)

    useEffect(() => {
        const time = sec > 0 && setInterval(() => setSec(prevSec => prevSec - 1), 1000)
        if(sec < 1) return props.hideDices()
        return () => {
            clearInterval(time)
        }
    }, [sec])

    useEffect(() => {
        setSec(props.time)
    }, [props.lvl])

    return (
        <div className="timer">{sec === 0 ? props.langText(12) : sec}</div>
    )
}
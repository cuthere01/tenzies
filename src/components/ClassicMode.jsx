import  { React, useState, useEffect } from 'react';
import ClassicDie from "./ClassicDie"
import { nanoid } from 'nanoid';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import levelData from '../data/levelData';
import Timer from './Timer';

export default function ClassicMode(props){

    //Уровень
    const [lvl, setLvl] = useState(1)

    //Клетки
    const [dices, setDices] = useState(allNewDices())

    //Прогресс игры
    const [tenzies, setTenzies] = useState(false)

    //Текущее значение клетки
    const [current, setCurrent] = useState(false)

    //Таймер
    const [toggleTimer, setToggleTimer] = useState(props.start)

    //Следит за прогрессом игры
    useEffect(() => {
        const allHeld = dices.every(die => die.isHeld)
        const allRight = dices.every(die => !die.isError)
        if(allHeld && allRight){
            setTenzies(2)
        } else if(allHeld || dices.find((die) => die.isError)){
            setTenzies(1)
        }
    }, [dices])

    //Генерирует новую клетку
    function genNewDie(){
        return ({
            value: Math.floor(Math.random()*levelData.data[lvl-1].gen+1),
            isHeld: false,
            isHidden: false,
            isError: false,
            isDis: true,
            id: nanoid()
        })
    }

    //Создает новые клетки
    function allNewDices(){
        const newDices = []
        for(let i=0; i<levelData.data[lvl-1].dices; i++){
            newDices.push(genNewDie())
        }
        return newDices
    }
    
    //Следит за текущей серией клеток
    function checkDices(){
        const allCurrent = []
        dices.forEach(die => {
            if(die.value === current){
                allCurrent.push(die)
            }
        })
        if(allCurrent.every((die) => die.isHeld)) {
            setCurrent(false)
            //success(allCurrent)
            return false
        }
        else return current
    }

    //свойства клетки
    function dieData(die, isHeld, isError){
        return ({
            ...die, 
            isHeld: isHeld, 
            isHidden: false,
            isError: isError,
        })
    }

    //Меняет статус клетки с id
    function holdDice(id){
        setDices(prevDices => prevDices.map(die => {
            if(die.id === id){
                const curr = checkDices()
                if(!curr){
                    setCurrent(die.value)
                    return dieData(die, true, false)
                }
                return (
                    die.value === curr ? dieData(die, true, false) : dieData(die, true, true)
                )
            } else{
                return die
            }
        }))
    }

    //Очистка уровня
    function clearLvl(){
        setTenzies(false)
        setCurrent(false)
        setToggleTimer(prevToggleTimer => !prevToggleTimer)
        setDices(allNewDices())
    }

    //Запускает следующий уровень
    function nextLvl(){
        setLvl(prevLvl => prevLvl + 1)
        clearLvl()
    }

    //скрыть клетки
    function hideDices(){
        setDices(prevDices => prevDices.map(die => ({...die, isHidden: !die.isHidden, isDis: !die.isDis})))
        setTimeout(() => {
            setToggleTimer(prevToggleTimer => !prevToggleTimer)
        }, 1000)
    }

    //начать игру
    function start(){
        setLvl(1)
        clearLvl()
    }

    //нужен для обновления клеток при новом уровне
    useEffect(() => {
        setDices(allNewDices())
    }, [lvl])

    //Преобразует массив компонентов на основе клеток
    const diceElements = dices.map((die,i) => 
        <ClassicDie 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld}
            isHidden={die.isHidden}
            isError={die.isError}
            isDis={die.isDis}
            holdDice={()=>holdDice(die.id)}
            
        />
    )

    return(
        <div className="container">
            {        
                tenzies === 2 && 
                <Confetti 
                    width={useWindowSize.width} 
                    height={useWindowSize.height} 
                    recycle={false}
                    numberOfPieces={800}
                    gravity={.3}
                />
            }
            <section className="game">
                {
                    (toggleTimer) &&
                    <Timer 
                        time={levelData.data[lvl-1].time} 
                        lvl={lvl} 
                        hideDices={hideDices}
                        langText={props.langText}
                    />
                }
                <div className="game__block">
                    <h2>{props.langText(8)} {lvl}</h2>
                    <div className={`game__field grid${levelData.data[lvl-1].cols}`}>
                        {diceElements}
                    </div>
                    {
                        tenzies === 2 && lvl === levelData.info.NumberOfLevels &&
                        <button className="main-button" onClick={() => start()}>
                            {props.langText(11)}
                        </button>
                    }
                    {
                        tenzies === 2 && lvl !== levelData.info.NumberOfLevels &&
                        <button className="main-button" onClick={() => nextLvl()}>
                            {props.langText(9)}
                        </button>
                    }
                    {
                        tenzies === 1 &&
                        <button className="main-button" onClick={() => clearLvl()}>
                            {props.langText(10)}
                        </button>
                    }
                    {/* <button className="main-button" onClick={() => hideDices()}>
                        hide
                    </button> */}
                </div>
            </section>  
        </div>
    )
}


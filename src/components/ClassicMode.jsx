import React from 'react';
import ClassicDie from "./ClassicDie"
import { nanoid } from 'nanoid';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import levelData from './levelData';
import Timer from './Timer';

export default function SimpleMode(props){


    //Уровень
    const [lvl, setLvl] = React.useState(1)

    //start game
    const [startGame, setStartGame] = React.useState(0)

    //Клетки
    const [dices, setDices] = React.useState(allNewDices())

    //Прогресс игры
    const [tenzies, setTenzies] = React.useState(false)

    //Текущее значение клетки
    const [current, setCurrent] = React.useState(false)

    //Таймер
    const [toggleTimer, setToggleTimer] = React.useState(false)

    //Следит за прогрессом игры
    React.useEffect(()=>{
        const allHeld = dices.every(die => die.isHeld)
        if(allHeld){
            setTenzies(true)
        }
    }, [dices])

    //Генерирует новую клетку
    function genNewDie(){
        return ({
            value: Math.floor(Math.random()*6+1),
            isHeld: false,
            isHidden: false,
            isError: false,
            isDis: true,
            id: nanoid()
        })
    }

    //Создает 10 новых клеток
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
        if(allCurrent.every((die) => die.isHeld)){
            setCurrent(false)
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

    //Запускает следующий уровень
    function nextLvl(){
        setLvl(prevLvl => prevLvl + 1)
        setTenzies(false)
        setCurrent(false)
        setToggleTimer(prevToggleTimer => !prevToggleTimer)

    }

    //скрыть клетки
    function hideDices(){
        setDices(prevDices => prevDices.map(die => ({...die, isHidden: !die.isHidden, isDis: !die.isDis})))
        setToggleTimer(prevToggleTimer => !prevToggleTimer)
    }

    //начать игру
    function start(){
        setStartGame(1)
        setLvl(1)
        setTenzies(false)
        setCurrent(false)
        setToggleTimer(prevToggleTimer => !prevToggleTimer)
    }

    //нужен для обновления клеток при новом уровне
    React.useEffect(() => {
        setDices(allNewDices())
    }, [lvl])

    //Преобразует клетки в массив компонентов
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
                tenzies && 
                <Confetti 
                    width={useWindowSize.width} 
                    height={useWindowSize.height} 
                    recycle={false}
                    numberOfPieces={500}
                />
            }
            {
                startGame ? 
                <section className="game">
                    {
                        toggleTimer &&
                        <Timer 
                            time={levelData.data[lvl-1].time} 
                            lvl={lvl} 
                            hideDices={hideDices}
                        />
                    }
                    <div className="game__block">
                        <h2>Level {lvl}</h2>
                        <div className={`game__field grid${levelData.data[lvl-1].cols}`}>
                            {diceElements}
                        </div>
                        {
                            tenzies && lvl === levelData.info.NumberOfLevels &&
                            <button className="main-button" onClick={() => start()}>
                                New game
                            </button>
                        }
                        {
                            tenzies && lvl !== levelData.info.NumberOfLevels &&
                            <button className="main-button" onClick={() => nextLvl()}>
                                Next level
                            </button>
                        }
                        {/* <button className="main-button" onClick={() => hideDices()}>
                            hide
                        </button> */}
                    </div>
                </section>
                :
                <section className="game">
                    <div className="game__block">
                        <h2>Classic</h2>
                        <p>Match dices!</p>
                        <button className="main-button" onClick={() => start()}>
                            Start
                        </button>
                    </div>
                </section>
            }
        </div>
    )
}



import React from 'react';
import SimpleDie from "./SimpleDie"
import { nanoid } from 'nanoid';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

export default function SimpleMode(props){

    //Клетки
    const [dices, setDices] = React.useState(allNewDices())

    //Прогресс игры
    const [tenzies, setTenzies] = React.useState(false)

    //Следит за прогрессом игры
    React.useEffect(()=>{
        const targetVal = dices[0].value
        const allHeld = dices.every(die => die.isHeld)
        const allSameValue = dices.every(die => die.value === targetVal)
        if(allHeld && allSameValue){
            setTenzies(true)
        }
    }, [dices])

    //Генерирует новую клетку
    function genNewDie(){
        return ({
            value: Math.floor(Math.random()*6+1),
            isHeld: false,
            id: nanoid()
        })
    }

    //Создает 10 новых клеток
    function allNewDices(){
        const newDices = []
        for(let i=0; i<10; i++){
            newDices.push(genNewDie())
        }
        return newDices
    }

    //Меняет статус клетки с id
    function holdDice(id){
        setDices(prevDices => prevDices.map(die => (die.id === id? {...die, isHeld: !die.isHeld} : die)))
    }

    //Записывает новые клетки и сохраняет активные
    function rollDices(){
        setDices(prevDices => prevDices.map(die => die.isHeld ? die : genNewDie()))
    }

    //Начинает новую игру
    function newGame(){
        setTenzies(false)
        setDices(allNewDices())
    }

    //Преобразует клетки в массив компонентов
    const diceElements = dices.map((die) => 
        <SimpleDie 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
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
            <section className="game">
                <div className="game__block">
                    <h2>Simple</h2>
                    <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
                    <div className="game__field">
                        {diceElements}
                    </div>
                    <button className="main-button" onClick={tenzies ? newGame : rollDices}>
                        {tenzies ? "New Game" : "Roll"}
                    </button>
                </div>
            </section>
        </div>
    )
}


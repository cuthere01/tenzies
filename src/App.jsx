
import React from 'react';
import SimpleMode from './components/SimpleMode';
import ClassicMode from './components/ClassicMode'

export default function App(){

    //Gamemode
    const [gamemode, setGamemode] = React.useState(false)

    function selectGamemode(){
        switch(gamemode){
            case 1:
                return (
                    <SimpleMode/>
                )
            case 2:
                return (
                    <ClassicMode/>
                )
            default:
                return (
                    <div className="container">
                        <section className="start">
                            <h2>Welcome to Tenzies!</h2>
                            <p>Select gamemode</p>
                            <div className="start__mode">
                                <button className="main-button" onClick={() => setGamemode(1)}>
                                    Simple
                                </button>
                                <button className="main-button" onClick={() => setGamemode(2)}>
                                    Classic
                                </button>
                            </div>
                        </section>
                    </div>
                )
        }
    }

    return(
        <div className="main">
            <header className="header">
                <div className="container header__content">
                    {
                        gamemode && 
                        <div 
                            className="back main-button" 
                            onClick={() => setGamemode(false)}
                        >
                            Back to menu
                        </div>
                    }
                </div>
            </header>
            
            {selectGamemode()}
        </div>
    )
}



import React, { useState } from 'react';
import SimpleMode from './components/SimpleMode';
import ClassicMode from './components/ClassicMode'
import langPack from './components/langPack';

export default function App(){

    //Gamemode
    const [gamemode, setGamemode] = useState(false)

    //Язык
    const [lang, setLang] = useState(false)

    //Настройки
    const [settings, setSettings] = useState(false)

    //текст
    function langText(id){
        return lang ? langPack.ru[id] : langPack.en[id]
    }

    function selectGamemode(){
        switch(gamemode){
            case 1:
                return (
                    <SimpleMode langText={langText}/>
                )
            case 2:
                return (
                    <ClassicMode langText={langText}/>
                )
            default:
                return (
                    <div className="container">
                        <section className="start">
                            <h2>{langText(1)}</h2>
                            <p>{langText(2)}</p>
                            <div className="start__mode">
                                <button className="main-button" onClick={() => setGamemode(1)}>
                                    {langText(3)}
                                </button>
                                <button className="main-button" onClick={() => setGamemode(2)}>
                                    {langText(4)}
                                </button>
                            </div>
                        </section>
                    </div>
                )
        }
    }

    return(
        <div className={`main ${lang? "ru" : "en"}`}>
            <header className="header">
                <div className="container header__content">
                    <div className="header__logo">
                        <img src="./media/cuthere-react-logo.svg" alt="" />
                    </div>
                    <div className="header__right">
                        <div className="header__shad"></div>
                        {
                            gamemode && 
                            <div 
                                className="main-button back" 
                                onClick={() => setGamemode(false)}
                            >
                               {langText(5)}
                            </div>
                        }
                        <div className={`settings__content ${!settings ? "dis" : ""}`}>
                            <div className="lang">
                                <span>en</span>
                                <div className="lang__switcher" onClick={() => setLang(prevLang => !prevLang)}>
                                    <div></div>
                                </div>
                                <span>ru</span>
                            </div>
                        </div>
                        <div className="main-button settings" onClick={() => setSettings(prevSettings => !prevSettings)}>
                            <img src="./media/settings.svg"/>
                        </div>
                    </div>
                </div>
            </header>
            {selectGamemode()}
        </div>
    )
}


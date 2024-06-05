
import React, { useState, useEffect } from 'react';
import SimpleMode from './components/SimpleMode';
import ClassicMode from './components/ClassicMode'
import langPack from './data/langPack';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./data/firebase";
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import { userDataCollection, db } from "./data/firebase";
import Notificator from './components/Notificator';
import { 
    onSnapshot, 
    doc, 
    addDoc, 
    deleteDoc,
    setDoc 
} from "firebase/firestore"

export default function App(){

    //Режим игры
    const [gamemode, setGamemode] = useState(false)

    //Селектор языка
    const [lang, setLang] = useState(false)

    //Настройки
    const [settings, setSettings] = useState(false)

    //Статус авторизации юзера
    const [authUser, setAuthUser] = useState(null)

    //вызов формы авторизации
    const [authForm, setAuthForm] = useState(false)

    //вызов формы регистрации
    const [regForm, setRegForm] = useState(false)

    //начать игру
    const [start, setStart] = useState(false)

    //вкл/выкл звук
    const [volume, setVolume] = useState(true)

    //вызов нотификатора
    const [notice, setNotice] = useState({
        active: false,
        uid: false,
    })

    //Показ нотификатора
    const showNotificator = (uid) => {
        setNotice(prevNotice => ({
            active: !prevNotice.active,
            uid: uid,
        }))
        setTimeout(() => setNotice(prevNotice => ({
            ...prevNotice,
            active: !prevNotice.active,
        })), 3000)
    }

    //вкл/выкл форму регистрации
    function openReg(){
        setRegForm(prevRegForm => !prevRegForm)
    }

    //вкл/выкл форму авторизации
    function openAuth(){
        setAuthForm(prevAuthForm => !prevAuthForm)
    }

    //Использование списка фраз
    function langText(id){
        return lang ? langPack.ru[id] : langPack.en[id]
    }

    //Следит за изменением статуса авторизации
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
                showNotificator(user.email)
                setAuthForm(false)
                //console.log(user)
                
            } else {
                setAuthUser(null);
            }
        });
        return () => {
            listen();
        };
    }, []);

    //Вывод авторизации и регистрации
    function authReg(){
        return (
            <div className="game container">
                <div className="game__block">
                    {
                        regForm ?
                        <SignUp langText={langText} openReg={()=>openReg()} />
                        :
                        <SignIn langText={langText} openReg={()=>openReg()} />
                    }
                </div>
            </div>
        )
    }

    function selectGamemode(){
        switch(gamemode){
            case 1:
                return (
                    <SimpleMode langText={langText}/>
                )
            case 2:
                return start ?
                <ClassicMode langText={langText} start={start}/>
                :
                <section className="game container">
                    <div className="game__block">
                        <h2>{langText(4)}</h2>
                        <p>{langText(6)}</p>
                        {
                            authUser ?
                            <button className="main-button" onClick={() => setStart(true)}>
                                {langText(17)}
                            </button>
                            :
                            <div className="start__mode">
                                <button className="main-button" onClick={() => setStart(true)}>
                                    {langText(7)}
                                </button>
                                <button className="main-button" onClick={() => setAuthForm(true)}>
                                    {langText(15)}
                                </button>
                            </div>
                        }
                    </div>
                </section>
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
                            gamemode || authForm ? 
                                <div 
                                    className="main-button min-button mr-r" 
                                    onClick={() => {
                                        setGamemode(false)
                                        setAuthForm(false)
                                        setRegForm(false)
                                        setStart(false)
                                    }}
                                >
                                {langText(5)}
                                </div>
                            :
                                <AuthDetails langText={langText} authUser={authUser} openAuth={()=>{openAuth()}} openReg={()=>{openAuth();openReg()}}/>
                        }
                        {/* <AuthDetails/> */}
                        <div className={`selector__content ${!settings ? "dis" : ""}`}>
                            <button className="volume" onClick={() => setVolume(prevVolume => !prevVolume)}>
                                <img src={`./media/${volume ? "volume" : "mute"}.svg`} alt="" />
                            </button>
                            
                            <div className="lang">
                                <span>en</span>
                                <div className="lang__switcher" onClick={() => setLang(prevLang => !prevLang)}>
                                    <div></div>
                                </div>
                                <span>ru</span>
                            </div>
                        </div>
                        <button className="main-button icon-button" onClick={() => setSettings(prevSettings => !prevSettings)}>
                            <img src="./media/settings.svg" alt=""/>
                        </button>
                    </div>
                </div>
            </header>
            {authForm ? authReg() : selectGamemode()}
            <Notificator langText={langText} notice={notice.active} uid={notice.uid}/>
        </div>
    )
}


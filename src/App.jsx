
import React, { useState, useEffect } from 'react';
import SimpleMode from './components/SimpleMode';
import ClassicMode from './components/ClassicMode'
import langPack from './data/langPack';
import { onAuthStateChanged } from "firebase/auth";
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import Notificator from './components/Notificator';
import useSound from 'use-sound';
import { db, auth } from "./data/firebase";
import { 
    onSnapshot,
    collection,
    doc, 
    addDoc, 
    deleteDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import Background from './components/Background';

export default function App(){

    //Режим игры
    const [gamemode, setGamemode] = useState(false)

    //Селектор языка
    const [lang, setLang] = useState(false)

    //Настройки
    const [settings, setSettings] = useState(false)

    //Авторизованный пользователь
    const [authUser, setAuthUser] = useState(null)

    //вызов формы авторизации
    const [authForm, setAuthForm] = useState(false)

    //вызов формы регистрации
    const [regForm, setRegForm] = useState(false)

    //начать игру
    const [start, setStart] = useState(false)

    //вкл/выкл звук
    const [volume, setVolume] = useState(true)

    //уровень игрока
    const [userLvl, setUserLvl] = useState(1)

    //данные о пользователях
    const [userData, setUserData] = useState([])

    //получение данных о пользователях
    useEffect(() => onSnapshot(
        collection(db, "userData"), 
        (snapshot) => setUserData(snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
        })))
    ), [authUser])

    //Добавить данные о новом пользователе
    const handleNew = async (email, uid) => {
        const classicModeLvl = 1;
        const payload = { email, classicModeLvl };
        await setDoc(doc(db, "userData", uid), payload);
    };

    //Звук нажатия на кнопку
    const [boop] = useSound(
        './media/boop.wav',
        { volume: 0.15 }
    );

    //Звук нажатия на кубик
    const [pop] = useSound(
        './media/pop.mp3',
        { volume: 0.15 }
    );

    //Звук победы
    const [winner] = useSound(
        './media/win.mp3',
        { volume: 0.15 }
    );

    //Звук поражения
    const [gameover] = useSound(
        './media/gameover.wav',
        { volume: 0.15 }
    );

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
                showNotificator(user.email);
                setAuthForm(false);
                // console.log(user);
                
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
                        <SignUp langText={langText} openReg={()=>openReg()} created={handleNew} />
                        :
                        <SignIn langText={langText} openReg={()=>openReg()} />
                    }
                </div>
            </div>
        )
    }

    //загрузить уровень пользователя
    useEffect(() => {
        setUserLvl(prevUserLvl => {
            let temp = 1;
            if(authUser && userData){
                userData.forEach(data => {
                    if(data.id === authUser.uid) temp = data.classicModeLvl;
                })
            }
            return temp;
        })
    }, [authUser, userData])

    //присвоить пользователю новый уровень
    const updLvl = async (newLvl) => {
        if(authUser){
            const docRef = doc(db, "userData", authUser.uid);
            await updateDoc(docRef, {
                classicModeLvl: newLvl,
            });
        }
    }

    //Выбор режима игры
    function selectGamemode(){
        
        switch(gamemode){
            case 1:
                return (
                    <SimpleMode langText={langText}/>
                )
            case 2:
                //loadUserLvl();
                return start ?
                <ClassicMode 
                    langText={langText} 
                    start={start} 
                    boop={() => volume && boop()}
                    pop={() => volume && pop()}
                    win={() => volume && winner()}
                    gover={() => volume && gameover()}
                    userLvl={userLvl}
                    updLvl={updLvl}
                />
                :
                <section className="game container">
                    <div className="game__block">
                        <h2>{langText(4)}</h2>
                        <p>{langText(6)}</p>
                        {
                            authUser ?
                            <button className="main-button" onClick={() => {setStart(true); volume && boop();}}>
                                {langText(17)}
                            </button>
                            :
                            <div className="start__mode">
                                <button className="main-button" onClick={() => {setStart(true); volume && boop();}}>
                                    {langText(7)}
                                </button>
                                <button className="main-button" onClick={() => {setAuthForm(true); volume && boop();}}>
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
                                <button className="main-button" onClick={() => {setGamemode(1); volume && boop();}}>
                                    {langText(3)}
                                </button>
                                <button className="main-button" onClick={() => {setGamemode(2); volume && boop();}}>
                                    {langText(4)}
                                </button>
                            </div>
                            {/* <div className="test container">
                                <button onClick={() => handleNew}>
                                    New
                                </button>
                                <ul>
                                    {userData.map((data) => (
                                        <li key={data.id}>{data.email}: {data.classicModeLvl}</li>           
                                    ))}
                                </ul>
                            </div>  */}
                        </section>
                    </div>
                )
        }
    }


    return(
        <div className={`main ${lang? "ru" : "en"}`}>
            {!start && <Background/>}
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
                                        setGamemode(false);
                                        setAuthForm(false);
                                        setRegForm(false);
                                        setStart(false);
                                        volume && boop();
                                    }}
                                >
                                {langText(5)}
                                </div>
                            :
                                <AuthDetails langText={langText} authUser={authUser} openAuth={()=>{openAuth()}} openReg={()=>{openAuth();openReg()}}/>
                        }
                        {/* <AuthDetails/> */}
                        <div className={`selector__content ${!settings ? "dis" : ""}`}>
                            <button className="volume" onClick={() => {setVolume(prevVolume => !prevVolume); boop()}}>
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
                        <button className="main-button icon-button" onClick={() => {setSettings(prevSettings => !prevSettings)}}>
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


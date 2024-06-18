import useSound from 'use-sound';

export default function ClassicDie(props){
    
    return (
        <div 
            className={`die ${props.isHeld? "active " : ""}${props.isHidden? "hidden " : ""}${props.isError? "error " : ""}${props.isDis? "dis " : ""}`}
            onClick={() => {props.pop(); props.holdDice();}}
        >
            {props.value}
        </div>
    )
}
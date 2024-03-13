export default function SimpleDie(props){
    return (
        <div 
            className={props.isHeld? "die active" : "die"}
            onClick={props.holdDice}
        >
            {props.value}
        </div>
    )
}
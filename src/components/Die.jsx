export default function Die(props){
    return (
        <div 
            className={props.isHeld? "die active" : "die"}
            onClick={props.holdDice}
        >
            {props.value}
        </div>
    )
}
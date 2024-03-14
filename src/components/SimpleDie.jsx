export default function SimpleDie(props){
    return (
        <div 
            className={props.isHeld? "die-simple active" : "die-simple"}
            onClick={props.holdDice}
        >
            {props.value}
        </div>
    )
}
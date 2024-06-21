import styled, { keyframes, css } from "styled-components";

const main = (props) => keyframes`
	0% { 
		transform: scale(1) rotate(${36*props.$c.spin + (props.$c.spin > 0 ? 90 : -90)}deg); 
	}
	50% { 
		transform: scale(.75) rotate(${36*props.$c.spin + (props.$c.spin > 0 ? 270 : -270)}deg); 
	}
	100% { 
		transform: scale(1) rotate(${36*props.$c.spin + (props.$c.spin > 0 ? 450 : -450)}deg); 
	}
`
const start = (props) => keyframes`
	0% { 
		transform: scale(0) rotate(${36*props.$c.spin}deg); 
	}
	50% { 
		transform: scale(0) rotate(${36*props.$c.spin + (props.$c.spin > 0 ? 45 : -45)}deg); 
	}
	100% { 
		transform: scale(1) rotate(${36*props.$c.spin + (props.$c.spin > 0 ? 90 : -90)}deg); 
	}
`
const animationRule = (props) => css`
	${props => main(props)} ${10/Math.sqrt(props.$c.xSpeed**2 + props.$c.ySpeed**2)}s linear ${2.5/Math.sqrt(props.$c.xSpeed**2 + props.$c.ySpeed**2)}s infinite,
	${props => start(props)} ${2.5/Math.sqrt(props.$c.xSpeed**2 + props.$c.ySpeed**2)}s linear;
`
const Cube = styled.div`
	&&& {
		left: ${props => props.$c.x}%;
		top: ${props => props.$c.y}%;
		background: ${props => (props.$c.active ? '#59E391' : '#fff')};
		opacity: ${props => (props.$c.active ? '0' : '1')};
		transition: all .5s ease;
		animation: ${props => animationRule(props)};
	}
`
export default Cube;
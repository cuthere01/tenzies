import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import Cube from './Cube';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

export default function Background(props){

	const genNewCube = () => {
        return ({
            value: Math.floor(Math.random()*7 + 1),
			spin: (Math.random()-0.5)*5,
			xSpeed: (Math.random()-0.5)*2,
			ySpeed: (Math.random()-0.5)*2,
			x: Math.random()*90+5,
			y: Math.random()*90+5,
			active: false,
            id: nanoid()
        })
    }

	const allNewCubes = () => {
        const cubesCount = Math.floor(Math.random()*5 + 10);
		const cubesFolder = []
		for(let i = 0; i < cubesCount; i++){
			cubesFolder.push(genNewCube())
		}
		return cubesFolder
    }

	const [cubes, setCubes] = useState(allNewCubes())
	const [bgWin, setbgWin] = useState(false)

	const clickHandler = (i) => {
		const buff = [...cubes];
		buff[i] = {...buff[i], active: true};
		setCubes(buff);
	}

	useEffect(() => {
		if(cubes.every(cube => cube.active)){
			setTimeout(() => setCubes(allNewCubes()), 5000);
			setbgWin(true)
		} else (bgWin && setbgWin(false));
	}, [cubes])

	const cubeElements = cubes.map((cube, i) => {
		
		return (
			<Cube 
				className="cube"
				key={cube.id}
				$c={cube}
				onClick={() => {
					//console.log(cube)
					return clickHandler(i)
				}}
			>
				{cube.value}
			</Cube>
		)
	})

	// setTimeout(() => {
	// 	setCubes(allNewCubes())
		
	// }, 20000)
    return (
		<>
			{
				bgWin &&
				<Confetti 
					width={useWindowSize.width} 
					height={useWindowSize.height} 
					recycle={false}
					numberOfPieces={800}
					gravity={.3}
				/>
			}
			<div className='background'>
				<div className="background__shad"></div>
				{cubeElements}
			</div>
		</>
	)
}
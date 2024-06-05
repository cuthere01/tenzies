import React from 'react';

export default function Notificator(props){
    return (
		<div className={`notificator${props.notice ? ' active' : ''}`}>
			<div>
				<span>{props.langText(31)}, {props.uid}</span>
			</div>
		</div>
	)
}
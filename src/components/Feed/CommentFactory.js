import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { createCommentObj, increaseCommentCount, increaseCommentNumber } from 'store.js';

function CommentFactory({ feeds, i }){
	let state = useSelector((state) => state)
	let dispatch = useDispatch();

	let [comment, setComment] = useState("");

	const onCommentChange = (e) => {
		const {
			target: { value },
		} = e;
		setComment(value);
	}
	
	const onCommentSubmit = (e) => {
		e.preventDefault();
	}

	const getDate = () => {
		let date = new Date();
		let year = date.getFullYear();
		let month = ("0" + (1+date.getMonth())).slice(-2);
		let day = ("0"+date.getDate()).slice(-2);
		let hours = ('0' + date.getHours()).slice(-2); 
		let minutes = ('0' + date.getMinutes()).slice(-2);
		// let seconds = ('0' + date.getSeconds()).slice(-2); 
		let ampm = '오전'

		if (hours >= 12){
			ampm = '오후'
			if (hours > 12){
				hours -= 12
			}

		}

		return `${year}년 ${month}월 ${day}일\n${ampm} ${hours}시 ${minutes}분`;
	}

	const onCommentButtonClick = (i) => {
		if (comment === ""){
			return alert('댓글 내용을 입력해주세요!')
		}
		
		let createdCommentObj = {
			commentNumber : state.commentNumber.num,
			postNumber : feeds[i].postNumber,
			content : comment,
			writer : state.userInfo.id,
			creatorNickname : state.userInfo.nickname,
			createDate : getDate()
		}

		dispatch(increaseCommentNumber())
		dispatch(createCommentObj(createdCommentObj))
		dispatch(increaseCommentCount(feeds[i].postNumber))
		
		setComment("")

		createdCommentObj = null
	}

	return(
		<Row>
			<Col style={{paddingTop:20, textAlign:'left'}}>
				<form onSubmit={onCommentSubmit} className="comment_container" >
					<textarea className="comment_textarea" placeholder="댓글 달기..." color="gray" value={comment} onChange={onCommentChange} />
					<input className="comment_submit" type="submit" value="↑" onClick={()=>{
						onCommentButtonClick(i)
						}} />
				</form>
			</Col>
		</Row>
	)
}

export default CommentFactory;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';

// import { FaRegEye } from "react-icons/fa";
import { FcLikePlaceholder } from "react-icons/fc";
import { BiCommentDetail } from "react-icons/bi";

/* Components */
import BoardCommentFactory from './BoardCommentFactory';
import BoardComments from './BoardComments';
import BoardWriteButton from './BoardWriteButton';

/* Redux, State */
import { useDispatch, useSelector } from 'react-redux';
import { boardEditingOn, setCommentPostedFalse, setViewPointNext, setViewPointPrev, setViewPointNull } from 'store';

function BoardDetailObj({ openBoard, setPostLoading, userInfo, isBoardOwner, isLoading, maxPostNum }){
  let navigate = useNavigate();
	let dispatch = useDispatch();
  
	let state = useSelector((state) => state)
	let API_URL = useSelector((state) => state.API_URL)
  const COMMENTS_URL = useSelector((state) => state.COMMENTS_URL)
  const postNumber = 'postNumber'
  
  
  let [comments, setComments] = useState([]);
  let [commentLoading, setCommentLoading] = useState(false)

  let getConfig = () => {
    let config = {
      headers : {
        "accesstoken" : localStorage.getItem("accessToken"),
        "refreshtoken" : localStorage.getItem("refreshToken")
      }
    }
    return config
  }

  /** 댓글 받아오기 (axios) */
  useEffect(()=>{
    if (openBoard !== undefined && commentLoading === false){
      axios
        .get(`${COMMENTS_URL}/search?${postNumber}=${openBoard.postNumber}`)
        .then(response => {
          setComments(response.data.data)
          dispatch(setCommentPostedFalse())
        })
        .catch(err => console.log(err))
    }
  },[openBoard, state.isCommentPosted.value, commentLoading, COMMENTS_URL, dispatch])

	
  const MoveToTop = () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  }

  /** 게시글 삭제하기 (axios) */
  const onDeleteButtonClick = () => {
    if (window.confirm('게시글을 삭제하시겠습니까?')){
      let config = getConfig()
      setPostLoading(true)

      axios
        .delete(`${API_URL}/posts?${postNumber}=${openBoard.postNumber}`,config)
        .then(async(response) => {
          alert('삭제되었습니다.')
          setPostLoading(false)
          await navigate('/')
        })
        .catch(err => {
          console.log(err)
          setPostLoading(false)
        })
    }
  }

  const onNextButtonClick = () => {
    dispatch(setViewPointNext());
    if (openBoard.postNumber === maxPostNum){
      dispatch(setViewPointNull())
      return alert('다음글이 없습니다!')
    }
    else {
      navigate(`/boarddetail/${openBoard.postNumber+1}`)
    }
    
  }

  const onPrevButtonClick = () => {
    dispatch(setViewPointPrev());
    if (openBoard.postNumber === 1){
      dispatch(setViewPointNull())
      return alert('이전글이 없습니다!')
    }
    else{
      navigate(`/boarddetail/${openBoard.postNumber-1}`)
    }
  }

	return (
		<> 
    {isLoading? <>loading...</> : //openBoard 데이터 로딩 시 출력 (BoardDetail.js 참고)
		(
      <>
      <Row style={{marginTop:15}}>
        <Col style={{textAlign:'left', paddingLeft:50, fontSize:20}}>
          {openBoard.writer.nickname}
        </Col>
        <Col style={{textAlign:'right'}}>
          {/* 수삭목댓 컴포넌트 */}
          <BoardUpDelInCom 
            isBoardOwner={isBoardOwner} 
            openBoard={openBoard} 
            navigate={navigate} 
            onDeleteButtonClick={onDeleteButtonClick}
          />
        </Col>
      </Row>
      
      <Row style={{marginTop:40, marginBottom:60}}>
        <Col><h4>{openBoard.title}</h4></Col>
      </Row>

      <Row>
        <Col style={{textAlign:'left', paddingBottom:80}} >
          <div dangerouslySetInnerHTML={{ __html :  openBoard.content  }} />
        </Col>
      </Row>

      {/* 추천버튼 컴포넌트 */}
      <Row>
        <Col style={{alignItems:'baseline'}}>
          <LikeButton state={state} openBoard={openBoard} navigate={navigate} />
        </Col>
      </Row>

      <Row style={{marginTop:30, alignItems:'flex-end', paddingBottom:30, borderBottom:'1px solid #ccc'}}>
        <Col style={{textAlign:'left'}}>
          {/* 수삭목댓 컴포넌트 */}
          <BoardUpDelInCom 
            isBoardOwner={isBoardOwner} openBoard={openBoard} navigate={navigate} onDeleteButtonClick={onDeleteButtonClick}/>
        </Col>
        <Col style={{textAlign:'right'}}>
          { isBoardOwner ? (
            <>
            <Button 
              variant="light" 
              style={{marginRight:10, border:'1px solid rgb(200,200,200)'}} 
              onClick={()=>{dispatch(boardEditingOn(openBoard.postNumber))}}
            >수정</Button> 
            <Button
              variant="light"
              style={{marginRight:10, border:'1px solid rgb(200,200,200)'}}
              onClick={()=>{onDeleteButtonClick()}}
            >삭제</Button>
            </>
            ) : null 
          }
          <Button variant="light" style={{marginRight:10, border:'1px solid rgb(200,200,200)'}} onClick={()=>{navigate("/")}}>목록</Button>
          <BoardWriteButton />
        </Col>
      </Row>

      {/* 댓글출력 컴포넌트 */}
      <Row style={{marginTop:10}}>
        <Col style={{textAlign:'left'}}><BiCommentDetail/> 댓글 ({comments.length})</Col>
      </Row>
      <Row>
        <Col>
          <Container>
            { comments.map((ca,ci) => 
              <BoardComments 
                comments={comments} 
                ci={ci} 
                key={ci} 
                isCommentOwner={ 
                  state.isLoggedIn.value ? 
                    userInfo.memberNumber === comments[ci].writer.memberNumber 
                  : false
                } 
                setCommentLoading={setCommentLoading}
                setPostLoading={setPostLoading}
              />
              )}
          </Container>
        </Col>
      </Row>

      {/* 댓글달기 컴포넌트 */}
      <BoardCommentFactory
        openBoard={openBoard}
        setPostLoading={setPostLoading}
        setCommentLoading={setCommentLoading}
      />

      {/* 목록, 다음글, 이전글, 맨위로, 글쓰기 버튼 */}
      <Row style={{textAlign:'left' , marginTop:30}}>
        <Col>
          <Button variant="light" onClick={()=>{navigate("/")}} style={{border:'1px solid rgb(200,200,200)', marginRight:5}}>목록</Button>
          <Button 
            variant="light" 
            onClick={()=>{onNextButtonClick()}}
            style={{border:'1px solid rgb(200,200,200)', marginRight:5}}
          >다음글 ↑</Button>
          <Button 
            variant="light" 
            onClick={()=>{onPrevButtonClick()}} 
            style={{border:'1px solid rgb(200,200,200)'}}
          >이전글 ↓</Button>
        </Col>
        <Col style={{textAlign:'right'}}>
          <Button variant="light" onClick={()=>{MoveToTop()}} style={{border:'1px solid rgb(200,200,200)', marginRight:5}}>맨위로</Button>
          <BoardWriteButton />
        </Col>
      </Row>
      </>
    )}
		</>
	)
}


/* 수정/삭제/목록/댓글 컴포넌트 */
function BoardUpDelInCom({ openBoard, isBoardOwner, navigate, onDeleteButtonClick }){
  let dispatch = useDispatch();
  return (
    <div>
      { isBoardOwner ? (
        // 글작성자이면 수삭목댓
        <div style={{fontSize:14, color:'gray'}}>
          <span style={{cursor:'pointer'}} onClick={()=>{ dispatch(boardEditingOn(openBoard.postNumber)) }}>수정</span><span> | </span>
          <span style={{cursor:'pointer'}} onClick={()=>{ onDeleteButtonClick() }}>삭제</span><span> | </span>
          <span style={{cursor:'pointer'}} onClick={()=>{navigate("/")}}>목록</span><span> | </span>
          <span style={{cursor:'pointer'}}>댓글(<span style={{color:'#F94B4B'}}>{openBoard.commentCount}</span>)</span>
        </div>
      ) : (
        // 글작성자 아니면 목댓
        <div style={{fontSize:14, color:'gray'}}>
          <span style={{cursor:'pointer'}} onClick={()=>{navigate("/")}}>목록</span><span> | </span>
          <span style={{cursor:'pointer'}}>댓글(<span style={{color:'#F94B4B'}}>{openBoard.commentCount}</span>)</span>
        </div>
      )}
    </div>
  )
}

/* 추천버튼 컴포넌트 */
function LikeButton({ openBoard, state, navigate }){
  return(
    <Button 
      variant="light" 
      style={{fontSize:25, padding:'5px 20px 10px 20px',border:'1px solid rgb(200,200,200)'}}
      onClick={()=>{
        if(state.isLoggedIn === true){
          //추천버튼 클릭 시 +되는 기능 요청 (axios)
        } else {
          if(window.confirm('권한이 없습니다. 로그인 후 이용해주세요!')){
            navigate("/login")
          }
        }
      }}>
      <FcLikePlaceholder style={{fontSize:30, marginRight:10}} />
      {openBoard.likeCount}
    </Button>
  )
}

export default BoardDetailObj
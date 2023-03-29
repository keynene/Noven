import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {useSelector} from "react-redux";

/* Routes import */
import Home from 'routes/Home.js';
import MyPage from 'routes/MyPage.js';
import Feed from 'routes/Feed.js';
import Join from '../routes/Join.js';
import Login from '../routes/Login.js';
import TableFactory from './TableFactory.js';

function AppRouter(){
	let state = useSelector((state) => state)
	return(
		<Routes>
			{/* 메인페이지 */}
			<Route path="/" element={ <Home /> } />

			{/* 회원가입페이지 */}
			<Route path="/join" element={ <Join /> } />

			{/* 마이페이지 */}
			{ state.isLoggedIn === true ? 
				<Route path="/mypage" element={ <MyPage /> } />
				:
				<Route path="/join" element={ <Join /> } />
			}

			{/* 로그인페이지 */}
			<Route path="/login" element={ <Login /> } /> 

			{/* 피드페이지 */}
			<Route path="/feed" element={ <Feed /> } /> 

			{/* 게시글작성페이지 */}
			<Route path="/tablefactory" element={ <TableFactory /> } /> 
			
		</Routes>
	)
}

export default AppRouter
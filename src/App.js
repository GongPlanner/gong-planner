import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from '@material-ui/core';
import { styled } from '@material-ui/styles';
import _ from 'lodash';
import dayjs from 'dayjs';
import './App.css';
import Home from './router/Home';
import Edit from './router/Edit';
import Setting from './router/Setting';
import { getTodayData } from './firebase/todayFunction';

const AppContainer = styled(Container)({
	fontSize: 'medium'
});

class App extends Component {
	state = {
		todayData: {
			date: dayjs()
		}
	};

	setTodayData = date => {
		// 임시로 URL 검사해서 받아옴
		const pathList = window.location.pathname.split('/');
		const collectionName = pathList[1] || 'testSubject';

		const shortDateStr = date.format('YY.MM.DD');
		console.log(shortDateStr, '정보를 받아오는중..');

		getTodayData(collectionName, shortDateStr).then(data => {
			let todayData = { date };
			if (data) {
				todayData = {
					...todayData,
					...data,

					// 색깔 넣어주기
					timeTable: _.map(data.timeTable, subject => {
						const subObj = _.find(data.subjects, { subjectName: subject.subject });

						return {
							...subject,
							color: subObj ? subObj.subjectColor : 'black'
						};
					})
				};
			}
			this.setState(prevState => {
				return { ...prevState, todayData };
			});
		});
	};

	componentDidMount() {
		this.setTodayData(this.state.todayData.date);
	}

	render() {
		const { todayData } = this.state;
		const HomeComponent = props => <Home todayData={todayData} onChangeTodayData={this.setTodayData} {...props} />;

		return _.isEmpty(todayData) ? (
			<div>로-딩</div>
		) : (
			<BrowserRouter>
				<AppContainer maxWidth='sm'>
					<Switch>
						<Route exact path='/' component={HomeComponent} />
						<Route path='/:colName/edit' component={Edit} />
						<Route path='/:colName/setting' component={Setting} />
						<Route path='/:colName' component={HomeComponent} />
					</Switch>
				</AppContainer>
			</BrowserRouter>
		);
	}
}

export default App;

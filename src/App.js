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
  fontSize: 'medium',
});

class App extends Component {
  state = {
    todayData: {
      date: dayjs(),
    },
  };

  setTodayData = (data) => {
    const todayData = this.state.todayData
      ? { ...this.state.todayData, ...data }
      : { ...data };

    if (todayData) {
      // 공부시간 넣는 작업
      if (!_.isEmpty(todayData.subjects)) {
        // 원래 있던 subjects의 totalElapsedTime(총 공부시간) 초기화
        todayData.subjects = _.mapValues(todayData.subjects, (value) => {
          return {
            ...value,
            totalElapsedTime: 0,
          };
        });

        // timeTable을 for 돌려서 과목에 공부시간을 넣음
        _.each(todayData.timeTable, (time) => {
          const subObjKey = _.findKey(todayData.subjects, {
            subjectName: time.subject,
          });

          if (todayData.subjects[subObjKey]) {
            todayData.subjects[subObjKey].totalElapsedTime += Math.abs(
              time.end.seconds - time.start.seconds
            );
          }
        });
      }

      // 색깔 넣어주기
      if (todayData.timeTable) {
        todayData.timeTable = _.map(todayData.timeTable, (time) => {
          const subObj = _.find(todayData.subjects, {
            subjectName: time.subject,
          });

          return {
            ...time,
            color: subObj ? subObj.subjectColor : 'black',
          };
        });
      }

      this.setState({ todayData });
    }
  };

  updateTodayData = (date) => {
    // 임시로 URL 검사해서 받아옴
    const pathList = window.location.pathname.split('/');
    const collectionName = pathList[1] || 'testSubject';

    const shortDateStr = date.format('YY.MM.DD');
    console.log(shortDateStr, '정보를 받아오는중..');

    getTodayData(collectionName, shortDateStr).then((data) =>
      this.setTodayData(_.isObject(data) ? { date, ...data } : { date })
    );
  };

  setSubjects = (subjects) => {
    this.setTodayData({ subjects });
  };

  setTimeTable = (timeTable) => {
    this.setTodayData({ timeTable });
  };

  componentDidMount() {
    this.updateTodayData(this.state.todayData.date);
  }

  render() {
    const { todayData } = this.state;

    const HomeComponent = (props) => (
      <Home
        todayData={todayData}
        onChangeTodayData={this.updateTodayData}
        onChangeSubjects={this.setSubjects}
        onChangeTimeTable={this.setTimeTable}
        {...props}
      />
    );
    const EditComponent = (props) => (
      <Edit
        todayData={todayData}
        onChangeSubjects={this.setSubjects}
        {...props}
      />
    );

    return (
      <BrowserRouter>
        <AppContainer maxWidth='sm'>
          <Switch>
            <Route exact path='/' component={HomeComponent} />
            <Route path='/:colName/edit' component={EditComponent} />
            <Route path='/:colName/setting' component={Setting} />
            <Route path='/:colName' component={HomeComponent} />
          </Switch>
        </AppContainer>
      </BrowserRouter>
    );
  }
}

export default App;

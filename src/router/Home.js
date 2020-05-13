import React from "react";
import _ from "lodash";
import { Grid } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import TodayDate from "../components/TodayDate";
import EditSetting from "../components/EditSetting";
import Todaylog from "../components/Todaylog";
import Subjects from "../components/Subjects";
// import Timetable from '../components/Timetable';
import CvsTimetable from "../components/CvsTimetable";

const RootGrid = styled(Grid)({
  height: "100vh",
  overflow: "hidden",
  flexDirection: "column",
  flexWrap: "nowrap"
});
const HeaderGrid = styled(Grid)({
  display: "flex",
  height: "64px",
  justifyContent: "space-between",
  flexWrap: "nowrap"
});
const LogGrid = styled(Grid)({});
const BottomGrid = styled(Grid)({
  overflow: "scroll",
  height: "100%",
  "& div": {
    height: "100%"
  }
});
const SubjectGrid = styled(Grid)({
  overflow: "scroll"
});

const Home = props => {
  const { onChangeTodayData, onChangeSubjects, onChangeTimeTable } = props;
  const todayData = props.todayData || {};
  const collectionName = _.isEmpty(props.match.params)
    ? "testSubject"
    : props.match.params.colName;

  return (
    <RootGrid container spacing={1}>
      <HeaderGrid item>
        <TodayDate date={todayData.date} onChangeDate={onChangeTodayData} />
        <EditSetting colName={collectionName} />
      </HeaderGrid>
      <LogGrid item>
        <Todaylog
          colName={collectionName}
          date={todayData.date}
          todayData={todayData}
        />
      </LogGrid>
      <BottomGrid item container spacing={1}>
        <SubjectGrid item xs={6}>
          <Subjects
            colName={collectionName}
            date={todayData.date}
            onChangeSubjects={onChangeSubjects}
            subjects={todayData.subjects}
          />
        </SubjectGrid>
        <Grid item xs={6}>
          {/* <Timetable today={todayData.date} timeTable={todayData.timeTable ? todayData.timeTable : []} /> */}
          <CvsTimetable
            colName={collectionName}
            date={todayData.date}
            timeTable={todayData.timeTable ? todayData.timeTable : []}
            onChangeSubjects={onChangeSubjects}
            onChangeTimeTable={onChangeTimeTable}
            subjects={todayData.subjects}
          />
        </Grid>
      </BottomGrid>
    </RootGrid>
  );
};

export default Home;

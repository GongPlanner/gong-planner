import React, { Component } from 'react';
import _ from 'lodash';
import dayjs from 'dayjs';
import { styled } from '@material-ui/styles';
import { Stage, Layer, Rect, Line, Text } from 'react-konva';
import TimetableModal from '../components/Modals/TimetableModal';
import TimeTable from '../lib/timetable';

const StyledStage = styled(Stage)({
  height: '100%',
});

export default class CvsTimetable extends Component {
  state = {
    width: 240,
    height: 550,
    showModal: false,
    modalRole: 'add',
    modalSubject: _.isEmpty(this.props.subjects)
      ? null
      : this.props.subjects[_.keys(this.props.subjects)[0]].subjectName,
    modalStartDayjs: dayjs(),
    modalEndDayjs: dayjs(),
    timeTable: new TimeTable(this.props.timeTable),
  };

  componentDidMount() {
    this.checkSize();
    window.addEventListener('resize', this.checkSize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkSize.bind(this));
  }

  handleModal(time) {
    if (time.startDayjs) {
      // 편집 창
      this.setState((prevState) => {
        return {
          ...prevState,
          modalRole: 'edit',
          modalSubject: time.subject,
          modalStartDayjs: time.startDayjs,
          modalEndDayjs: time.endDayjs,
          showModal: !prevState.showModal,
        };
      });
    } else {
      this.setState((prevState) => {
        return {
          ...prevState,
          modalRole: 'add',
          modalSubject: _.isEmpty(this.props.subjects)
            ? null
            : this.props.subjects[_.keys(this.props.subjects)[0]].subjectName,
          modalStartDayjs: dayjs(),
          modalEndDayjs: dayjs().add(1, 'hour'),
          showModal: _.isBoolean(time) ? time : !prevState.showModal,
        };
      });
    }
  }

  checkSize() {
    if (this.element) {
      const container = this.element.attrs.container;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      if (this.state.width !== width || this.state.height !== height) {
        this.setState({ width, height });
      }
    }
  }

  render() {
    const { colName, date, subjects } = this.props;

    const maxWidth = this.state.width;
    const maxHeight = this.state.height;
    const timeTable = this.state.timeTable;
    const {
      modalRole,
      modalSubject,
      modalStartDayjs,
      modalEndDayjs,
      showModal,
    } = this.state;

    const hourWidth = 30;
    const restWidth = maxWidth - hourWidth;
    const cellHeight = maxHeight / 24;

    return (
      <React.Fragment>
        <StyledStage
          ref={(element) => (this.element = element)}
          width={maxWidth}
          height={maxHeight}
        >
          <Layer key={0} name='frame'>
            <Line
              points={[hourWidth, 0, hourWidth, maxHeight]}
              stroke='black'
              strokeWidth={1}
            />
            {[...Array(24)].map((_, i) => {
              const y = (i + 1) * cellHeight;
              const textY = y - cellHeight;

              return (
                <React.Fragment key={i}>
                  <Text
                    x={0}
                    y={textY}
                    width={hourWidth}
                    maxWidth={hourWidth}
                    height={cellHeight}
                    maxHeight={cellHeight}
                    text={`${i}시`}
                    align='center'
                    verticalAlign='middle'
                    fontSize={11}
                  />
                  <Line
                    points={[0, y, maxWidth, y]}
                    stroke='black'
                    strokeWidth={1}
                  />
                </React.Fragment>
              );
            })}
            {[...Array(6)].map((_, i) => {
              const x = hourWidth + (i * restWidth) / 6;
              return (
                <Line
                  key={x}
                  points={[x, 0, x, maxHeight]}
                  stroke='black'
                  strokeWidth={0.5}
                />
              );
            })}
          </Layer>
          <Layer key={1} name='click-frame'>
            <Rect
              x={hourWidth}
              y={0}
              width={restWidth}
              height={maxHeight}
              onClick={this.handleModal.bind(this)}
              onTap={this.handleModal.bind(this)}
            />
          </Layer>
          <Layer key={2} name='study'>
            {_.isEmpty(timeTable) ? (
              <React.Fragment />
            ) : (
              timeTable.studyTime.map((arr, hour) => {
                if (arr) {
                  const y = hour * cellHeight;
                  return arr.map((study) => {
                    const x = hourWidth + study.start * (restWidth / 60);
                    const width = (study.end - study.start) * (restWidth / 60);
                    const time = {
                      subject: study.subject,
                      startDayjs: study.startDayjs,
                      endDayjs: study.endDayjs,
                    };
                    return (
                      <Rect
                        x={x}
                        y={y}
                        key={x + y}
                        width={width}
                        height={cellHeight}
                        fill={study.color}
                        onClick={this.handleModal.bind(this, time)}
                        onTap={this.handleModal.bind(this, time)}
                      />
                    );
                  });
                } else {
                  return <React.Fragment />;
                }
              })
            )}
          </Layer>
        </StyledStage>
        <TimetableModal
          date={date}
          colName={colName}
          show={showModal}
          handleModal={this.handleModal.bind(this)}
          onSetTimeTable={this.props.onChangeTimeTable}
          onSetSubjects={this.props.onChangeSubjects}
          subjects={subjects}
          editSubject={modalSubject}
          startDayjs={modalStartDayjs}
          endDayjs={modalEndDayjs}
          role={modalRole}
        />
      </React.Fragment>
    );
  }
}

import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Grid,
  FormControl,
  Select,
  InputLabel,
  Input,
  MenuItem,
  FormHelperText,
  Box,
  Button,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';
import ReactModal from 'react-modal';
import {
  addTimeTable,
  updateTimeTable,
  deleteTimeTable,
} from '../../firebase/timeTableFunction';

const TimetableModal = ({
  date,
  show,
  colName,
  subjects,
  role,
  handleModal,
  onSetTimeTable,
  onSetSubjects,
  editSubject,
  startDayjs,
  endDayjs,
}) => {
  const [time, setTime] = useState({ start: startDayjs, end: endDayjs });

  useEffect(() => {
    setTime({ start: startDayjs, end: endDayjs });
  }, [startDayjs, endDayjs]);

  useEffect(() => {
    setName(editSubject);
  }, [editSubject]);

  const customStyles = {
    content: {
      top: '40%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const reRendering = (timeTable) => {
    onSetSubjects(subjects);
    onSetTimeTable(timeTable);
  };

  const handleChangeName = (e) => setName(e.target.value);
  const handleChangeStartTime = (time) =>
    setTime((prev) => {
      return { ...prev, start: time };
    });
  const handleChangeEndTime = (time) =>
    setTime((prev) => {
      return { ...prev, end: time };
    });
  const handleCloseModal = () => handleModal(false);
  const handleRemove = async (e) => {
    e.preventDefault();
    const shortDate = date.format('YY.MM.DD');

    const study = {
      start: startDayjs.toDate(),
      end: endDayjs.toDate(),
      subject: editSubject,
    };

    handleCloseModal();

    const res = await deleteTimeTable(colName, shortDate, study);
    if (res) reRendering(res);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const shortDate = date.format('YY.MM.DD');
    const isAdd = e.target.add;

    const study = {
      start: time.start.toDate(),
      end: time.end.toDate(),
      subject: name,
    };

    handleCloseModal();

    let res = null;
    if (isAdd) {
      // 추가일 경우
      res = await addTimeTable(colName, shortDate, study);
    } else {
      // 편집일 경우
      const originStudy = {
        start: startDayjs.toDate(),
        end: endDayjs.toDate(),
        subject: editSubject,
      };
      res = await updateTimeTable(colName, shortDate, originStudy, study);
    }
    if (res) reRendering(res);
  };

  let subjectNames = [];
  if (!_.isEmpty(subjects)) {
    subjectNames = _.values(subjects).map((subject) => subject.subjectName);
  }
  const [name, setName] = useState(editSubject ? editSubject : subjectNames[0]);
  return (
    <ReactModal
      isOpen={show}
      contentLabel='reuse-modal'
      ariaHideApp={false}
      onRequestClose={handleCloseModal}
      style={customStyles}
    >
      <div className='timetable-modal'>
        <div>공부기록 {role === 'edit' ? '편집' : '추가'}</div>
        <form onSubmit={handleSubmit} noValidate>
          {!_.isEmpty(subjectNames) ? (
            <React.Fragment>
              <FormControl required size='medium'>
                <InputLabel>과목명</InputLabel>
                <Select
                  autoWidth={true}
                  labelId='label'
                  value={name}
                  onChange={handleChangeName}
                >
                  {subjectNames.map((subjectName, i) => (
                    <MenuItem key={i} value={subjectName}>
                      {subjectName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>필수항목</FormHelperText>
              </FormControl>
              <MuiPickersUtilsProvider utils={DayjsUtils}>
                <Grid container direction='column'>
                  <KeyboardTimePicker
                    id='start-time-picker'
                    label='시작 시간'
                    value={time.start}
                    onChange={handleChangeStartTime}
                    margin='dense'
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                  <KeyboardTimePicker
                    id='end-time-picker'
                    label='종료 시간'
                    value={time.end}
                    onChange={handleChangeEndTime}
                    margin='dense'
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </React.Fragment>
          ) : (
            <Box>과목이 없습니다. 편집 화면에서 과목을 추가해주세요.</Box>
          )}

          {role === 'edit' ? (
            <Button name='del' onClick={handleRemove}>
              삭제
            </Button>
          ) : (
            <React.Fragment />
          )}
          <Button onClick={handleCloseModal}>닫기</Button>
          {role === 'add' && !_.isEmpty(subjectNames) ? (
            <Input type='submit' name='add' value='추가' />
          ) : (
            ''
          )}
          {role === 'edit' && !_.isEmpty(subjectNames) ? (
            <Input type='submit' name='sub' value='완료' />
          ) : (
            ''
          )}
        </form>
      </div>
    </ReactModal>
  );
};

export default TimetableModal;

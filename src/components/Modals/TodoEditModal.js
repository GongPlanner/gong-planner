import React from 'react';
import withModal from '../../HOC/withModal';
import './TodoModal.css';
import nothing from '../../image/nothing.png';
import ChangeHistoryRoundedIcon from '@material-ui/icons/ChangeHistoryRounded';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { updateTodos, deleteTodos } from '../../firebase/todoFunction';
import { getData } from '../../firebase/subjectFuntion';

const TodoEditModal = ({
  subjectId,
  colName,
  date,
  todo,
  handleCloseModal,
  reRenderSubject,
}) => {
  const [todoName, setTodoName] = React.useState(todo.todoName);
  const [todoCheck, setTodoCheck] = React.useState(todo.todoCheck);

  const handelChangeName = (e) => {
    setTodoName(e.target.value);
  };

  const handelChangeCheck = (e) => {
    setTodoCheck(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTodos(colName, date, subjectId, todo.id, todoCheck, todoName);
    handleCloseModal();
    handleReRendering();
  };

  const handleDelete = async () => {
    await deleteTodos(
      colName,
      date,
      subjectId,
      todo.id,
      todo.todoCheck,
      todo.todoName
    );
    handleCloseModal();
    handleReRendering();
  };

  const handleReRendering = async () => {
    const tmpSubs = await getData(colName, date);
    reRenderSubject(tmpSubs);
  };

  return (
    <div className='todo-modal'>
      <div>할일 편집</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='todoName'>할일</label>
        <input
          type='text'
          id='todoName'
          placeholder={todoName}
          value={todoName}
          onChange={handelChangeName}
          required
        />
        <div className='state'>
          <label htmlFor='todoCheck'>상태</label>
        </div>
        <div className='radio-input'>
          <label>
            <input
              type='radio'
              name='todoCheck'
              id='nothing'
              value='0'
              checked={todoCheck === '0'}
              onChange={handelChangeCheck}
            />
            <img src={nothing} alt='' />
          </label>
          <label>
            <input
              type='radio'
              name='todoCheck'
              id='notyet'
              value='1'
              checked={todoCheck === '1'}
              onChange={handelChangeCheck}
            />
            <ChangeHistoryRoundedIcon />
          </label>
          <label>
            <input
              type='radio'
              name='todoCheck'
              id='doing'
              value='2'
              checked={todoCheck === '2'}
              onChange={handelChangeCheck}
            />
            <CheckCircleOutlineRoundedIcon />
          </label>
          <label>
            <input
              type='radio'
              name='todoCheck'
              id='done'
              value='3'
              checked={todoCheck === '3'}
              onChange={handelChangeCheck}
            />
            <ClearRoundedIcon />
          </label>
        </div>
        <button type='submit' style={{ float: 'right' }}>
          수정
        </button>
        <button
          type='button'
          onClick={handleDelete}
          style={{ float: 'right', backgroundColor: 'red' }}
        >
          제거
        </button>
      </form>
    </div>
  );
};

export default withModal('*')(TodoEditModal);

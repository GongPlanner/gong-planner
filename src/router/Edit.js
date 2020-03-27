import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import EditSubjectList from '../components/EditSubjectList';
import SubjectAddModal from '../components/Modals/SubjectAddModal';

const Edit = () => {
  return (
    <div className="center edit">
      <div className="row">
        <div className="col s4 offset-s4">
          This is Edit Page
        </div>
        <div className="col s1 offset-11">
          <Link to="/">X</Link>
        </div>
      </div>
      <div className="row">
          <Button onClick={() => {console.log("Yesterday")}}>
            <span>🌗</span>
          </Button>
          <span>2020-03-24</span>
          <Button onClick={() => {console.log("Tomrrow")}}>
            <span>🌓</span>
          </Button>
      </div>
      <div className="row">
        <EditSubjectList/>
      </div>
      <div className="row">
        <SubjectAddModal/>
      </div>
    </div>
  );
}

export default Edit;
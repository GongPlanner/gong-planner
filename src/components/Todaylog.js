import React from 'react'

const Todaylog = () => {
  return(
    <div className="row todaylog">
      <div className="col s5 offset-s2 green one-word">
        <div>오늘의 한마디</div>
        <div>- 열공 ^^7 -</div>
      </div>
      <div className="col s3 blue d-day">
        <div>D-day</div> 
        <div>만족도</div>
      </div>
    </div>
  );
}

export default Todaylog;
import React, { useState, useEffect } from 'react';
import './App.css';
import {sendGetRequest} from './AJAX.jsx';
import MonthYearPicker from 'react-month-year-picker';

function MonthPicker(props) {
  let date = props.date;

  const [visible,updateVisible] = useState(false);

  function showFun () {
    if (visible == false) {
      updateVisible(true);
    }
    else {
      updateVisible(false);
    }
  }

  function pickedYear (year) {
    updateVisible(false);
    props.yearFun(year);
  }

  function pickedMonth (month) {
    updateVisible(false);
    props.monthFun(month);
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let monthName;
  console.log("MONTH: ", date.month);
  for (let i = 0; i < 12; i++) {
    //console.log("SEARCHING: ", months[i]);
    if (date.month == i+1) {
      monthName = months[i];
    }
  }

  if (visible) {
    return (
      <div id = "monthDiv">
        <div id = "monthButton">
          <button id="buttonChangeMonth" onClick={showFun}>{monthName +" "+date.year}</button>
        </div>
        <MonthYearPicker id = "month"
          theme = "dark"
          caption=""
          selectedMonth={date.month}
          selectedYear={date.year}
          minYear={2000}
          maxYear={2022}
          onChangeYear = {pickedYear}
          onChangeMonth = {pickedMonth}
        />
      </div>
    );
  } else {
    return (
      <div id = "monthButton">
        <button id="buttonChangeMonthNot" onClick={showFun}>{monthName +" "+date.year}
        </button>
      </div>
      
    )
  }
}

export default MonthPicker;
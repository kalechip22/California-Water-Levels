import React, {useState, useEffect} from 'react';
import './App.css';
import {sendPostRequest} from './AJAX.jsx';
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import MonthPicker from './MonthPicker.jsx';

function App() {
  const [seeMore, setMore] = useState("hide");
  const [buttonText, setButtonText] = useState("See more");
  const [seeChart, setChart] = useState(false);
  const [date, setDate] = useState({month: 4, year: 2021 });

  function yearChange(newYear) {
    let m = date.month;
    setDate({year: newYear, month: m });
  
  }

  function monthChange(newMonth){
    let y = date.year;
    setDate({month: newMonth, year: y});
  }
  
  // Button that triggers multiple states to
  // view chart & month picker
  function buttonAction() {
    if(seeMore == "hide") {
      setMore("show");
      setButtonText("See less");
      setChart(true);
    } else {
      setMore("hide");
      setButtonText("See more");
      setChart(false);
    }
  }

  if (seeChart) {
    return (
      <WaterDisplay />
    )
  }

  // Component that puts water data into bar chart
  function WaterChart(props) {
    console.log("GIVEN PROPS: ", props)
    const nicknames = new Map();
    nicknames.set(0, 'Shasta');
    nicknames.set(1, 'Oroville');
    nicknames.set(2, 'Trinity Lake');
    nicknames.set(3, 'New Melones');
    nicknames.set(4, 'San Luis');
    nicknames.set(5, 'Don Pedro');
    nicknames.set(6, 'Berryessa');
    
    if (props.waterData) {
      let n = props.waterData.length;
      console.log(props.waterData);
 
      // Set row values for objects
      let capacities = [4552000, 3537577, 2447650, 2400000, 2041000, 2030000, 1602000];
      let capacity = {label: "Reservoir Capacity", data: [], backgroundColor: ["#78C7E3"]}
      let fill = {label: "Reservoir Storage", data: [], backgroundColor: ["#429198"]}
      let labels = [];
      for (let i = 0; i < n; i++) {
        capacity.data.push(parseInt(capacities[i])/100000);
        fill.data.push(parseInt(props.waterData[i].fill)/100000);
        labels.push(nicknames.get(i));
      }

      let chartData = {};
      chartData.labels = labels;
      chartData.datasets = [fill, capacity];
      console.log("CHART DATA: ", chartData);

      let options = {
        plugins: {
          legend: {
            display: false,
          },
        },
        
        type: 'bar',
        responsive: true,
        maintainAspectRatio: true,
        
        scales: {

          x: {
            stacked: true,
            grid: {
              display: false,
            }
          },
          y: {
            grid: {
              display: false,
            }
            
          }
        }
      };

      return (
          <div id="chartContents">
            <Bar options={options} data={chartData} />
          </div>
      )
    }

    else {
      return (
        <p>Error 1</p>
      )
    }
  }

  function WaterDisplay() {
    console.log("in WaterDisplay");
    const [waterData, setWaterData] = useState([]);

    // the empty array as the second argument to useEffect means only run this function on init
    useEffect(initialize,[]);

    // we're not supposed to use an async function as an effect
    // so we hide it in an anonymous function
    let result;
    function initialize () {
  
      (async function () {
        console.log("Doing AJAX request");
        const sentDate = {
          month: date.month,
          year: date.year
        };
        console.log(sentDate);
        result = await sendPostRequest("/query/getCDECData", sentDate);
        setWaterData(result);
        console.log("put in: ", waterData);
        console.log("recieved: ", result);
      
      }) ();
    }
    
    if(waterData) {
      return(
        <main>
        <header>
          Water storage in California reservoirs
        </header>
        <div className = "top">
          <div className = "leftSide">
            <p>
              California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity.
          </p>
          <p>
            California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
          </p>
          <div className = "buttonHolder">
            <button id = "seeLess" onClick={buttonAction}>{buttonText}</button>
          </div>
        </div>
        <div className = "rightSide">
          <img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg"/>
          <p className = "caption">
            Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from <i>The Atlantic </i> article 'Dramatic Photos of California's Historic Drought'
          </p>
        </div>
      </div>
      <div className = {seeMore} id = "showingMore">
        <div className = "bottom">
          <div className = "bottomLeft">
              <div id = "chartContainer">
                <WaterChart waterData={waterData}> </WaterChart>
              </div>
          </div>
          <div className = "bottomRight">
            <p className = "moreCaption">
              Here's a quick look at some of the data on reservoirs from the <a href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the eleven largest in-state reservoirs.
            </p>
            <p className = "changeMonth">Change Month:</p>
            <div>
              <MonthPicker  
              // props 
              date = {date}
              yearFun = {yearChange}
              monthFun = {monthChange}
              />          
          </div>
        </div>
      </div>
      </div>
    </main> 
  );
    }
    else {
      return (
        <p>Error 2</p>
      )
    }
}
  

  
  return(
    <main>
      <header>
        Water storage in California reservoirs
      </header>
      <div className = "top">
        <div className = "leftSide">
          <p>
            California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity.
          </p>
          <p>
            California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
          </p>
          <div className = "buttonHolder">
            <button id = "seeLess" onClick={buttonAction}>{buttonText}</button>
          </div>
        </div>
        <div className = "rightSide">
          <img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg"/>
          <p className = "caption">
            Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from <i>The Atlantic </i> article 'Dramatic Photos of California's Historic Drought'
          </p>
        </div>
      </div>
      
      <div className = {seeMore} id = "showingMore">
        <p className = "moreCaption">
          Here's a quick look at some of the data on reservoirs from the <a href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the eleven largest in-state reservoirs.
        </p>
        <p className = "changeMonth">Change Month:</p>
    </div>
    </main> 
  );
}

export default App;
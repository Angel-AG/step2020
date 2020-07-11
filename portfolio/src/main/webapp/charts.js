// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

google.charts.load('current', { 
    'packages':['corechart', 'bar', 'geochart'],
    'mapsApiKey': 'AIzaSyAocmGfmH_sqksYwwYlEOJ_5jjhneLDCxg'
    });
google.charts.setOnLoadCallback(drawCharts);

/** Fetches covid data and uses it to create a chart. */
function drawCharts() {
  fetch('/get-covidData').then(response => {
    if (response.status === 200) {
      response.json().then((covidData) => {
        createChartBySex(covidData['covidBySex']);
        createChartByMunicipality(covidData['covidByMunicipality']);
        createChartByAgeRange(covidData['covidByAgeRange']);
        createChartByState(covidData['deathsByState']);
      });
    } else {
      alert('Sorry, something went wrong. Try again later')
    }
  });
}

/**
 * Create a donut chart, showing cases by sex.
 * @param {Object<string, number>} covidData 
 */
function createChartBySex(covidData) {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Sex');
  data.addColumn('number', 'Covid-19 Cases');

  data.addRows([
    ['Women', covidData['M']],
    ['Men', covidData['H']]
  ]);

  const options = {
    chartArea: {
      height: '80%',
      width: '80%'
    },
    legend: {alignment: 'center', position: 'bottom'},
    title: 'Covid-19 Cases: Women and Men',
    pieHole: 0.4,
    width: 500,
    height: 400
  };

  const chart = new google.visualization.PieChart(
    document.getElementById('covidBySex-container'));
  chart.draw(data, options);
}

/**
 * Create a bar chart showing the no. of cases in
 * each municipality. In descending order, from
 * top to bottom
 * @param {Object<string, number>} covidData 
 */
function createChartByMunicipality(covidData) {
  const data = new google.visualization.DataTable();
  data.addColumn('string', '');
  data.addColumn('number', 'Covid-19 Cases');

  Object.keys(covidData).forEach((municipality) => {
    data.addRow([municipality, covidData[municipality]]);
  });
  
  const options = {
    axes: {
      x: {
        0: { 
          side: 'top',
          label: 'No. of confirmed cases',
          range: {min: 0, max: covidData[Object.keys(covidData)[0]]}},
      }
    },
    bars: 'horizontal',
    chart: {
      title: 'Cumulative Confirmed Covid-19 Cases (Municipality)'
    },
    colors: ['red'],
    hAxis: {
      baselineColor: '#fff',
      format: 'decimal'
    },
    height: 1200,
    legend: { position: 'none'},
    width: 800
  };

  const chart = new google.charts.Bar(
    document.getElementById('covidByMunicipality-container'));
  chart.draw(data, google.charts.Bar.convertOptions(options));
}

/**
 * Create a histogram with data the age of positive cases
 * @param {Object<string, number>} covidData 
 */
function createChartByAgeRange(covidData) {
  const data = new google.visualization.DataTable();
  data.addColumn('string', '');
  data.addColumn('number', 'Covid-19 Cases');

  Object.keys(covidData).forEach((idEntry) => {
    data.addRow([idEntry, covidData[idEntry]]);
  });

  const options = {
    chartArea: {
      height: '80%',
      width: '80%'
    },
    colors: ['red'],
    dataOpacity: .9,
    hAxis: {
      slantedText: true,
      slantedTextAngle: 60,
      showTextEvery: 1,
      viewWindowMode: 'maximized'
    },
    histogram: { bucketSize: 5},
    height: 400,
    legend: { position: 'none'},
    title: 'Cumulative Confirmed Covid-19 Cases (Age Range)',
    vAxis: {
      baselineColor: '#fff',
      format: 'decimal',
      viewWindowMode: 'maximized'
    },
    width: 800
  };

  const chart = new google.visualization.Histogram(
      document.getElementById('covidByAgeRange-container'));
  chart.draw(data, options);
}

function createChartByState(covidData) {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'State');
  data.addColumn('number', 'Deaths by Covid-19');

  Object.keys(covidData).forEach((state) => {
    data.addRow([state, covidData[state]]);
  });

  const options = {
    colorAxis: { colors: [
      'lightgrey', '#999', 
      'grey', '#666', 'black']
    },
    datalessRegionColor: '#fff',
    region: 'MX',
    resolution: 'provinces'
  };

  const chart = new google.visualization.GeoChart(
    document.getElementById('covidByState-container'));
  chart.draw(data, options);
}

/**
 * Show the content linked to the clickted tab
 * @param {Element} tab The button tab that was clicked
 */
function openTab(tab) {
  // Hide all tabs content
  const tabContents = document.getElementsByClassName('tab-content');
  for (const content of tabContents) {
    content.style.height =  '1px';
    content.style.overflow = 'hidden';
    content.style.visibility = 'hidden';
  }

  // Clean any tabLink that has the active class
  const tabLinks = document.getElementsByClassName('tab-link');
  for (const link of tabLinks) {
    link.className = link.className.replace(' active', '');
  }

  // Show container selected
  const tabChart = document.getElementById(`${tab.value}-container`); 
  tabChart.style.height = 'auto';
  tabChart.style.overflow = 'auto';
  tabChart.style.visibility = 'visible';
  tab.className += ' active';
}

/**
 * Add a click event to tabs
 */
function init() {
  const tabs = document.getElementsByClassName('tab-link');
  for (const tab of tabs) {
    tab.addEventListener('click', (event) => {
      openTab(event.target);
    })
  }
}

// Set up tabs
document.addEventListener('DOMContentLoaded', () => {
  init();
});

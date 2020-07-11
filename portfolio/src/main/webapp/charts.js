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

const DONUT_OPTIONS = { 
  chartArea: {
      height: '80%',
      width: '80%'
    },
  legend: {alignment: 'center', position: 'bottom'},
  pieHole: 0.4,
  title: '',
  width: 500,
  height: 400
};

const BAR_OPTIONS = {
  axes: {
    x: {
      0: { 
        side: 'top',
        range: {min: 0, max: 10000}
      }
    }
  },
  bars: 'horizontal',
  chart: {
    title: ''
  },
  colors: ['red'],
  hAxis: {
    baselineColor: '#fff',
    format: 'decimal'
  },
  height: 1200,
  legend: { position: 'none'},
  width: 800
}

const HISTO_OPTIONS = {
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
  title: '',
  vAxis: {
    baselineColor: '#fff',
    format: 'decimal',
    viewWindowMode: 'maximized'
  },
  width: 800
};

const GEO_OPTIONS = {
  colorAxis: { 
    colors: [
      'lightgrey', '#999', 
      'grey', '#666', 'black'
    ]
  },
  datalessRegionColor: '#fff',
  region: 'MX',
  resolution: 'provinces',
  title: ''
};

/** Fetches covid data and uses it to create a chart. */
function drawCharts() {
  fetch('/get-covidData').then(response => {
    if (response.status === 200) {
      response.json().then((covidData) => {
        createChart(covidData['covidBySex'],
            'Covid-19 Cases: Women and Men', 'Sex', 'Covid-19 Cases',
            'DonutChart', 'covidBySex-container');
        createChart(covidData['covidByMunicipality'],
            'Covid-19 Cases by Municipality', 'Municipality', 'Covid-19 Cases',
            'BarChart', 'covidByMunicipality-container');
        createChart(covidData['covidByAgeRange'],
            'Covid-19 Cases by Age Range', 'Case', 'Age',
            'Histogram', 'covidByAgeRange-container');
        createChart(covidData['deathsByState'],
            'Mexico: Deaths by State', 'State', 'Deaths by Covid-19',
            'GeoChart', 'covidByState-container');
      });
    } else {
      alert('Sorry, something went wrong. Try again later')
    }
  });
}

/** 
 * Create a Google Chart according to the arguments passed
 * @param {Object<string, number>} covidData 
 * @param {string} title The title for the chart
 * @param {string} col1 The name for the first column of the DataTable
 * @param {string} col2 The name for the second column of the DataTable
 * @param {string} chartType The name of the type of chart to create
 * @param {string} chartContainer The id of the container for the chart
 */
function createChart(covidData, title, col1, col2, chartType, chartContainer) {
  const data = new google.visualization.DataTable();
  data.addColumn('string', col1);
  data.addColumn('number', col2);

  Object.keys(covidData).forEach((entry) => {
    data.addRow([entry, covidData[entry]]);
  });

  const container = document.getElementById(chartContainer);

  let chart;
  switch (chartType.toLowerCase()) {
    case 'donutchart':
      DONUT_OPTIONS.title = title;
      chart = new google.visualization.PieChart(container);
      chart.draw(data, DONUT_OPTIONS);
      break;
    case 'barchart':
      BAR_OPTIONS.chart.title = title;
      BAR_OPTIONS.axes.x[0].range.max = covidData[Object.keys(covidData)[0]];
      chart = new google.charts.Bar(container);
      chart.draw(data, google.charts.Bar.convertOptions(BAR_OPTIONS));
      break;
    case 'histogram':
      HISTO_OPTIONS.title = title;
      chart = new google.visualization.Histogram(container);
      chart.draw(data, HISTO_OPTIONS);
      break;
    case 'geochart':
      GEO_OPTIONS.title = title;
      chart = new google.visualization.GeoChart(container);
      chart.draw(data, GEO_OPTIONS);
      break;
  } 
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

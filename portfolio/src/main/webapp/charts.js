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

google.charts.load('current', {'packages':['corechart', 'bar']});
google.charts.setOnLoadCallback(drawCharts);

/** Fetches covid data and uses it to create a chart. */
function drawCharts() {
  fetch('/get-covidTampsData').then(response => response.json())
  .then((covidData) => {
    console.log(covidData);
    createChartBySex(covidData["covidBySex"]);
    createChartByMunicipality(covidData["covidByMunicipality"]);
    createChartByAgeRange(covidData["covidByAgeRange"]);
  });
}

function createChartBySex(covidData) {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Sex');
  data.addColumn('number', 'Covid-19 Cases');

  data.addRows([
    ["Women", covidData['M']],
    ["Men", covidData['H']]
  ]);

  const options = {
    legend: {alignment: 'center', position: 'bottom'},
    title: 'Covid-19 Cases: Women and Men',
    pieHole: 0.4,
    width: 600,
    height: 500
  };

  const chart = new google.visualization.PieChart(
    document.getElementById('covidBySex-container'));
  chart.draw(data, options);
}

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

function createChartByAgeRange(covidData) {
  const data = new google.visualization.DataTable();
  data.addColumn('string', '');
  data.addColumn('number', 'Covid-19 Cases');

  Object.keys(covidData).forEach((idEntry) => {
    data.addRow([idEntry, covidData[idEntry]]);
  });

  const options = {
    colors: ['red'],
    dataOpacity: .9,
    hAxis: {
      slantedText: true,
      slantedTextAngle: 60,
      showTextEvery: 1,
      viewWindowMode: 'maximized'
    },
    histogram: { bucketSize: 5},
    height: 550,
    legend: { position: 'none'},
    title: 'Cumulative Confirmed Covid-19 Cases (Age Range)',
    vAxis: {
      baselineColor: '#fff',
      format: 'decimal',
      viewWindowMode: 'maximized'
    },
    width: 950
  };

  const chart = new google.visualization.Histogram(
      document.getElementById('covidByAgeRange-container'));
  chart.draw(data, options);
}
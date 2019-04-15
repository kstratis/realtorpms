import Looper from "../bundles/themes/main_theme";
import Chart from 'chart.js';

function completionTasksChart (themeInstance) {
  const data = {
    labels: ['21 Mar', '22 Mar', '23 Mar', '24 Mar', '25 Mar', '26 Mar', '27 Mar'],
  datasets: [
    { label: I18n.t("main.chart.properties"),
      // backgroundColor: "rgba(163, 185, 210, 0.7)",
      backgroundColor: themeInstance.getColors('brand').indigo,
      // borderColor: "#4773a5",
      borderColor:  themeInstance.getColors('brand').indigo,
      lineTension: 0.000001,
      data: [Property.count]
    },
    {
      label: I18n.t("main.chart.clients"),
      backgroundColor: "rgba(163, 185, 210, 0.7)",
      borderColor: "#4773a5",
      lineTension: 0.000001,
      data: [User.count]
    }]
    // datasets: [{
    //   backgroundColor: themeInstance.getColors('brand').indigo,
    //   borderColor: themeInstance.getColors('brand').indigo,
    //   data: [155, 65, 465, 265, 225, 325, 80]
    // }]
  };
  // init chart bar
  const canvas = $('#completion-tasks')[0].getContext('2d')
  let chart = new Chart(canvas, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      legend: { display: false },
      title: { display: false },
      scales: {
        xAxes: [{
          gridLines: {
            display: true,
            drawBorder: false,
            drawOnChartArea: false
          },
          ticks: {
            maxRotation: 0,
            maxTicksLimit: 3
          }
        }],
        yAxes: [{
          gridLines: {
            display: true,
            drawBorder: false
          },
          ticks: {
            beginAtZero: true,
            stepSize: 100
          }
        }]
      }
    }
  })
}


$(document).on('turbolinks:load', function(e) {
  // Initialize the theme
  const themeInstance = Looper();

  completionTasksChart(themeInstance);
});

import Looper from "../bundles/themes/main_theme";
import Chart from 'chart.js';

function completionTasksChart (themeInstance) {

  const data = JSON.parse(document.getElementById('stats_data').dataset.graph);
  data.datasets[0].backgroundColor = themeInstance.getColors('brand').indigo;
  data.datasets[0].borderColor= themeInstance.getColors('brand').indigo;
//   const data = {
//     labels: ['apples', 'tomatoes'],
//     datasets: [
//       {
//         label: "apples",
//         // backgroundColor: "rgba(163, 185, 210, 0.7)",
//         backgroundColor: themeInstance.getColors('brand').indigo,
//         // borderColor: "#4773a5",
//         borderColor: themeInstance.getColors('brand').indigo,
//         lineTension: 0.000001,
//         data: [20, 34, 22]
//       },
//       {
//         label: "tomatoes",
//         backgroundColor: "rgba(163, 185, 210, 0.7)",
//         borderColor: "#4773a5",
//         lineTension: 0.000001,
//         data: [150]
//       }]
// };
    // datasets: [{
    //   backgroundColor: themeInstance.getColors('brand').indigo,
    //   borderColor: themeInstance.getColors('brand').indigo,
    //   data: [155, 65, 465, 265, 225, 325, 80]
    // }]

  // init chart bar
  const canvas = $('canvas.chart')[0].getContext('2d');
  let chart = new Chart(canvas, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
  // Initialize the chart
  if ($('canvas.chart').length < 1) return;
  completionTasksChart(themeInstance);
});

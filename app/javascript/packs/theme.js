import Looper from "../bundles/themes/main_theme";
import Chart from 'chart.js';

function completionTasksChart (themeInstance) {

  const data = JSON.parse(document.getElementById('stats_data').dataset.graph);
  // data.datasets[0].backgroundColor = themeInstance.getColors('brand').indigo;
  data.datasets[0].backgroundColor = [
    // themeInstance.getColors('brand').red,
    themeInstance.getColors('brand').purple,
    // themeInstance.getColors('brand').indigo,
    themeInstance.getColors('brand').teal,
    themeInstance.getColors('brand').yellow,
  ];
  // data.datasets[0].borderColor = themeInstance.getColors('brand').indigo;
  data.datasets[0].borderColor = '#ffffff';
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
  const canvas1 = $('canvas.chart')[0].getContext('2d');
  let chart1 = new Chart(canvas1, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: true, position: 'bottom' },
      title: { display: false },
      // scales: {
      //   xAxes: [{
      //     gridLines: {
      //       display: true,
      //       drawBorder: false,
      //       drawOnChartArea: false
      //     },
      //     ticks: {
      //       maxRotation: 0,
      //       maxTicksLimit: 3
      //     }
      //   }],
      //   yAxes: [{
      //     gridLines: {
      //       display: true,
      //       drawBorder: false
      //     },
      //     ticks: {
      //       beginAtZero: true,
      //       stepSize: 100
      //     }
      //   }]
      // }
    }
  });


  // const canvas2 = $('canvas.chart')[1].getContext('2d');
  // let chart2 = new Chart(canvas2, {
  //   type: 'doughnut',
  //   data: data,
  //   options: {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     legend: { display: true },
  //     title: { display: false },
  //   }
  // });
}

$(document).on('turbolinks:load', function(e) {
  // Initialize the perfect scrollbar plugin
  // window.PerfectScrollbar = PerfectScrollbar;
  // Initialize the theme
  const themeInstance = Looper();
  // Initialize the chart
  if ($('canvas.chart').length < 1) return;
  completionTasksChart(themeInstance);
});

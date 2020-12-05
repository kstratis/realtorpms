import Looper from '../bundles/themes/main_theme';
import Chart from 'chart.js';

function completionTasksChart(themeInstance) {
  const data = JSON.parse(document.getElementById('stats_data').dataset.graph);
  // data.datasets[0].backgroundColor = themeInstance.getColors('brand').indigo;
  data.datasets[0].backgroundColor = [
    // themeInstance.getColors('brand').red,
    themeInstance.getColors('brand').purple,
    // themeInstance.getColors('brand').indigo,
    themeInstance.getColors('brand').teal,
    themeInstance.getColors('brand').yellow,
  ];

  data.datasets[0].borderColor = '#ffffff';
  let canvas = document.getElementById('overview-chart');
  let ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: { display: true, position: 'right' },
      title: { display: false },
      fontFamily: '"Noto Sans", Arial, sans-serif',
      tooltips: {
        xPadding: 10,
        yPadding: 10,
        titleMargin: 10,
        footerMargin: 10,
        titleSpacing: 10,
      },
    },
  });
}

$(document).on('turbolinks:load', function (e) {
  const themeInstance = Looper();
  if ($('#overview-chart').length < 1) return;
  completionTasksChart(themeInstance);
});

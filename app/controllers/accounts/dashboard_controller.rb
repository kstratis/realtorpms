module Accounts
  class DashboardController < Accounts::BaseController
    def index
      @data = {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
              {
                  label: I18n.t("main.chart.properties"),
                  backgroundColor: "rgba(163, 185, 210, 0.7)",
                  borderColor: "#4773a5",
                  lineTension: 0.000001,
                  data: [65, 59, 80, 81, 56, 55, 40]
              }
          ]
      }
      @options = {
          responsive: true,
          maintainAspectRatio: false
      }
    end
  end
end


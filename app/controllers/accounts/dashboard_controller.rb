module Accounts
  class DashboardController < Accounts::BaseController
    def index
      @graph = {
          labels: [I18n.t('main.chart.properties'), I18n.t('main.chart.users')],
          datasets: [
              {
                  # label: I18n.t("main.chart.properties"),
                  backgroundColor: "rgba(163, 185, 210, 0.7)",
                  borderColor: "#4773a5",
                  lineTension: 0.000001,
                  data: [current_account.properties.count, current_account.users.count]
              }
          ]
      }
    end
  end
end


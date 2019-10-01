module Accounts
  class DashboardController < Accounts::BaseController
    def index
      @log = Log.where(created_at: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day, account: current_account).order(created_at: 'desc').limit(9)
      @graph = {
          labels: [I18n.t('main.chart.properties'), I18n.t('main.chart.users'), I18n.t('main.chart.clients')],
          datasets: [
              {
                  # label: I18n.t("main.chart.properties"),
                  backgroundColor: "rgba(163, 185, 210, 0.7)",
                  borderColor: "#4773a5",
                  lineTension: 0.000001,
                  data: [current_account.properties.count, current_account.users.count, current_account.clients.count]
              }
          ]
      }
    end
  end
end


module Accounts
  class DashboardController < Accounts::BaseController
    def index
      # This basically finds the latest 3 entries of the last 3 groups of events partitioned by day with a maximum of 9 total entries
      # References:
      # https://stackoverflow.com/questions/1313120/retrieving-the-last-record-in-each-group-mysql
      # https://stackoverflow.com/questions/6133107/extract-date-yyyy-mm-dd-from-a-timestamp-in-postgresql
      # https://stackoverflow.com/questions/1124603/grouped-limit-in-postgresql-show-the-first-n-rows-for-each-group
      # https://stackoverflow.com/questions/55278576/postgresql-limit-by-n-groups
      # https://docs.microsoft.com/en-us/sql/t-sql/functions/dense-rank-transact-sql?view=sql-server-2017
      # http://www.postgresqltutorial.com/postgresql-dense_rank-function/
      sql = %{
        SELECT
	        *
        FROM (
	        SELECT
		        ROW_NUMBER() OVER (PARTITION BY created_at::date ORDER BY created_at::time DESC) AS row_number,
		        DENSE_RANK() OVER (ORDER BY created_at::date DESC) AS group_number, l.*
	        FROM
		        logs l
          WHERE account_id=#{current_account.id}) subquery
        WHERE
	        subquery.row_number <= 3
	        AND group_number <=3
        ORDER BY created_at DESC
	      LIMIT 9;
      }.gsub(/\s+/, " ").strip
      @events = Log.find_by_sql(sql).group_by{ |t| t.created_at.beginning_of_day }
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


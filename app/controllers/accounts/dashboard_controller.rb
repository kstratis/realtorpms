module Accounts
  class DashboardController < Accounts::BaseController
    def index
      @calendar_events = calendar_events_data(current_user, Time.current.to_date.to_s)
      sql = %{
        SELECT
          categories.parent_slug AS category,
          count(categories.parent_slug) AS count
        FROM
          "properties"
        INNER JOIN "categories" ON "categories"."id" = "properties"."category_id"
        WHERE
          "properties"."account_id" = #{current_account.id}
        GROUP BY
          categories.parent_slug;
      }.gsub(/\s+/, " ").strip
      @properties_stats = ActiveRecord::Base.connection.execute(sql).values.to_h
      @graph = {
          labels: [I18n.t('activerecord.attributes.property.enums.category.residential'),
                   I18n.t('activerecord.attributes.property.enums.category.commercial'),
                   I18n.t('activerecord.attributes.property.enums.category.land'),
                   I18n.t('activerecord.attributes.property.enums.category.other')],
          datasets: [
              {
                  # label: I18n.t("main.chart.properties"),
                  backgroundColor: "rgba(163, 185, 210, 0.7)",
                  borderColor: "#4773a5",
                  lineTension: 0.000001,
                  data: [@properties_stats.fetch('residential', 0),
                         @properties_stats.fetch('commercial', 0),
                         @properties_stats.fetch('land', 0),
                         @properties_stats.fetch('other', 0)]
              }
          ]
      }
    end
  end
end


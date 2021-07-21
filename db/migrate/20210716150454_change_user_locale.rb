class ChangeUserLocale < ActiveRecord::Migration[6.1]
  change_column :users, :locale, 'integer USING CAST(locale AS integer)'
end

json.extract! user, :id, :first_name, :last_name, :email, :user_type, :branch_office, :created_at, :updated_at
json.url user_url(user, format: :json)

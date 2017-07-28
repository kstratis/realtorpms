require 'test_helper'

class UsersIndexTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
  end

  test 'index including pagination' do
    log_in_as(@user)
    get users_path
    assert_template 'users/index'
    assert_select 'div.pagination'
    # This empty space below is special and checks for non breaking space
    User.paginate(page: 1).each do |user|
      assert_select 'div.col-md-12 > a[href=?]', user_path(user)
      assert_select 'div.user_info_text > span.name', text: user.first_name + ' ' + user.last_name
      assert_select 'div.user_info_text > span.email', text: user.email
    end
  end
end

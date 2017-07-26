require 'test_helper'

class SessionsHelperTest < ActionView::TestCase

  def setup
    @user = users(:michael)
    # we don't login so that we can only check cookies.
    # this way current_user in sessions_helper will fall off to the elsif
    remember(@user)
  end

  test 'current_user returns right user when session is nil' do
    assert_equal @user, current_user
    assert is_logged_in?
  end

  test 'current_user returns nil when remember digest is wrong' do
    @user.update_attribute(:remember_digest, User.digest(User.new_token))
    # this should be nil cause the remember method in setup caters for a token already.
    # updating it here will cause the test to fail. miserably.
    assert_nil current_user
  end
end
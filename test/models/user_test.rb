require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    @user = User.new(first_name: 'Lakis', last_name: 'Euthimiou', email: 'loverman210@yahoo.gr', age: 45,
                     office_branch: 'vari', phone1: 6974141223)
  end

  test 'should be valid' do
    assert @user.valid?
  end

  test 'first name should be present' do
    @user.first_name = '     '
    assert_not @user.valid?
  end

  test 'last name should be present' do
    @user.last_name = '     '
    assert_not @user.valid?
  end

  test 'email should be present' do
    @user.email = '     '
    assert_not @user.valid?
  end
end

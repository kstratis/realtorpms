FactoryBot.define do
  factory :client, :class => Client do

    first_name {'Jim' }
    last_name {'Sturges' }
    email {'jim@gmail.com' }
    telephones {'6977256454, 2108976555'}
    job {'chef'}

    transient do
      account { Account.first }

    end

    before(:create) do |client, evaluator|
      client.account = evaluator.account
      client.model_type = evaluator.account.model_types.find_by(name: 'clients')
    end

  end
end

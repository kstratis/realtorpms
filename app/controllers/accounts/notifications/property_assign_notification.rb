# To deliver this notification:
#
# PropertyAssignNotification.with(post: @post).deliver_later(current_user)
# PropertyAssignNotification.with(post: @post).deliver(current_user)
module Accounts
  module Notifications
    class PropertyAssignNotification < Noticed::Base
      # Add your delivery methods
      #
      deliver_by :database, format: :to_database
      # deliver_by :email, mailer: "UserMailer"
      # deliver_by :slack
      # deliver_by :custom, class: "MyDeliveryMethod"

      # params is a hash
      # params[:payload] should be a string
      # params[:account] should be an object
      def to_database
        { type: self.class.name,
          params: params[:payload],
          account: params[:account]
        }
      end

      # Add required params
      #
      param :payload, :account

      # Define helper methods to make rendering easier.
      #
      def message
        'hello notification'
      end

      #
      def url
        'www.in.gr'
      end
    end
  end
end
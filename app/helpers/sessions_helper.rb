module SessionsHelper
  # Logs in the given user.
  def log_in(user)
    session[:user_id] = user.id
  end

  # Remembers a user in a persistent session.
  def remember(user)
    user.remember
    cookies.permanent.signed[:user_id] = user.id
    cookies.permanent[:remember_token] = user.remember_token
  end

  # Returns the user corresponding to the remember token cookie.
  # noinspection RailsChecklist05
  def current_user
    if (user_id = session[:user_id])
      @current_user ||= User.find_by(id: user_id)
    elsif (user_id = cookies.signed[:user_id])
      # raise # This should make everything fail. If things don't fail this part of the code is untested
      user = User.find_by(id: user_id)
      if user && user.authenticated?(:remember, cookies[:remember_token])
        log_in user
        @current_user = user
      end
    end
  end

  # Returns true if the given user is the current user.
  def current_user?(user)
    user == current_user
  end

  # Returns true if the user is logged in, false otherwise.
  def logged_in?
    !current_user.nil?
  end

  # Forgets a persistent session.
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  def log_out
    forget(current_user)
    session.delete(:user_id)
    session.delete(:referer_url)
    @current_user = nil
  end

  def build_redirection_url(stored_url, subdomain)
    # extracted_subdomain = stored_url.host.split('.')[0..-3].join('.')
    extracted_hostname = stored_url.host.split('.').last(2).join('.')
    #puts "extracted subdomain is: #{extracted_subdomain}"
    #puts "extracted hostname is: #{extracted_hostname}"
    port =  stored_url.port.blank? ? nil : ":#{stored_url.port}"

    if subdomain.blank?
      return "#{stored_url.scheme}://#{extracted_hostname}#{port}#{stored_url.path}"
    end
    # puts "full redirection url is: #{stored_url.scheme}://#{subdomain}.#{extracted_hostname}#{port}#{stored_url.path}"
    "#{stored_url.scheme}://#{subdomain}.#{extracted_hostname}#{port}#{stored_url.path}"
  end

  # Redirects to stored location (or to the default).
  def redirect_back_or(default, subdomain)
    # puts "subdomain is: #{subdomain}"
    # puts "the url is: #{session[:forwarding_url]}"

    # obj.host.split('.')[0..-3].join(".")
    # saved_url = session[:forwarding_url]
    begin
      stored_url = URI.parse(session[:forwarding_url])
    rescue
      stored_url = nil
    end


    # full_redirection_url = build_redirection_url(stored_url, subdomain)
    # puts "full redirection url is: #{stored_url.scheme}://#{subdomain}.#{extracted_hostname}#{stored_url.path}"
    # obj.host.split('.').last(2).join('.')
    # puts "the domain is: #{uri.domain}"
    # redirect_to uri(subdomain: subdomain)
    # redirect_to subdomain: subdomain
    if stored_url.nil?
      redirect_to root_url(subdomain: subdomain) # make the subdomain explicit
    else
      redirect_to build_redirection_url(stored_url, subdomain)
      session.delete(:forwarding_url)
    end

  end

  # Stores the URL trying to be accessed.
  def store_location
    session[:forwarding_url] = request.original_url if request.get?
  end


  # Retrieves the subdomain
  def get_subdomain(user)


    # subdomain = Account.get_subdomain(user)
    # if request.subdomain.blank?
    #   subdomain
    # else
    #   request.subdomain == subdomain ? subdomain : nil
    # end




  end





end

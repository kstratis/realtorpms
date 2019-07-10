Grover.configure do |config|
  config.options = {
      display_url: 'http://shakalaka.lvh.me:3000/',
      cache: false
      # debug: {
      #   headless: false,  # Default true. When set to false, the Chromium browser will be displayed
      #   devtools: true    # Default false. When set to true, the browser devtools will be displayed.
      # }

  }
end
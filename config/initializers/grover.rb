Grover.configure do |config|
  config.options = {
      display_url: 'http://shakalaka.lvh.me:3000/',
      format: 'A4',
      margin: {
        top: '5px',
        bottom: '10cm'
      },
      prefer_css_page_size: true,
      emulate_media: 'screen',
      cache: false,
      timeout: 0 # Timeout in
      # cache: false
      # debug: {
      #   headless: false,  # Default true. When set to false, the Chromium browser will be displayed
      #   devtools: true    # Default false. When set to true, the browser devtools will be displayed.
      # }

  }
end
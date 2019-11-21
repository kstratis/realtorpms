if Rails.env.development?
  ENV['MEDIA_DIR'] = '/Users/kstratis/efi_pics/'
end

if Rails.env.staging?
  ENV['MEDIA_DIR'] = '/home/deploy/media/'
end

if Rails.env.production?
  ENV['MEDIA_DIR'] = '/home/deploy/media/'
end
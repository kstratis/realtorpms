if Rails.env.development?
  ENV['SEEDS_MEDIA_DIR'] = '/Users/kstratis/efi_pics/'
end

if Rails.env.staging?
  ENV['SEEDS_MEDIA_DIR'] = '/home/deploy/media/'
end

if Rails.env.production?
  ENV['SEEDS_MEDIA_DIR'] = '/home/deploy/media/'
end
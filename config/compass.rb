require 'compass-growl'

http_path = '/'
css_dir = 'public/assets/stylesheets'
sass_dir = 'src/sass'
images_dir = 'public/assets/images'

output_style = :compressed
relative_assets = true
line_comments = false

def is_32bit?(filename)
  filename.match(/^png(24|32)/)
end

def compress_png(filename)
  png8_filename = filename.sub(/\.png/, '-fs8.png')
  system 'src/pngquant/pngquant ' << filename
  sleep 2
  system 'mv -f ' << png8_filename << ' ' << filename
end

def optimize_further(image_app, filename)
  system 'open -a Image' << image_app << '.app ' << filename
end

def growl(msg)
  GNTP.notify({
    :title    => "Compass",
    :text     => msg,
    :icon     => "file://#{CompassGrowl::ICON}"
  })
end

on_sprite_saved do |filename|
  unless is_32bit?(filename)
    compress_png filename
    optimize_further 'Optim', filename
  else 
    optimize_further 'Alpha', filename
  end
  growl('Sprite: ' + filename + ' complete')
end

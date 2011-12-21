# Watches haml and scss (compass) files for changes
# compiles all to public directory

guard 'compass' do
  watch /^.+(\.s[ac]ss)/
end

guard 'process', :name => 'Minify JS', :command => 'juicer merge public/assets/javascripts/project/application.js -o public/assets/javascripts/compiled/all.min.js --force -s' do
  watch /^public\/assets\/javascripts\/project\/.+\.js/
end

guard 'livereload', :apply_js_live => true, :apply_css_live => true do
  watch /^.+(\.css)/
  watch /^public\/assets\/javascripts\/compiled\/.+\.js/
end

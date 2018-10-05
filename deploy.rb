#!/usr/bin/env ruby

require_relative 'scripts/colors.rb'
require_relative 'scripts/version.rb'

env = 'production'

puts "Deploying #{green env} build..."

trap('INT') do
  puts "\rDeploy cancelled !"
  exit
end

def only_minor(version)
  return nil unless version
  version.split('.')[0..1].join('.')
end

def remove_old_tags(current_version)
  old_tags = `git tag -l 'v#{only_minor(current_version)}*'`.split("\n")
  old_tags.each do |t|
    puts "Deleting tag #{red t}..."
    `git push --delete origin #{t}`
    `git tag --delete #{t}`
  end
end

def build(version, env)
  pre_cmd = "VERSION=#{version}"
  cmd = "#{pre_cmd} NO_VERBOSE_BUILD=true yarn build"
  puts "Running #{cmd}"
  system cmd
end

st = `git status`
if st =~ /Changes not staged for commit/
  puts "You have #{red('unstaged changes')}, are you sure ? (CTRL-C to exit)"
  $stdin.gets
end

if st =~ /Untracked files/
  puts "You have #{red('untracked files')}, are you sure ? (CTRL-C to exit)"
  $stdin.gets
end

puts cyan 'Fetching all...'
`git fetch --all`
`git tag -l | xargs git tag -d`
`git fetch --tags 2> /dev/null`

puts cyan 'Do you want to bump the version ? [Y/n]'

vbump = $stdin.gets.strip != 'n'
version = vbump ? set_new_version : current_version

puts "Deploying v#{cyan version} of front app"
sleep 2

unless build(version, env)
  puts red 'Failed to build !'
  exit
end

print GREY

bucket = 'home.insynia.com'

system "gsutil rsync -d -r ./build gs://#{bucket}/"
print NC

puts

puts green "App v#{version} has been deployed !"
return unless vbump
remove_old_tags(version)
system "git tag v#{version}"
system "git push origin v#{version}"
puts
puts green "Release/tag v#{version} created"
puts "Env: #{cyan env} successfully deployed !"

#!/usr/bin/env ruby

require 'json'
require_relative 'colors.rb'

trap('INT') do
  puts "\rCancelled !"
  exit
end

def ask_type_of_update
  loop do
    puts 'Please chose update type:'
    puts '1: Major'
    puts '2: Minor'
    puts '3: Patch'
    input = $stdin.gets.to_i
    if [1, 2, 3].include? input
      return { 1 => :major, 2 => :minor, 3 => :patch }[input]
    end
  end
end

def major(vs)
  [vs[0].to_i + 1, 0, 0].join('.')
end

def minor(vs)
  [vs[0], vs[1].to_i + 1, 0].join('.')
end

def patch(vs)
  [vs[0], vs[1], vs[2].to_i + 1].join('.')
end

def increment_version(vs, deploy)
  case deploy
  when :major
    major(vs)
  when :minor
    minor(vs)
  when :patch
    patch(vs)
  else
    raise red('ERROR ! Cannot get new version')
  end
end

def get_new_version(v, deploy)
  vs = v.split('.')
  raise red('CURRENT VERSION BADLY FORMATTED') unless vs.length == 3
  increment_version(vs, deploy)
end

def current_package
  JSON.parse(File.read('package.json'))
end

def current_version
  current_package['version']
end

def commit_version
  `git add package.json`
  `git commit -m 'Bump version'`
  puts green 'Bump commit created'
end

def set_new_version
  v = current_version
  new_package = current_package

  puts "Current version: #{cyan v}"
  type_of_update ||= ask_type_of_update
  new_v = get_new_version(v, type_of_update)

  new_package['version'] = new_v
  File.write('package.json', JSON.pretty_generate(new_package) + "\n")

  puts "New version: #{cyan new_v}"
  commit_version
  new_v
end

set_new_version if $PROGRAM_NAME == __FILE__

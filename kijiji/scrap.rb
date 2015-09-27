#!/usr/bin/env ruby

url = ARGV[0]

#puts url

data = `lynx -dump #{url}`

put data.match(/\*[A-Za-z0-9:\[\],. $]+/)

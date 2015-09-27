#!/usr/bin/env ruby

url = ARGV[0]

#puts url
require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'json'
node = Nokogiri.HTML(open(url))

price = node.xpath("/html/body[@id='PageVIP']/div[@id='MainContainer']/div[@class='layout-2']/div[@class='col-1']/div[@id='itemdetails']/div[@class='col-2']/table[@class='ad-attributes']/tr[2]/td/div/span/strong").text()
date = node.xpath("/html/body[@id='PageVIP']/div[@id='MainContainer']/div[@class='layout-2']/div[@class='col-1']/div[@id='itemdetails']/div[@class='col-2']/table[@class='ad-attributes']/tr[1]/td").text()
addr = node.xpath("/html/body[@id='PageVIP']/div[@id='MainContainer']/div[@class='layout-2']/div[@class='col-1']/div[@id='itemdetails']/div[@class='col-2']/table[@class='ad-attributes']/tr[3]/td").text().split(/\n/)[0]
name = node.xpath("/html/body[@id='PageVIP']/div[@id='MainContainer']/div[@class='layout-0']/div[3]/span/h1").text()

json = {
  :price => price,
  :date => date,
  :addr => addr,
  :name => name
}

puts json.to_json

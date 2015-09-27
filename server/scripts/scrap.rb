#!/usr/bin/env ruby

url = ARGV[0]

#puts url

require 'nokogiri'
require 'HTTParty'

response = HTTParty.get(url)
node = Nokogiri.HTML(response.parsed_response)

price = node.xpath("/html/body[@id='PageVIP']/div[@id='MainContainer']/div[@class='layout-2']/div[@class='col-1']/div[@id='itemdetails']/div[@class='col-2']/table[@class='ad-attributes']/tr[2]/td/div/span/strong").text()
date = node.xpath("/html/body[@id='PageVIP']/div[@id='MainContainer']/div[@class='layout-2']/div[@class='col-1']/div[@id='itemdetails']/div[@class='col-2']/table[@class='ad-attributes']/tbody/tr[1]/td").text()
addr = node.xpath("/html/body[@id='PageVIP']/div[@id='MainContainer']/div[@class='layout-2']/div[@class='col-1']/div[@id='itemdetails']/div[@class='col-2']/table[@class='ad-attributes']/tr[3]/td").text()
name = node.xpath("/html/body[@id='PageVIP']/div[@id='MainContainer']/div[@class='layout-0']/div[3]/span/h1")

json = {
  :price => price,
  :date => date,
  :addr => addr,
  :name => name
}

puts json.to_json

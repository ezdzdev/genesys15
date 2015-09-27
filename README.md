server API:

GET info:

HTTP GET Request:

URL: /get

QUERY PARAMETERS

Name		Type	Description
id			int 	identifier (and extention)

Response:

Status-Code: 200 OK

{
  "name" : SELLER_NAME
  "price" : PRICE_INT
  "url" : URL
  "currentBids" : [{"name" : BIDER_NAME 
					  "number" : tel_number
					  "price" : price
					}...]
}

Create info: 

HTTP POST Request

URL: /create

QUERY PARAMETERS

Name		Type	Description
name		string 	identifier (and extention)
price       int     price of item
url         string  ad url

Response:

Status-Code: 200 OK

EXT (just an integer that represents the user id/extention)

add bidder: 

HTTP POST Request

URL: /add_bid

QUERY PARAMETERS

Name		Type	Description
id			int 	identifier (and extention)
name		string 	identifier (and extention)
number      int     bidder tel number
price       int     price of item

Response:

Status-Code: 200 OK

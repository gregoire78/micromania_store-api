# micromania_store-api
exercice micromania's store

URL : [https://api-micromania.joncour.tech/v1/](https://api-micromania.joncour.tech/v1/)

[GET /v1/geojson](https://api-micromania.joncour.tech/v1/geojson)
(get geoJSON file of micromania's stores)

POST /v1/store
(post url of store for scrapp details)
```curl
curl -X POST \
  http://localhost:3000/v1/store \
  -H 'Content-Type: application/json' \
  -d '{
	"url": "https://www.micromania.fr/magasin/127/flins-sur-seine.html"
}'
```

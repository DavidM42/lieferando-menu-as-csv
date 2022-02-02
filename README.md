# Lieferando Menu to CSV

Quick proof of concept script to get lieferando menu of a restaurant as CSV file and import into other programs.
Uses REST-API used by the normal lieferando web app.

## How to run

Prerequisite: You have to have `NodeJS` and `npm` installed.

```shell
npm i
npm run start
```

* Input the url to the wanted restaurant (e.g. `https://www.lieferando.de/speisekarte/mcdonalds-fulda-frankfurter-strasse`) and the name for the csv file
* Finito

## Values parsed per product

* Name
* Description
* Price for item when delivered

There is a lot more info available in the used API which could be added to the returned CSV if wanted.
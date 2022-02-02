// external imported libraries
import ObjectsToCsv from 'objects-to-csv';
import fetch from 'node-fetch';
import prompt from 'prompt';

/**
 * JSON request and parse for restaurant page
 * @param {string} restaurantPage Url where restaurant is found
 */
async function getMenuJSON(restaurantPage) {
	if (!restaurantPage) {
		throw new Error('Invalid restaurant page url');
	}

	const slugSplit = restaurantPage.split('speisekarte/');

	if (slugSplit.length !== 2) {
		throw new Error('Invalid restaurant page url');
	}

	const slug = slugSplit[1];

	const response = await fetch(`https://cw-api.takeaway.com/api/v29/restaurant?slug=${slug}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json, text/plain, */*',
			// imitate some headers browsers normally send to actually get answer
			'Accept-Language': 'de',
			'X-Country-Code': 'de',
			'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0'
		}
	});
	const json = await response.json();
	return json.menu;
}

/**
 * Get products array from url of restaurant
 * @param {string} restaurantPage Url where restaurant is found
 * @returns {{name: string, description: string, imageUrl: string, deliveryPrice: number}[]} Array of products with relevant info
 */
async function getProducts(restaurantPage) {
	const menuJSON = await getMenuJSON(restaurantPage);
	const priceDenominator = menuJSON.currency.denominator;
	const productsJsonReturn = menuJSON.products;

	const products = [];

	for (let productKey in productsJsonReturn) {
		const newProduct = {
			name: productsJsonReturn[productKey].name,
			description: productsJsonReturn[productKey].description.join('.'),
			imageUrl: productsJsonReturn[productKey].imageUrl,
			deliveryPrice: productsJsonReturn[productKey].variants[0].prices.delivery / priceDenominator
		};
		console.log(newProduct);
		products.push(newProduct);
	}
	return products;
}

/**
 * Saves products to csv file
 * @param {string} restaurantPage Url where restaurant is found
 * @param {string} fileName Name of file to save to
 */
async function saveProductsToCsv(restaurantPage, fileName) {
	const products = await getProducts(restaurantPage);
	const csv = new ObjectsToCsv(products);
    if (!fileName.endsWith('.csv')) {
        fileName += '.csv';
    }
	await csv.toDisk(`./${fileName}`);
    console.log(`Saved to ${fileName}`);
}

function start() {
	// from https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
	prompt.start();
	prompt.get(['restaurant_lieferando_link', 'file_name'], function (err, result) {
		if (err) {
			throw new Error(err);
		}
		console.log('Values received:');
		console.log('  Restaurant URL: ' + result.restaurant_lieferando_link);
		console.log('  File name: ' + result.file_name);
		saveProductsToCsv(result.restaurant_lieferando_link, result.file_name);
	});
}

start();
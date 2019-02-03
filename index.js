const rp = require('request-promise');
const cheerio = require('cheerio');
const Table = require('cli-table');

let table = new Table({
	/*Dapp Data

	Name of the Dapps

	Icon

	Developer name

	Explanation about Dapps

	Website

	Platform/protocols

	Genre

	Social Media links
	*/

	head: ['name', 'icon','developer_name' ,'dapp_desc', 'website' ,'platform', 'category', 'sos_med'], // 'smart_contract_address'
	colWidths: [15, 15, 15, 15, 15, 15, 15, 15] 
})

const options = {
	//Mock for top 5
	url: `https://dappradar.com/api/xchain/dapps/list/0`,

	//All Dapps
	//url: `https://dappradar.com/api/xchain/dapps/theRest`,
	
	json: true
}

rp(options)
	.then((data) => {
		let userData = [];
		for (let app of data.data.list) {

			//https://dappradar.com/tron/59/play-goc
			//https://dappradar.com/protocols/id/slug

			userData.push({	
							// name
							title: app.title,

							// logo
							logo: app.logo,

							// developer_name
							slug: app.slug,

							// about dapp
							description: app.description,

							// website
							url: app.url,

							// Platform
							protocols: app.protocols[0],

							// genre
							category: app.category,

							// sosmed
							video: app.video
						});
		}
		process.stdout.write('Fetching data');
		getData(userData);
	})
	.catch((err) => {
		console.log(err);
	});

function getData(userData) {
	var i = 0;
	var emptyStr = ' ';

	function next() {
		if (i < userData.length) {
			
			var options = {
				url: `https://dappradar.com/`,
				transform: body => cheerio.load(body),
			}
			rp(options)
				.then(function ($) {
					process.stdout.write(`.`);

					table.push([
								// name
								userData[i].title, 

								// logo
								userData[i].logo + emptyStr,

								// developer_name
								userData[i].slug + emptyStr,

								// about dapp
								userData[i].description + emptyStr,

								// web
								userData[i].url + emptyStr,

								// smart contract address

								// Platform
								userData[i].protocols + emptyStr,

								// genre
								userData[i].category + emptyStr,

								// sosmed
								userData[i].video + emptyStr
								]);
					++i;
					return next();
				})
		} else {
			printData();
		}
	}
	return next();
};


function printData() {
	console.log("✅");
	console.log(table.toString());
	writeStream.write(table);
}
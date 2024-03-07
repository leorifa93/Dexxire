const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const xlsx = require('node-xlsx');


const data = fs.readFileSync('/Users/leonardorifa/Downloads/States_Cities\ \(1\).xlsx');
const dataDE = fs.readFileSync('/Users/leonardorifa/Downloads/States_Cities\ \(1\)\ es.xlsx'); 
const rows = xlsx.parse(data);
const rowsDE = xlsx.parse(dataDE);
var stream = fs.createWriteStream("seoUrls.txt");
var translations = {};
var arr = [];
stream.once('open', function(fd) {
    for (var i = 0; i < rows[1]['data'].length; i++) {
        if (rows[1]['data'][i][0]) {
            let federal = rows[1]['data'][i][0].trimStart().replace(' ', '_');
            let city = rowsDE[1]['data'][i][2].replace(' ', '_');
            let txt = rowsDE[1]['data'][i][3];

            rows[1]['data'][i][0] = rows[1]['data'][i][0].trimStart().replace(' ', '_');
            rows[1]['data'][i][2] = rows[1]['data'][i][2].replace(' ', '_');
            stream.write('https://dexxire.com/home/profiling/de/usa/' + federal.toLowerCase() + '/' + city.toLowerCase() + '\n');
    
            translations["" + rows[1]['data'][i][2].trimStart().replace(' ', '_') + '_title' + ""] = 'Escorts in ' + city
            translations["" + rows[1]['data'][i][2].trimStart().replace(' ', '_') + '_description' + ""] = txt.replace(/(\r\n|\n|\r)/gm, "");

            arr.push({title: rows[1]['data'][i][2].trimStart().replace(' ', '_') + '_title', description: rows[1]['data'][i][2].trimStart().replace(' ', '_') + '_description', placeId: '', city: rows[1]['data'][i][2].trimStart().replace(' ', '_').toLowerCase()})
        }

    }

    console.log(arr);

    //fs.writeFile('seo_translations.json', JSON.stringify(translations), () => {});

  stream.end();
});

//console.log(translations);

#!/usr/bin/env node
/*
 Automatically grade files for the presence of specified HTML tags/attributes.
 Uses commander.js and cheerio. Teaches command line application development
 and basic DOM parsing.

 References:

 + cheerio
 - https://github.com/MatthewMueller/cheerio
 - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
 - http://maxogden.com/scraping-with-node.html

 + commander.js
 - https://github.com/visionmedia/commander.js
 - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
 - http://en.wikipedia.org/wiki/JSON
 - https://developer.mozilla.org/en-US/docs/JSON
 - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
 */

var fs = require('fs');
var rest = require('restler');
var sys = require('util');
var program = require('commander');
var cheerio = require('cheerio');
var request = require('request');
var web_data_file = 'web_data.html';
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var SITEURL_DEFAULT = "http://oluwalataz-bitstarter.herokuapp.com";

var f_url = function(site_url) {
    var s_dt = rest.get(site_url).on('complete', function(result, response) {
        if (result instanceof Error) {
            sys.puts('Error: ' + result.message);
        } else {
            fs.writeFileSync(web_data_file,result);
        }
        result;
    });
    return s_dt;
};


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var checkUrl = function (url) {
    var site_string = url.toString();
    var site = request(site_string, function (error, response) {
        var status = false;
        if (!error && response.statusCode == 200) {
            status = true;
        } else {
            status = false;
            process.exit(1);
        }
        return status;

    });
    return site;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkUrlData = function(dataz, checksfile) {
    var str_dtz = dataz.toString();
    var dtz = f_url(str_dtz);
    $ = cheerio.load(fs.readFileSync(web_data_file));
    //console.log(web_data_file, 'the data file');
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-s, --site [site_url]', 'Site url to check [site]', clone(checkUrl), SITEURL_DEFAULT)
        .parse(process.argv);
    if (program.file) {
        var checkJson = checkHtmlFile(program.file, program.checks);
    } else if (program.site) {
        var checkJson = checkUrlData(program.site, program.checks);
    }

    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    fs.writeFileSync('test_jason_out.json', outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
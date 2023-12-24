const path = require('path');
const fs = require('fs');
const EmlParser = require('eml-parser');
var cron = require('node-cron');
const _ = require('lodash');
const args = process.argv.slice(2);
const pdf2html = require('pdf2html');
const cheerio = require('cheerio');
//console.log("Command line arguments:", args);
var pdfcrowd = require("pdfcrowd");

if (!args[0]) {
    console.log('no incoming path')
    return;
}


let inPath = args[0];



startApp()
cron.schedule('*/3 * * * * *', function () {
    // console.log(`searching files: ${getCurrentDateTime()}`);
})

function getCurrentDateTime() {
    const now = new Date();

    const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Use 24-hour format
    };

    const dateTimeString = new Intl.DateTimeFormat('en-GB', options).format(now);
    return dateTimeString;
}

function moveFile(sourcePath, destinationFolder) {

    const fileName = path.basename(sourcePath);
    const destinationPath = path.join(destinationFolder, fileName);

    fs.rename(sourcePath, destinationPath, (err) => {
        if (err) {
            //  console.log(`File moved to ${destinationPath}`);
            console.error(`Error moving file: ${err.message}`);
        } else {
            console.log(`File moved to ${destinationPath}`);
        }
    });
}


function startApp() {


    fs.readdir(inPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }


        files.forEach(file => {
            const filePath = path.join(inPath, file);
            console.log(filePath)

            htmlPdf(filePath)
        })


    });

}


async function htmlPdf(filePath) {




    // var client = new pdfcrowd.PdfToHtmlClient("uriiz", "41e522dc7b420b37b2f2f91eba2b2575");


    // client.convertFileToFile(
    //     filePath,
    //     "logo2.html",
    //     function (err, fileName) {
    //         if (err) return console.error("Pdfcrowd Error: " + err);
    //         console.log("Success: the file was created " + fileName);
    //     });


    htmlToJson('logo2.html')
}

function htmlToJson(htmlPath) {

    let obj = {}
    const htmlFilePath = htmlPath;
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
    const $ = cheerio.load(htmlContent);

    const REG_NO = $('.t.m1.x8.he.yd.ff2.fsb.fc0.sc0.ls0.ws0:contains("REG. NO.")').text();
    if (REG_NO) {
        const match = REG_NO.match(/REG\. NO\.\s*(\d+)/);
        const extractedNumber = match ? match[1] : null;
        obj.REG_NO = extractedNumber;
       
    }

    const REG_NO_VAT = $('.t.m1.xb.h18.y17.ff2.fs15.fc0.sc0.ls0.ws0').text();
    if (REG_NO_VAT) {
        obj.REG_NO_VAT = REG_NO_VAT;
    }

    const DATE = $('.t.m1.x3.h7.y6.ff2.fs5.fc0.sc0.ls0.ws0').text();
    if (DATE) {
        obj.DATE = DATE;
    }

    const FREIGHT_TAX_INVOICE_NO = $('.t.m1.x0.hc.yb.ff3.fs9.fc0.sc0.ls0.ws0').text();
    if (FREIGHT_TAX_INVOICE_NO) {
        obj.FREIGHT_TAX_INVOICE_NO = FREIGHT_TAX_INVOICE_NO;
    }

    const SHIPPER = $('.t.m1.x9.h12.y11.ff3.fsf.fc0.sc0.ls0.ws0').text();
    if (SHIPPER) {
        obj.SHIPPER = SHIPPER;
    }

    const ADDRESS = $('.t.m1.x0.h1e.y1e.ff3.fs1a.fc0.sc0.ls0.ws0').text();
    if (ADDRESS) {
        obj.ADDRESS = ADDRESS;
    }

    
    console.log(obj);
}
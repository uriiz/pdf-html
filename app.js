const path = require('path');
const fs = require('fs');
const EmlParser = require('eml-parser');
var cron = require('node-cron');
const _ = require('lodash');
const args = process.argv.slice(2);

const cheerio = require('cheerio');
//console.log("Command line arguments:", args);
//node app.js c:/inbox1
//node app.js Users/uri/Desktop/uri/test.pdf Users/uri/Desktop/uri

var pdfcrowd = require("pdfcrowd");

if (!args[0]) {
    console.log('no incoming path')
    return;
}

if (!args[1]) {
    console.log('no output path')
    return;
}

let inPath = args[0];
let outPath = args[1];



 startApp()
cron.schedule('*/15 * * * * *', function () {
    //console.log(`searching files: ${getCurrentDateTime()}`);
   
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

    fs.rename(sourcePath, destinationFolder, (err) => {
        if (err) {
            //  console.log(`File moved to ${destinationPath}`);
            console.error(`Error moving file: ${err.message}`);
        } else {
            console.log(`File moved to ${destinationPath}`);
            process.exit();
        }
    });
}


function startApp() {


    // fs.readdir(inPath, (err, files) => {
    //     if (err) {
    //         console.error('Error reading folder:', err);
    //         return;
    //     }

    //     // let filePath;
    //     // let filePathPdf;
    //     // let fileExtension;
    //     // let ifProcess = false;
    //     // files.forEach(file => {

    //     //     filePath = path.join(inPath, file);
    //     //     fileExtension = path.extname(filePath);
    //     //     if (fileExtension == '.pdf') {
    //     //         filePathPdf = filePath;
    //     //         ifProcess = true;
    //     //     }else{
    //     //         console.log(filePath + 'no pdf file')
    //     //     }

    //     //     //htmlPdf(filePath)
    //     // })
    //     // process.exit();
    //     // return;
    
    //     // if(ifProcess){
    //     //     htmlPdf(filePathPdf)
    //     // }
      

    //     // TEST
    //   // testHtml('HFAR2101398959.html')
       
    // });

    console.log(inPath);

    fs.access(inPath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error(`File ${inPath} does not exist`);
          process.exit();
        } else {
            htmlPdf(inPath)
        }
      });
   // process.exit();
   // return;
   
}

async function testHtml(filePath) {
    htmlToJson(filePath,'fromtest')
}

async function htmlPdf(filePath) {


    const fileNameWithoutExtension = path.basename(filePath, path.extname(filePath)) + '.html';
    const fileNameWithoutExtensionNo = path.basename(filePath, path.extname(filePath)) ;
    let outpathHtml = outPath + '/' + fileNameWithoutExtension;

   

    
    var client = new pdfcrowd.PdfToHtmlClient("uriiz29999", "6345db4fc749f4a438a94e7d259d5ab0");
    client.convertFileToFile(
        filePath,
        outpathHtml,
        function (err, fileName) {
            if (err) return console.error("Pdfcrowd Error: " + err);
            console.log("Success: the file was created " + fileName);
            htmlToJson(outpathHtml,fileNameWithoutExtensionNo,filePath)
        });
      
    

    // for (let i = 1; i < 7; i++) {
    //     let k = i;
    // htmlToJson(`logo${k}.html`, k)

    //     //
    // }


}

function htmlToJson(htmlPath, k,filePathRemove) {


    // const htmlFilePath = htmlPath;
    // const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
    // const $ = cheerio.load(htmlContent);
    // const allDivs = $('div');
    // console.log('hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    // // Print the text content of each div
    // allDivs.each((index, element) => {
    //     console.log($(element).text());
    // });
    // return;

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

    const CONSIGNEE = $('.t.m1.x9.h1b.y1a.ff3.fs18.fc0.sc0.ls0.ws0').text();
    if (CONSIGNEE) {
        obj.CONSIGNEE = CONSIGNEE;
    }

    const NOTIFY = $('.t.m1.x9.h1a.y19.ff3.fs17.fc0.sc0.ls0.ws0').text();
    if (NOTIFY) {
        obj.NOTIFY = NOTIFY;
    }

    const VESSEL = $('.t.m1.x9.h19.y18.ff3.fs16.fc0.sc0.ls0.ws0').text();
    if (VESSEL) {
        obj.VESSEL = VESSEL.replace('   ', '');
    }




    const bodyHtml = $('body').html();
    const $body = cheerio.load(bodyHtml);

    //billoflanding

    const billoflanding = $body('div').filter(function () {
        if ($(this).text() == 'BILL OF LADING NO:') {
            return $(this)
        }
    });

    const nextDivs = billoflanding.nextAll('div');

    for (let i = 0; i < 30 && i < nextDivs.length; i++) {
        const currentDiv = nextDivs.eq(i);

        if ($(currentDiv).text().includes('ZIMU')) {
            obj.BILL_OF_LADING = $(currentDiv).text().trim();
            break;
        }
    }


    // PORT OF LOADING;

    const postoflanding = $body('div').filter(function () {
        if ($(this).text() == 'PORT OF LOADING;') {
            return $(this)
        }
    });

    const nextDivspostoflanding = postoflanding.nextAll('div').eq(2);
    if (nextDivspostoflanding) {
        obj.PORT_OF_LOADING = nextDivspostoflanding.text();
    }

    // SAILING DATE:

    const salingdate = $body('div').filter(function () {
        if ($(this).text() == 'SAILING DATE:') {
            return $(this)
        }
    });

    const nextDivssalingdate = salingdate.nextAll('div').eq(0);
    if (nextDivssalingdate) {
        obj.SAILING_DATE = nextDivssalingdate.text();
    }

    // BOOKING NO:

    const bookingnumber = $body('div').filter(function () {
        if ($(this).text() == 'BOOKING NO:') {
            return $(this)
        }
    });

    const nextDivbookingnumber = bookingnumber.nextAll('div').eq(0);
    if (nextDivbookingnumber) {
        obj.BOOKING_NO = nextDivbookingnumber.text();
    }

    //PORT OF DESTINATION:
    const PORTOFDESTINATION = $body('div').filter(function () {
        if ($(this).text() == 'PORT OF DESTINATION:') {
            return $(this)
        }
    });

    const nextDivPORTOFDESTINATION = PORTOFDESTINATION.nextAll('div').eq(0);
    if (nextDivPORTOFDESTINATION) {
        obj.PORT_OF_DESTINATION = nextDivPORTOFDESTINATION.text();
    }

    //TERMINAL:

    const TERMINAL = $body('div').filter(function () {
        if ($(this).text() == 'TERMINAL:') {
            return $(this)
        }
    });

    const nextDivTERMINAL = TERMINAL.nextAll('div').eq(0);
    const nextDivTERMINAL2 = TERMINAL.nextAll('div').eq(1);
    if (nextDivTERMINAL) {
        obj.TERMINAL = nextDivTERMINAL.text();
    }
    if (nextDivTERMINAL2) {
        obj.TERMINAL = obj.TERMINAL + nextDivTERMINAL2.text();
    }

    //PLACE OF RECEIPT OF GOODS:

    const PLACEOFRECEIPTOFGOODS = $body('div').filter(function () {
        if ($(this).text() == 'PLACE OF RECEIPT OF GOODS:') {
            return $(this)
        }
    });

    const nextDivPLACEOFRECEIPTOFGOODS = PLACEOFRECEIPTOFGOODS.nextAll('div').eq(0);

    if (nextDivPLACEOFRECEIPTOFGOODS) {
        obj.PLACE_OF_RECEIPT_OF_GOODS = nextDivPLACEOFRECEIPTOFGOODS.text();
    }


    
    function hasDigitsAfterDecimal(value) {
        if (!isNumeric(value)) {
            // return false; // Not a valid number
        }

        // Check if there are digits after the decimal point
        const decimalIndex = value.indexOf('.');
        return decimalIndex !== -1 && decimalIndex < value.length - 1;
    }

    function isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    function isInteger(str) {
        // Use regular expression to check if the string contains only digits
        // and does not have a decimal part
        return /^\d+$/.test(str) && !/\./.test(str);
    }

    //TOTAL OF CARGO:

    const TOTAL_OF_CARGO = $body('div').filter(function () {
        if ($(this).text() == 'MEASUREMENT(CBM)') {
            
            return $(this)
        }
    });


    // const nextDivTOTAL_OF_CARGO = TOTAL_OF_CARGO.nextAll('div').eq(0);

    const nextDivscheck = TOTAL_OF_CARGO.nextAll('div');
    let counter = 0;
    for (let i = 0; i < 200 && i < nextDivscheck.length; i++) {
        const currentDiv = nextDivscheck.eq(i);

        if (hasDigitsAfterDecimal($(currentDiv).text())) {
           
            counter++;
        }

        if ($(currentDiv).text() == 'MANIFESTED CHARGES') {
            break;
        }
    }

   
    obj.TOTAL_OF_CARGO = {};
    let arr = []
    for (let i = 0; i < counter; i++) {
        let NOCNTS_PCKS = nextDivscheck.eq(i * 4);
        let UNIT_TYPE = nextDivscheck.eq(1 + (i * 4));
        let UNIT_SIZE = nextDivscheck.eq(2 + (i * 4));
        let CARGO_WEIGHT_MT = nextDivscheck.eq(3 + (i * 4));

       
        arr.push({
            NOCNTS_PCKS: $(NOCNTS_PCKS).text(),
            UNIT_TYPE: $(UNIT_TYPE).text(),
            UNIT_SIZE: $(UNIT_SIZE).text(),
            CARGO_WEIGHT_MT: $(CARGO_WEIGHT_MT).text(),
        })
    }
   
    obj.TOTAL_OF_CARGO = arr

   
    //MANIFESTED CHARGES

    const MANIFESTED_CHARGES = $body('div').filter(function () {
        if ($(this).text() == 'QTY') {
            return $(this)
        }
    });


    const nextDivscheck2 = MANIFESTED_CHARGES.nextAll('div');
    let counter2 = 0;
    let objchecj = []
    for (let i = 0; i < 900 && i < nextDivscheck2.length; i++) {
        const currentDiv = nextDivscheck2.eq(i);
        const currentDivPrev = nextDivscheck2.eq(i - 1);


        if (isInteger($(currentDiv).text())) {
            counter2++;
            //objchecj.count =objchecj.count+1;
            //console.log($(currentDivPrev).text())

            let count = 0;
            for (let k = 0; k < 12; k++) {

                let check = nextDivscheck2.eq(i - k);
                count++;
                if (check.text().length == 3 && check.text() != 'USD') {
                    // console.log(check.text())
                    break;
                }
            }

            //objchecj.is_6 = arrayOfWords.length == 1 ? true : false;
            objchecj.push({
                is_6: count

            })
        }

        if ($(currentDiv).text() == 'LOCAL FEES') {
            break;
        }
    }

    //console.log(objchecj)

    //obj.TOTAL_OF_CARGO = {};
    let arr2 = []

    objchecj.forEach((e, i) => {
        let MANIFESTED
        let CHARGES
        let CURR
        let PER
        let AMOUNT
        let QUT
        let COLLECT

        let sum = 0;
        for (let k = 0; k < i; k++) {
            sum += objchecj[k].is_6;
        }

        MANIFESTED = nextDivscheck2.eq(sum);
        CHARGES = nextDivscheck2.eq(sum + 1);


        for (let j = 1; j < 20; j++) {
            if (nextDivscheck2.eq(sum + j).text().length == 3) {
                // console.log(nextDivscheck2.eq(sum+j).text())
                CURR = nextDivscheck2.eq(sum + j).text();
                break;
            }
        }

        for (let j = 1; j < 20; j++) {
            if (nextDivscheck2.eq(sum + j).text().length == 1) {

                PER = nextDivscheck2.eq(sum + j).text();
                break;
            }
        }

        for (let j = 1; j < 20; j++) {
            if (hasDigitsAfterDecimal(nextDivscheck2.eq(sum + j).text())) {

                const arrayOfWords = nextDivscheck2.eq(sum + j).text().split(' ');
                AMOUNT = arrayOfWords[0];

                break;
            }
        }

        for (let j = 1; j < 20; j++) {
            if (isInteger(nextDivscheck2.eq(sum + j).text())) {
                QUT = nextDivscheck2.eq(sum + j).text();
                break;
            }
        }



        arr2.push({
            MANIFESTED: $(MANIFESTED).text(),
            CHARGES: $(CHARGES).text(),
            CURR: CURR,
            PER: PER,
            AMOUNT: AMOUNT,
            QUT: QUT,
            COLLECT: QUT * AMOUNT,

        })
    })

    obj.MANIFESTED_CHARGES = arr2;



    //Total Charges(USD):

    const TotalCharges = $body('div').filter(function () {
        if ($(this).text() == 'Total  Charges(USD):') {

            return $(this)
        }
    });

    const nextDivTotalCharges = TotalCharges.nextAll('div').eq(0);

    if (nextDivPLACEOFRECEIPTOFGOODS) {
        obj.Total_Charges = nextDivTotalCharges.text();
    }


    // LOCAL FEES

    const LOCALFEES = $body('div').filter(function () {
        if ($(this).text() == 'LOCAL FEES') {

            return $(this)
        }
    });

    let arr3 = [];
    let arr4 = [];

    const first0 = LOCALFEES.nextAll('div').eq(1);
    const sec0 = LOCALFEES.nextAll('div').eq(0);
    const third0 = LOCALFEES.nextAll('div').eq(4);
    const four0 = LOCALFEES.nextAll('div').eq(3);
    const five0 = LOCALFEES.nextAll('div').eq(2);


    const first1 = LOCALFEES.nextAll('div').eq(6);
    const sec1 = LOCALFEES.nextAll('div').eq(5);
    const third1 = LOCALFEES.nextAll('div').eq(4);
    const four1 = LOCALFEES.nextAll('div').eq(8);
    const five1 = LOCALFEES.nextAll('div').eq(7);

    if (first0) {
        arr3.push(first0.text())
    }
    if (sec0) {
        arr3.push(sec0.text())
    }
    if (third0) {
        arr3.push(third0.text())
    }
    if (four0) {
        arr3.push(four0.text())
    }
    if (five0) {
        arr3.push(five0.text())
    }


    if (first1) {
        arr4.push(first1.text())
    }
    if (sec1) {
        arr4.push(sec1.text())
    }
    if (third1) {
        arr4.push(third1.text())
    }
    if (four1) {
        arr4.push(four1.text())
    }
    if (five1) {
        arr4.push(five1.text())
    }

    obj.LOCAL_FEES1 = arr3;
    obj.LOCAL_FEES2 = arr4;



    //RATE OF EXCHANGE (USD):

    const RATE_OF_EXCHANGE = $body('div').filter(function () {
        if ($(this).text() == 'RATE OF EXCHANGE (USD):') {

            return $(this)
        }
    });

    const nextDivRATE_OF_EXCHANGE = RATE_OF_EXCHANGE.prevAll('div').eq(0);

    if (nextDivRATE_OF_EXCHANGE) {
        obj.RATE_OF_EXCHANGE = nextDivRATE_OF_EXCHANGE.text();
    }


    //RATE OF EXCHANGE (USD):

    const DATE_OF_EXCHANGE = $body('div').filter(function () {
        if ($(this).text() == 'DATE OF EXCHANGE:') {

            return $(this)
        }
    });

    const nextDivDATE_OF_EXCHANGE = DATE_OF_EXCHANGE.prevAll('div').eq(7);

    if (nextDivDATE_OF_EXCHANGE) {
        obj.DATE_OF_EXCHANGE = nextDivDATE_OF_EXCHANGE.text();
    }


    //ARRIVAL DATE:

    const ARRIVAL_DATE = $body('div').filter(function () {
        if ($(this).text() == 'ARRIVAL DATE:') {
            return $(this)
        }
    });

    const nextDivARRIVAL_DATE = ARRIVAL_DATE.nextAll('div').eq(0);

    if (nextDivARRIVAL_DATE) {
        obj.ARRIVAL_DATE = nextDivARRIVAL_DATE.text();
    }


    //BROKER:

    const BROKER = $body('div').filter(function () {
        if ($(this).text() == 'BROKER:') {
            return $(this)
        }
    });

    const nextDivBROKER = BROKER.nextAll('div').eq(3);

    if (nextDivBROKER) {
        obj.BROKER = nextDivBROKER.text().trim();
    }


    //CLIENT:

    const CLIENT = $body('div').filter(function () {
        if ($(this).text() == 'CLIENT:') {
            return $(this)
        }
    });

    const nextDivCLIENT = CLIENT.prevAll('div').eq(1);

    if (nextDivCLIENT) {
        obj.CLIENT = nextDivCLIENT.text().trim();
    }


    //CLIENT VAT.NO:

    const CLIENT_VAT_NO = $body('div').filter(function () {
        if ($(this).text() == 'CLIENT VAT.NO:') {
            return $(this)
        }
    });

    const nextDivCLIENT_VAT_NO = CLIENT_VAT_NO.prevAll('div').eq(1);

    if (nextDivCLIENT_VAT_NO) {
        obj.CLIENT_VAT_NO = nextDivCLIENT_VAT_NO.text().trim();
    }



    //ORIG/COPIES:

    const ORIG_COPIES = $body('div').filter(function () {
        if ($(this).text() == 'ORIG/COPIES:') {
            return $(this)
        }
    });

    const nextDivORIG_COPIES = ORIG_COPIES.nextAll('div').eq(0);

    if (nextDivORIG_COPIES) {
        obj.ORIG_COPIES = nextDivORIG_COPIES.text().trim();
    }

    //Total  local Fees (USD):

    const Total_local_Fees = $body('div').filter(function () {
        if ($(this).text() == 'Total  local Fees (USD):') {
            return $(this)
        }
    });

    const nextDivTotal_local_Fees = Total_local_Fees.nextAll('div').eq(0);

    if (nextDivTotal_local_Fees) {
        obj.Total_local_Fees = nextDivTotal_local_Fees.text().trim();
    }



    //Total  local Fees in ILS:

    const Total_local_Fees_ILS = $body('div').filter(function () {
        if ($(this).text() == 'Total  local Fees in ILS:') {
            return $(this)
        }
    });

    const nextDivTotal_local_Fees_ILS = Total_local_Fees_ILS.nextAll('div').eq(1);

    if (nextDivTotal_local_Fees_ILS) {
        obj.Total_local_Fees_ILS = nextDivTotal_local_Fees_ILS.text().trim();
    }



    //Grand Total:

    const Grand_Total = $body('div').filter(function () {
        if ($(this).text() == 'Grand Total:') {
            return $(this)
        }
    });

    const nextDivGrand_Total = Grand_Total.nextAll('div').eq(1);
    const nextDivGrand_Total_curr = Grand_Total.nextAll('div').eq(0);

    if (nextDivGrand_Total) {
        obj.Grand_Total = nextDivGrand_Total_curr.text() + ' ' + nextDivGrand_Total.text().trim();
    }




    //Total  Expenses    (ILS):

    const Total_Expenses_ILS = $body('div').filter(function () {
        if ($(this).text() == 'Total  Expenses    (ILS):') {
            return $(this)
        }
    });

    const nextDivTotal_Expenses_ILS = Total_Expenses_ILS.nextAll('div').eq(0);

    if (nextDivTotal_Expenses_ILS) {
        obj.Total_Expenses_ILS = nextDivTotal_Expenses_ILS.text().trim();
    }



    //Total  Expenses    (USD):

    const Total_Expenses_USD = $body('div').filter(function () {
        if ($(this).text() == 'Total  Expenses    (USD):') {
            return $(this)
        }
    });

    const nextDivTotal_Expenses_USD = Total_Expenses_USD.nextAll('div').eq(0);

    if (nextDivTotal_Expenses_USD) {
        obj.Total_Expenses_USD = nextDivTotal_Expenses_USD.text().trim();
    }



    //USER:

    const USER = $body('div').filter(function () {
        if ($(this).text() == 'USER:') {
            return $(this)
        }
    });

    const nextDivUSER = USER.prevAll('div').eq(0);

    if (nextDivUSER) {
        obj.USER = nextDivUSER.text().trim();
    }



    //Bank Name:

    const Bank_Name = $body('div').filter(function () {
        if ($(this).text() == 'Bank Name:') {
            return $(this)
        }
    });

    const nextDivBank_Name = Bank_Name.nextAll('div').eq(0);

    if (nextDivBank_Name) {
        obj.Bank_Name = nextDivBank_Name.text().trim();
    }


    //Branch:

    const Branch = $body('div').filter(function () {
        if ($(this).text() == 'Branch:') {
            return $(this)
        }
    });

    const nextDivBranch = Branch.prevAll('div').eq(0);

    if (nextDivBranch) {
        obj.Branch = nextDivBranch.text().trim();
    }



    //Bank Address:

    const Bank_Address = $body('div').filter(function () {
        if ($(this).text() == 'Bank Address:') {
            return $(this)
        }
    });

    const nextDivBank_Address = Bank_Address.prevAll('div').eq(0);

    if (nextDivBank_Address) {
        obj.Bank_Address = nextDivBank_Address.text().trim();
    }


    //Beneficiary:

    const Beneficiary = $body('div').filter(function () {
        if ($(this).text() == 'Beneficiary:') {
            return $(this)
        }
    });

    const nextDivBeneficiary = Beneficiary.prevAll('div').eq(0);

    if (nextDivBeneficiary) {
        obj.Beneficiary = nextDivBeneficiary.text().trim();
    }


    //USD/ EUR/ ILS Account No:

    const USD_EUR_ILS_Account_No = $body('div').filter(function () {
        if ($(this).text() == 'USD/ EUR/ ILS Account No:') {
            return $(this)
        }
    });

    const nextDivUSD_EUR_ILS_Account_No = USD_EUR_ILS_Account_No.nextAll('div').eq(0);

    if (nextDivUSD_EUR_ILS_Account_No) {
        obj.USD_EUR_ILS_Account_No = nextDivUSD_EUR_ILS_Account_No.text().trim();
    }


    //Iban No:

    const Iban_No = $body('div').filter(function () {
        if ($(this).text() == 'Iban No:') {
            return $(this)
        }
    });

    const nextDivIban_No = Iban_No.prevAll('div').eq(0);

    if (nextDivIban_No) {
        obj.Iban_No = nextDivIban_No.text().trim();
    }


    //Swift Code:

    const Swift_Code = $body('div').filter(function () {
        if ($(this).text() == 'Swift Code:') {
            return $(this)
        }
    });

    const nextDivSwift_Code = Swift_Code.prevAll('div').eq(0);

    if (nextDivSwift_Code) {
        obj.Swift_Code = nextDivSwift_Code.text().trim();
    }


    //console.log(obj)
    if(k == 'fromtest'){
        console.log(obj)
    }


    const builder = require('xml2js').Builder;


    const xmlBuilder = new builder();
    const xml = xmlBuilder.buildObject(obj);

    // console.log(xml);
    
    //const filePath = `${k}.xml`;

    // Write XML to a file

    if(k != 'fromtest'){
        fs.writeFileSync(outPath+'/'+k+'.xml', xml);
        moveFile(filePathRemove,outPath+'/'+k+'.pdf')
    }else{
        fs.writeFileSync(k+'.xml', xml);
    }
   

    
    //NO.CNTS/PCKS


}
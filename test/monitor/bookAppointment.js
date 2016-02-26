/*
    This is a CasperJS script, not a NodeJS script.
    Stick to es5, and realise that the built-in API differs from NodeJS:

    http://docs.casperjs.org/en/latest/modules/index.html
*/
'use strict';

var casper = require('casper').create();

if (casper.cli.args.length !== 3) {
  console.log('Usage: casperjs bookAppointment.js <base URL> <client id> <family name>');
  casper.exit(1);
}

var baseUrl = casper.cli.args[0];
var clientId = casper.cli.args[1];
var familyName = casper.cli.args[2];

var targetDate = new Date();
targetDate.setMonth(targetDate.getMonth() + 1);
var year = targetDate.getYear() + 1900;
var month = targetDate.getMonth() + 1;
var targetYear = '' + year;
var targetMonth = month < 10 ? '0' + month : '' + month;
var targetDay = '';
if (targetDate.getDay % 6) {
  targetDay = targetDate.getDate();
} else {
  targetDay = targetDate.getDate() + 2;
}

var hrefMonth = 'month/' + targetYear + '-' + targetMonth;
var hrefDate = 'date/' + targetYear + '-' + targetMonth + '-' + targetDay;
var hrefTime = 'time/' + targetYear + '-' + targetMonth + '-' + targetDay + 'T15:40:00';

casper.echo('Start');

casper.start(baseUrl + '/login', function() {
  this.echo('Login');
  this.fill('form#loginForm', {
    'username': clientId,
    'familyName': familyName
  }, true);
  this.capture('login.png');
});

casper.waitForUrl(baseUrl + '/calendar', function() {
  this.echo('Calendar');
  this.capture('calendar-thismonth.png');
});

casper.waitForSelector('a[href="#' + hrefMonth + '"]', function() {
  this.echo('Calendar - next month');
  this.click('a[href="#' + hrefMonth + '"]');
});

casper.waitForSelector('a[href="#' + hrefDate + '"]', function() {
  this.capture('calendar-nextmonth.png');
  this.echo('Calendar - date');
  this.click('a[href="#' + hrefDate + '"]');
});

casper.waitForSelector('a[href="#' + hrefTime + '"]', function() {
  this.capture('calendar-date.png');
  this.echo('Calendar - time');
  this.click('a[href="#' + hrefTime + '"]');
});

casper.then(function() {
  this.capture('calendar-time.png');
});

casper.waitForSelector('#submitLogin', function() {
  this.click('#submitLogin');
});

casper.waitForUrl(baseUrl + '/confirmation', function() {
  this.echo('Confirmation');
  this.capture('confirmation.png');
});

casper.run(function() {
  this.echo('Done').exit();
});

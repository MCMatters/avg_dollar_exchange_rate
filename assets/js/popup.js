(function () {
    document.addEventListener('DOMContentLoaded', function () {

        var $date = document.getElementById('date');

        function replaceTranslations() {
            var $localizeItems = document.querySelectorAll(
                '[data-localize], [data-value-localize]'
            );
            for (let $item of $localizeItems) {
                let data = $item.dataset;
                if (data.valueLocalize) {
                    $item.value = chrome.i18n.getMessage(data.valueLocalize);
                }
                if (data.localize) {
                    $item.textContent = chrome.i18n.getMessage(data.localize);
                }
            }
        }

        function setDefaultValueToDate() {
            let currentDate = new Date();
            $date.value = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1);
        }

        function attachThrobber(el) {
            let $el = document.querySelector(el);
            $el.textContent = '';
            $el.innerHTML = '<img src="images/throbber.gif"/>';
        }

        function attachRate(el, rate) {
            let $el = document.querySelector(el);
            $el.innerHTML = '';
            $el.textContent = rate;
        }

        function requestNBU(date) {
            attachThrobber('#avg-nbu');
            let dateString = date[1] + '.' + date[0];
            let url = 'http://www.bank.gov.ua/control/uk/curmetal/' +
                'currency/search?formType=searchPeriodForm&time_step=daily&' +
                'currency=169&outer=table&' +
                'periodStartTime=01.' + dateString +
                '&periodEndTime=20.' + dateString;
            fetch(url).then(function (response) {
                return response.text();
            }).then(function (data) {
                let html = document.createElement('div');
                html.innerHTML = data;
                var sum = 0;
                let $rows = html
                    .querySelectorAll('.content > table')[3]
                    .querySelectorAll('tbody tr')[1]
                    .querySelectorAll('td table tbody tr');
                for (let $row of $rows) {
                    let $rowTds = $row.querySelectorAll('td');
                    sum += parseFloat($rowTds[$rowTds.length - 1].textContent.trim());
                }
                attachRate('#avg-nbu', ((sum / $rows.length) / 100).toFixed(2));
            });
        }

        function requestPrivatbank(date, sum, counter, i) {
            if (!i) {
                attachThrobber('#avg-pb');
            }
            sum = sum || 0;
            i = i || 1;
            counter = counter || 0;
            if (i > 20) {
                console.log('pb ' + sum + ' rows ' + counter);
                attachRate('#avg-pb', (sum / counter).toFixed(2));
                return;
            }
            var placeDate = i + '.' + date[1] + '.' + date[0];
            fetch('https://api.privatbank.ua/p24api/exchange_rates?json&date=' + placeDate)
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                if (data.exchangeRate.length) {
                    var item = data.exchangeRate.find(function (item) {
                        return item.currency === 'USD';
                    });
                    sum += item.saleRateNB;
                    counter++;
                }
                i++;
                requestPrivatbank(date, sum, counter, i);
            });
        }

        function attachFormSubmitHandler() {
            document.forms[0].addEventListener('submit', function (e) {
                e.preventDefault();
                var date = $date.value.split('-');
                requestNBU(date);
                requestPrivatbank(date);
            });
        }

        function init() {
            replaceTranslations();
            setDefaultValueToDate();
            attachFormSubmitHandler();
        }

        init();

    });
})();

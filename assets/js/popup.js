(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const $date = document.getElementById('date');

        function replaceTranslations() {
            const $localizeItems = document.querySelectorAll(
                '[data-localize], [data-value-localize]'
            );
            for (let $item of $localizeItems) {
                const data = $item.dataset;
                if (data.valueLocalize) {
                    $item.value = chrome.i18n.getMessage(data.valueLocalize);
                }
                if (data.localize) {
                    $item.textContent = chrome.i18n.getMessage(data.localize);
                }
            }
        }

        function setDefaultValueToDate() {
            const currentDate = new Date();
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
            const dateString = date[1] + '.' + date[0];
            const url = 'http://www.bank.gov.ua/control/uk/curmetal/' +
                'currency/search?formType=searchPeriodForm&time_step=daily&' +
                'currency=169&outer=xml&' +
                'periodStartTime=01.' + dateString +
                '&periodEndTime=20.' + dateString;
            fetch(url).then(function (response) {
                return response.text();
            }).then(function (data) {
                const parser = new DOMParser();
                data = parser.parseFromString(data, 'text/xml');
                const $rows = data.querySelectorAll('exchange_rate');
                let sum = 0;
                for (let $row of $rows) {
                    sum += parseFloat($row.textContent.trim());
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
                attachRate('#avg-pb', (sum / counter).toFixed(2));
                return;
            }
            const placeDate = i + '.' + date[1] + '.' + date[0];
            fetch('https://api.privatbank.ua/p24api/exchange_rates?json&date=' + placeDate)
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                if (data.exchangeRate.length) {
                    const item = data.exchangeRate.find(function (item) {
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
                const date = $date.value.split('-');
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

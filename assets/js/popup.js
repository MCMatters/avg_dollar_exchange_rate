(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const $date = document.getElementById('date');

        function replaceTranslations() {
            document.documentElement.lang = chrome.i18n.getUILanguage().substr(0, 2);
            const $localizeItems = document.querySelectorAll('[data-localize]');
            for (let $item of $localizeItems) {
                const locales = $item.dataset.localize.split(',');
                for (const locale of locales) {
                    const localeKeys = locale.split(':');
                    $item[localeKeys[0].trim()] = chrome.i18n.getMessage(localeKeys[1].trim());
                }
            }
        }

        function toFixed(num, fixed) {
            fixed = fixed || 0;
            fixed = Math.pow(10, fixed);
            return Math.floor(num * fixed) / fixed;
        }

        function getTodayDate() {
            const currentDate = new Date();
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();
            return {
                year: currentDate.getFullYear(),
                month: month < 10 ? '0' + month : month,
                day: day < 10 ? '0' + day : day
            };
        }

        function responseJson(response) {
            return response.json();
        }

        function responseText(response) {
            return response.text();
        }

        function setDefaultValueToDate() {
            const today = getTodayDate();
            $date.value = today.year + '-' + today.month;
        }

        function fetchCurrentNBU(date) {
            attachThrobber('#current-nbu');
            let url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=USD';
            if (date) {
                url += '&date=' + date;
            }
            fetch(url).then(responseJson).then(response => {
                if (!response.length) {
                    date = date ? moment(date, 'YYYYMMDD') : moment();
                    fetchCurrentNBU(date.subtract(1, 'days').format('YYYYMMDD'));
                } else {
                    attachRate('#current-nbu', toFixed(parseFloat(response[0].rate), 2));
                }
            });
        }

        function fetchCurrentPB() {
            attachThrobber('#current-pb');
            fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
                .then(responseJson)
                .then(response => {
                    response.forEach(rate => {
                        if (rate.ccy === 'USD') {
                            attachRate('#current-pb', toFixed(parseFloat(rate.sale), 2));
                        }
                    });
                });
        }

        function getCurrentExchangeRates() {
            fetchCurrentNBU();
            fetchCurrentPB();
        }

        function attachThrobber(el) {
            const $el = document.querySelector(el);
            $el.textContent = '';
            $el.innerHTML = '<img src="images/throbber.gif"/>';
        }

        function attachRate(el, rate) {
            rate = isNaN(rate) ? 0 : rate;
            const $el = document.querySelector(el);
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
            fetch(url).then(responseText).then(response => {
                const parser = new DOMParser();
                const data = parser.parseFromString(response, 'text/xml');
                const $rows = data.querySelectorAll('exchange_rate');
                let sum = 0;
                for (const $row of $rows) {
                    sum += parseFloat($row.textContent.trim());
                }
                attachRate('#avg-nbu', toFixed(parseFloat(sum / $rows.length) / 100, 2));
            });
        }

        function requestPrivatbank(date, sum, counter, i) {
            let max = 20;
            const today = getTodayDate();

            if (today.year === parseInt(date[0]) && today.month == date[1]) {
                max = parseInt(today.day);
            }

            if (!i) {
                attachThrobber('#avg-pb');
            }

            sum = sum || 0;
            i = i || 1;
            counter = counter || 0;

            if (i > max) {
                attachRate('#avg-pb', toFixed(parseFloat(sum / counter), 2));
                return;
            }

            const day = i < 10 ? '0' + i : i;
            const placeDate = day + '.' + date[1] + '.' + date[0];
            fetch('https://api.privatbank.ua/p24api/exchange_rates?json&date=' + placeDate)
                .then(responseJson)
                .then(response => {
                    if (response.exchangeRate.length) {
                        const item = response.exchangeRate.find(item => item.currency === 'USD');
                        sum += item.saleRateNB;
                        counter++;
                    }
                    i++;
                    requestPrivatbank(date, sum, counter, i);
                });
        }

        function requestServices() {
            const date = $date.value.split('-');
            requestNBU(date);
            requestPrivatbank(date);
        }

        function attachFormSubmitHandler() {
            document.forms[0].addEventListener('submit', e => {
                e.preventDefault();
                requestServices();
            });
        }

        function initTooltips() {
            const tooltips = document.querySelectorAll('[data-toggle=tooltip]');
            for (let i = 0; i < tooltips.length; i++) {
                const tooltip = tooltips[i];
                new Tooltip(tooltips[i], {
                    placement: tooltip.dataset.placement || 'top',
                    animation: 'slideNfade'
                })
            }
        }

        function init() {
            replaceTranslations();
            setDefaultValueToDate();
            getCurrentExchangeRates();
            attachFormSubmitHandler();
            initTooltips();
            requestServices();
        }

        init();
    });
})();

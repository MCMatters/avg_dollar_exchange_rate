(function ($) {
    $(document).ready(function () {

        $('[data-localize], [data-value-localize]').each(function () {
            var $this = $(this),
                value = $this.data('value-localize'),
                text = $this.data('localize');
            if (value) {
                $this.val(chrome.i18n.getMessage(value));
            }
            if (text) {
                $this.text(chrome.i18n.getMessage(text));
            }
        });

        function attachThrobber(el) {
            $(el).text('').html('<img src="images/throbber.gif"/>');
        }

        function attachRate(el, rate) {
            $(el).html('').text(rate);
        }

        function requestData(date) {
            attachThrobber('#avg-nbu');
            var dateString = date[1] + '.' + date[0],
                url = 'http://www.bank.gov.ua/control/uk/curmetal/' +
                    'currency/search?formType=searchPeriodForm&time_step=daily&' +
                    'currency=169&outer=table&' +
                    'periodStartTime=01.' + dateString +
                    '&periodEndTime=20.' + dateString;
            $.ajax({
                url: url,
                method: 'GET',
                success: function (data) {
                    var sum = 0,
                        $rows = $(data)
                            .find('.content > table:eq(3) tbody > tr:eq(1) td table tbody tr');
                    $rows.each(function (indexEl, item) {
                        sum += parseFloat($(item).find('td:last').text().trim());
                    });
                    console.log('nbu ' + sum + ' rows ' + $rows.length);
                    attachRate('#avg-nbu', ((sum / $rows.length) / 100).toFixed(2));
                }
            });
        }

        function requestFromPrivatbank(date, sum, counter, i) {
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
            $.ajax({
                method: 'GET',
                url: 'https://api.privatbank.ua/p24api/exchange_rates?json&date=' + placeDate,
                dataType: 'json',
                success: function (data) {
                    if (data.exchangeRate.length) {
                        var item = data.exchangeRate.find(function (item) {
                            return item.currency === 'USD';
                        });
                        sum += item.saleRateNB;
                        counter++;
                    }
                    i++;
                    requestFromPrivatbank(date, sum, counter, i);
                }
            });
        }

        var $date = $('#date'),
            currentDate = new Date();

        $date.val(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1));

        $('form').submit(function (e) {
            e.preventDefault();
            var date = $date.val().split('-');
            requestData(date);
            requestFromPrivatbank(date);
        });

    });
})(jQuery);

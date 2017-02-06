<template>
    <div class="text-center center-block" v-html="value"></div>
</template>

<script>
    import avgMixin from '../../mixins/avgMixin';
    import axios from 'axios';

    export default {
        name: 'avg-nbu',
        mixins: [avgMixin],
        methods: {
            fetchValue (date) {
                this.attachThrobber();

                const dateString = date[1] + '.' + date[0];
                const url = 'http://www.bank.gov.ua/control/uk/curmetal/' +
                    'currency/search?formType=searchPeriodForm&time_step=daily&' +
                    'currency=169&outer=xml&' +
                    'periodStartTime=01.' + dateString +
                    '&periodEndTime=' + this.getMaxDay(date) + '.' + dateString;

                axios.get(url).then(({data}) => {
                    const parser = new DOMParser();
                    const parsedData = parser.parseFromString(data, 'text/xml');
                    const $rows = parsedData.querySelectorAll('exchange_rate');
                    let sum = 0;

                    for (const $row of $rows) {
                        sum += parseFloat($row.textContent.trim());
                    }

                    this.attachRate(parseFloat(sum / $rows.length) / 100);
                    VueBus.$emit('avgNbuChanged', this.value);
                }).catch(() => {
                    this.attachRate(0);
                });
            }
        }
    }
</script>

<template>
    <div class="text-center center-block" v-html="value"></div>
</template>

<script>
    import currentMixin from '../../mixins/currentMixin';
    import axios from 'axios';

    export default {
        name: 'current-pb',
        mixins: [currentMixin],
        methods: {
            fetchValue (date) {
                let url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=USD';
                if (date) {
                    url += '&date=' + date;
                }

                this.attachThrobber();
                axios.get(url).then(({data}) => {
                    if (!data.length) {
                        date = date ? moment(date, 'YYYYMMDD') : moment();
                        this.fetchValue(date.subtract(1, 'days').format('YYYYMMDD'));
                    } else {
                        this.attachRate(parseFloat(data[0].rate))
                    }
                }).catch(() => {
                    this.attachRate(0);
                });
            }
        }
    }
</script>

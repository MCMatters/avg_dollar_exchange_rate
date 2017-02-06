<template>
    <div class="container pt-10 pb-10">
        <select-date></select-date>
        <div class="panel panel-default">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th></th>
                    <th>
                        <img src="images/avg.png"
                             data-localize="alt: avg, title: avg"
                             data-toggle="tooltip"
                             class="centered"
                             width="28"
                             height="28">
                    </th>
                    <th>
                        <img src="images/current.png"
                             data-localize="alt: current, title: current"
                             data-toggle="tooltip"
                             class="centered"
                             width="32"
                             height="32">
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <img src="images/icon_government.png"
                             data-localize="alt: nbu, title: nbu"
                             data-toggle="tooltip"
                             data-placement="left"
                             class="centered"
                             width="28"
                             height="28">
                    </td>
                    <td>
                        <avg-nbu></avg-nbu>
                    </td>
                    <td>
                        <current-nbu></current-nbu>
                    </td>
                </tr>
                <tr>
                    <td>
                        <img src="images/icon_pb.png"
                             data-localize="alt: pb, title: pb"
                             data-toggle="tooltip"
                             data-placement="left"
                             class="centered"
                             width="23"
                             height="23">
                    </td>
                    <td>
                        <avg-pb></avg-pb>
                    </td>
                    <td>
                        <current-pb></current-pb>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="form-group">
            <div class="input-group">
                <span class="input-group-addon" data-localize="textContent: my_salary"></span>
                <input type="number" class="form-control" v-model="salary">
                <span class="input-group-addon"
                      data-toggle="tooltip"
                      data-placement="left"
                      data-localize="title: salary_attention">
                    <i class="glyphicon glyphicon-question-sign"></i>
                </span>
            </div>
            <span class="help-block" v-show="salary != 0">
                <span data-localize="textContent: how_much_get_paid"></span>
                <span v-html="getSalary"></span>
            </span>
        </div>
    </div>
</template>

<script>
    import selectDate from './components/select-date.vue';
    import currentNbu from './components/current-nbu.vue';
    import currentPb from './components/current-pb.vue';
    import avgNbu from './components/avg-nbu.vue';
    import avgPb from './components/avg-pb.vue';

    export default {
        created () {
            VueBus.$on('avgNbuChanged', avgNbuRate => {
                this.avgNbuRate = avgNbuRate;
            });
        },
        mounted () {
            this.replaceTranslations();
            this.initTooltips();
        },
        components: {
            selectDate,
            currentNbu,
            currentPb,
            avgNbu,
            avgPb
        },
        data () {
            return {
                avgNbuRate: 0,
                salary: 0
            };
        },
        methods: {
            replaceTranslations () {
                document.documentElement.lang = chrome.i18n.getUILanguage().substr(0, 2);
                const $localizeItems = document.querySelectorAll('[data-localize]');
                for (let $item of $localizeItems) {
                    const locales = $item.dataset.localize.split(',');
                    for (const locale of locales) {
                        const localeKeys = locale.split(':');
                        $item[localeKeys[0].trim()] = chrome.i18n.getMessage(localeKeys[1].trim());
                    }
                }
            },
            initTooltips () {
                const $tooltips = document.querySelectorAll('[data-toggle=tooltip]');
                console.log($tooltips);
                for (let i = 0; i < $tooltips.length; i++) {
                    const tooltip = $tooltips[i];
                    new Tooltip($tooltips[i], {
                        placement: tooltip.dataset.placement || 'top',
                        animation: 'slideNfade'
                    })
                }
            }
        },
        computed: {
            getSalary () {
                return parseFloat(this.salary) * this.avgNbuRate;
            }
        }
    };
</script>

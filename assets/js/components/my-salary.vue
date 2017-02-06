<template>
    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon" data-localize="textContent: my_salary"></span>
            <input type="text"
                   class="form-control"
                   v-model="salary"
                   @keypress="handleKeypress" @paste.prevent="">
            <span class="input-group-addon"
                  data-toggle="tooltip"
                  data-placement="left"
                  data-localize="title: salary_attention">
                    <i class="glyphicon glyphicon-question-sign"></i>
                </span>
        </div>
        <span class="help-block" v-show="getSalary != 0">
                <span data-localize="textContent: how_much_get_paid"></span>
                <span v-html="getSalary"></span>
            </span>
    </div>
</template>

<script>
    import currencyMethods from '../mixins/currencyMethods';
    export default {
        mixins: [currencyMethods],
        created () {
            VueBus.$on('avgNbuChanged', avgNbuRate => {
                this.avgNbuRate = avgNbuRate;
            });
        },
        data () {
            return {
                avgNbuRate: null,
                salary: null
            };
        },
        methods: {
            handleKeypress (e) {
                if ((e.key === '.' && String(this.salary).indexOf('.') !== -1) ||
                    !/^(\d+|\.)$/.test(e.key)
                ) {
                    e.preventDefault();
                }
            }
        },
        computed: {
            getSalary () {
                const salary = this.toFixed(parseFloat(this.salary) * this.avgNbuRate, 2);
                return isNaN(salary) ? 0 : salary;
            }
        }
    };
</script>

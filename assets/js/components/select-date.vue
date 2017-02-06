<template>
    <form class="form-vertical">
        <div class="form-group">
            <input type="month" class="form-control" v-model="date">
        </div>
        <div class="form-group">
            <input type="submit" data-localize="value: submit" class="form-control btn-success" @click.prevent="submitForm">
        </div>
    </form>
</template>

<script>
    import dateMethods from '../mixins/dateMethods';

    export default {
        name: 'select-date',
        mixins: [dateMethods],
        data () {
            return {
                date: this.getDefaultValue()
            };
        },
        methods: {
            submitForm () {
                VueBus.$emit('dateChanged', String(this.date).split('-'));
            },
            getDefaultValue () {
                const today = this.getTodayDate();
                return today.year + '-' + today.month;
            }
        }
    }
</script>

<template>
    <div>
        <div>
            <button type="button" class="btn btn-success" @click="$emit('add')">
                <i class="fa fa-plus"></i>
                Add entrant
            </button>

            <button type="button" class="btn btn-secondary" @click="$emit('swap')" v-if="entrants && entrants.length == 2">
                <i class="fa fa-swap"></i>
                Swap entrants 
            </button>
        </div>

        <br/>

        <div class="jumbotron text-center" v-if="!entrants || entrants.length === 0">
            <h4>No entrants added.<br/>Click <a href @click.prevent="$emit('add')">here</a> to add an entrant.</h4>
        </div>
        
        <div class="row" v-if="entrants">
            <div class="col-md-6" v-for="(entrant, index) in entrants" :key="index">
                <Entrant 
                    v-bind:entrant="entrant"
                    v-bind:index="index"
                    v-bind:game-id="gameId"
                    v-on:delete="$emit('delete', $event)"/>
            </div>
        </div>

        <br/>

        <div class="actions">
            <button class="btn btn-secondary" @click="$emit('reset')">Reset form</button>
        </div>
    </div>
</template>

<script>
import Entrant from './Entrant';

export default {
    name: 'Entrants',
    props: ['entrants', 'gameId'],
    components: {
        Entrant
    }
}

</script>

<template>
<div id="app">
    <div class="container-fluid">
        <h1>Scoreman admin page</h1>
        <div class="row">
            <div class="col-md-2">
                <StreamQueue
                    v-on:select="autofillEntrants($event)"
                    v-on:load="updateTournamentData($event)"/>
            </div>
            <div class="col-md-10">
                <div v-if="!scoreboard" class="text-center">
                    <i class="fa fa-spin fa-refresh fa-4x"></i><br/>
                    Loading scoreboard, please wait
                </div>
                <Scoreboard v-if="scoreboard" v-model="scoreboard"
                    v-on:update="updateScoreboard()"/> 
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Scoreboard from './components/Scoreboard';
import StreamQueue from './components/StreamQueue';
import ApiService from './services/ApiService';
import SmashGgService from './services/SmashGgService';

let apiService = ApiService();
let smashGgService = SmashGgService();

export default {
    name: 'App',
    components: {
        Scoreboard,
        StreamQueue
    },
    data () {
        return {
            scoreboard: null 
        }
    },
    mounted: onMounted,
    methods: {
        updateScoreboard,
        updateTournamentData,
        autofillEntrants
    }
}

function onMounted() {
    var vm = this;
    apiService.getScoreboard()
        .then(scoreboard => {
            vm.scoreboard = scoreboard;
            return scoreboard;
        });

}

function updateScoreboard() {
    var vm = this;
    apiService.updateScoreboard(vm.scoreboard)
        .then(scoreboard => {
            vm.scoreboard = scoreboard;
            return scoreboard;
        });
}

function updateTournamentData(data) {
    var vm = this;

    vm.scoreboard.tournamentName = data.entities.tournament.name;
}

function autofillEntrants(set) {
    var vm = this;

    if (set.isSmashGg) {
        vm.scoreboard.round = set.fullRoundText;
        vm.scoreboard.streamer = set.stream.streamName;

        Promise.all(
            set.entrants.map(smashGgService.convertGgEntrant))
            .then(function (entrants) {
                vm.scoreboard.entrants = entrants;
                return entrants;
            });
    } else if (set.isChallonge) {
        vm.scoreboard.round = set.round_label;

        vm.scoreboard.entrants = [{
            name: set.player1.name,
            score: 0,
            players: [{
                name: set.player1.name
            }]
        }, {
            name: set.player2.name,
            score: 0,
            players: [{
                name: set.player2.name
            }]
        }];

    }

}

</script>

<style>

</style>

$(document).ready(function() {
    function Game(data) {
        this.name = ko.observable(data.name);
    }
    
    function GameListViewModel() {
        // Data
        var self = this;
        self.games = ko.observableArray([]);
        self.newGameText = ko.observable();
        
        // Operations
        self.addGame = function() {
            alert(this.newGameText());
            self.games.push(new Game({ name: this.newGameText() }));
            self.newGameText("");
        };
    }
});
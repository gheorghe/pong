function Game(data) {
    this.name = ko.observable(data.title);
    this.slotAvailable = ko.observable(data.slotAvailable);
}

function GameListViewModel() {
    // Data
    var self = this;
    self.games = ko.observableArray([]);
    self.gameName = ko.observable();
    self.slotAvailable = ko.observable();
    
    // Operations
    self.addGame = function() {
        self.games.push(new Game({ name: this.gameName() }));
        self.gameName("");
    };
}

ko.applyBindings(new GameListViewModel());
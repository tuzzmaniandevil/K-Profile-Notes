var
        APP_ID = controllerMappings.appName,
        DB_NAME = 'userNotes',
        DB_TITLE = 'User Notes DB';

var RECORD_TYPES = {
    NOTE: 'NOTE',
    ACTION: 'ACTION',
    TEMPLATE: 'TEMPLATE'
};

var RECORD_NAMES = {
    NOTE: function () {
        return 'note_' + formatter.now.time;
    },
    ACTION: function () {
        return 'action';
    },
    TEMPLATE: function (name) {
        return 'template_' + name;
    }
};
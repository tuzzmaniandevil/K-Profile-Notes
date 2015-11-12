var
        APP_ID = controllerMappings.appName,
        DB_NAME = 'userNotes',
        DB_TITLE = 'User Notes DB';

var RECORD_TYPES = {
    NOTE: 'NOTE',
    OPTION: 'OPTION',
    TYPE: 'TYPE',
    TEMPLATE: 'TEMPLATE'
};

var RECORD_NAMES = {
    NOTE: function () {
        return 'note_' + formatter.now.time;
    },
    OPTION: function (name) {
        return 'option_' + name;
    },
    TYPE: function () {
        return 'type';
    },
    TEMPLATE: function (name) {
        return 'template_' + name;
    }
};
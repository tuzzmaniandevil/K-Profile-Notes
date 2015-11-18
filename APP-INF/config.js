var
        APP_ID = controllerMappings.appName,
        DB_NAME = APP_ID + '_db',
        DB_TITLE = 'Profile Notes DB';

var RECORD_TYPES = {
    NOTE: 'NOTE',
    TYPE: 'TYPE',
    TEMPLATE: 'TEMPLATE'
};

var RECORD_NAMES = {
    NOTE: function () {
        return 'note_' + formatter.now.time;
    },
    TYPE: function () {
        return 'type';
    },
    TEMPLATE: function (name) {
        return 'template_' + name;
    }
};
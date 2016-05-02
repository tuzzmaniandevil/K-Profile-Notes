(function (g) {

    function config() {
        var _self = this;

        _self.APP_ID = controllerMappings.appName;
        _self.DB_NAME = _self.APP_ID + '_db';
        _self.DB_TITLE = 'Profile Notes DB';

        _self.RECORD_NAMES = {
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

        _self.RECORD_TYPES = {
            NOTE: 'NOTE',
            TYPE: 'TYPE',
            TEMPLATE: 'TEMPLATE'
        };
    }

    g._config = new config();

    controllerMappings
            .dependencies()
            .add('KongoDB')
            .build();
})(this);
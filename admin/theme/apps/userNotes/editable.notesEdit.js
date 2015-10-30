(function ($) {
    "use strict";

    var Note = function (options) {
        this.init('note', options, Note.defaults);
    };

    //inherit from Abstract input
    $.fn.editableutils.inherit(Note, $.fn.editabletypes.abstractinput);

    $.extend(Note.prototype, {
        /**
         Renders input from tpl
         
         @method render() 
         **/
        render: function () {
            this.$input = this.$tpl.find('input');
            this.$textarea = this.$tpl.find('textarea');
        },
        /**
         Default method to show value in element. Can be overwritten by display option.
         
         @method value2html(value, element) 
         **/
        value2html: function (value, element) {
            if (!value) {
                $(element).empty();
                return;
            }
            var html = '<div class="note-container">'
                    + '<div class="col-md-12" style="padding-left: 0px !important;">'
                    + '<span class="text-info"><strong>' + value.title + '</strong></span>'
                    + '<i class="fa fa-pencil editIcon" style="padding-left: 20px !important;"></i>'
                    + '</div>'
                    + '<div class="col-md-12" style="padding-left: 0px !important;">'
                    + '<pre style="font-size: inherit;color: #000000;border: initial;padding: initial;font-family: inherit; background-color:inherit !important;">' + value.details + '</pre>'
                    + '</div>'
                    + '</div>';
            $(element).html(html);
        },
        /**
         Gets value from element's html
         
         @method html2value(html) 
         **/
        html2value: function (html) {
            flog('html', html);
            if (html.length < 1) {
                return;
            }

            var value = JSON.parse(html);
            return value;
        },
        /**
         Converts value to string. 
         It is used in internal comparing (not for sending to server).
         
         @method value2str(value)  
         **/
        value2str: function (value) {
            var str = '';
            if (value) {
                for (var k in value) {
                    str = str + k + ':' + value[k] + ';';
                }
            }
            return str;
        },
        /*
         Converts string to value. Used for reading value from 'data-value' attribute.
         
         @method str2value(str)  
         */
        str2value: function (str) {
            flog('str2value', str);
            if (typeof str === 'string') {
                str = str.replace('\n', '\\n');
                str = str.replace('\r', '\\r');
                return JSON.parse(str);
            }
            return str;
        },
        /**
         Sets value of input.
         
         @method value2input(value) 
         @param {mixed} value
         **/
        value2input: function (value) {
            if (!value) {
                return;
            }
            this.$input.filter('[name="title"]').val(value.title);
            this.$textarea.filter('[name="details"]').val(value.details);
        },
        /**
         Returns value of input.
         
         @method input2value() 
         **/
        input2value: function () {
            return {
                title: this.$input.filter('[name="title"]').val(),
                details: this.$textarea.filter('[name="details"]').val()
            };
        },
        /**
         Activates input: sets focus on the first field.
         
         @method activate() 
         **/
        activate: function () {
            this.$input.filter('[name="title"]').focus();
        },
        /**
         Attaches handler to submit form in case of 'showbuttons=false' mode
         
         @method autosubmit() 
         **/
        autosubmit: function () {
            this.$input.keydown(function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
            });
        }
    });

    Note.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: '<div class="editable-note"><label><span>Title: </span><input type="text" name="title" class="input-small"></label></div>' +
                '<div class="editable-note"><label><span>Details: </span><textarea name="details" class="input-small"></textarea></label></div>',
        inputclass: ''
    });

    $.fn.editabletypes.note = Note;

}(window.jQuery));
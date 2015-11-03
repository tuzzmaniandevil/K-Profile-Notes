function initManageUserNotes() {
    initTimeago();
    initTagsInput();
    initModalSelect2();
    initModalForm();
    initEditTemplate();
    initRemoveTemplate();
}

function initTimeago() {
    $('.activities .timeago').timeago();
}

function initTagsInput() {
    $('#actions').tagsInput({
        width: '100%',
        defaultText: 'Add',
        removeWithBackspace: false,
        onAddTag: function (tag) {
            updateActionTag(tag, true);
        },
        onRemoveTag: function (tag) {
            updateActionTag(tag, false);
        }
    });
}

function initModalSelect2() {
    $('.actionSelect2').select2({
        tags: true,
        placeholder: "Select an action",
        ajax: {// instead of writing the function to execute the request we use Select2's convenient helper
            url: window.location.pathname,
            dataType: 'json',
            quietMillis: 250,
            cache: false,
            data: function (term, page) {
                flog('select2 - data', term);
                return {
                    searchActions: 'searchActions',
                    q: term
                };
            },
            processResults: function (data, page) {
                return {
                    results: $.map(data.actions, function (obj) {
                        return {id: obj, text: obj};
                    })
                };
            },
        }
    });
}

function initModalForm() {
    var addTemplateModal = $('#modal-add-template');
    var addTemplateForm = addTemplateModal.find('form');

    addTemplateForm.forms({
        validate: function (f) {
            var act = $(f).find('[name=action]');
            var actionVal = act.val().trim();

            if (actionVal.length > 0) {
                if (!$('#actions').tagExist(actionVal)) {
                    $('#actions').addTag(actionVal);
                }
            }

            flog('action', act.val());
            return true;
        },
        callback: function (resp) {
            if (resp.status) {
                Msg.success(resp.messages);
                addTemplateModal.modal('hide');
                $('#templateTableContainer').reloadFragment();
            }
        }
    });

    addTemplateModal.on('hidden', function () {
        addTemplateForm.trigger('reset');
        addTemplateModal.find('.modal-title').text('Create a new template');
        addTemplateModal.find('.actionSelect2').select2('val', '');
        addTemplateModal.find('[data-type="form-submit"]').text('Create');
        addTemplateModal.find('.template-action').attr('name', 'addTemplate');
    });
}

function initEditTemplate() {
    var addTemplateModal = $('#modal-add-template');
    $('body').on('click', '.btn-edit-template', function (e) {
        e.preventDefault();

        var btn = $(this);
        var json = btn.closest('tr').data('template-json');
        var templateId = btn.closest('tr').data('tid');

        addTemplateModal.find('.modal-title').text('Update template');
        addTemplateModal.find('[data-type="form-submit"]').text('Save');
        addTemplateModal.find('.template-action').attr('name', 'updateTemplate');
        addTemplateModal.find('.template-action').attr('value', templateId);

        addTemplateModal.find('input[name=name]').val(json.templateTitle);
        addTemplateModal.find('input[name=title]').val(json.title);
        addTemplateModal.find('textarea[name=details]').val(json.details);

        var s2 = addTemplateModal.find('.actionSelect2');

        if (json.action.trim().length > 0) {
            if (s2.find('[value="' + json.action + '"]').length === 0) {
                s2.append('<option value="' + json.action + '">' + json.action + '</option>')
            }
        }

        s2.select2('val', json.action);

        addTemplateModal.modal('show');
    });
}

function initRemoveTemplate() {
    $('body').on('click', '.btn-remove-template', function (e) {
        e.preventDefault();

        var btn = $(this);
        var templateId = btn.closest('tr').data('tid');

        $.ajax({
            type: "POST",
            data: {
                removeTemplate: templateId
            },
            url: window.location.pathname,
            dataType: "json",
            success: function (result) {
                if (result.status) {
                    Msg.success(result.messages);
                    btn.closest('tr').remove();
                } else {
                    Msg.warning(result.messages);
                }
            },
        });
    });
}

function updateActionTag(tag, add) {
    var data = {};
    if (add) {
        data['addNewAction'] = tag;
    } else {
        data['removeAction'] = tag;
    }
    $.ajax({
        type: "POST",
        data: data,
        url: window.location.pathname,
        dataType: "json",
        success: function (result) {
            flog(result);
        },
    });
}
function manageUserNotes(page, params) {
    log.info('manageUserNotes page={} params={}', page, params);

    var db = getOrCreateUrlDb(page);

    var actions = db.child(RECORD_NAMES.ACTION());

    if (isNull(actions)) {
        actions = db.createNew(RECORD_NAMES.ACTION(), '{"actions":[]}', RECORD_TYPES.ACTION);
    }

    var rawJson = actions.json;
    var json = JSON.parse(rawJson);

    var list = formatter.newArrayList();

    for (var i = 0; i < json.actions.length; i++) {
        list.add(json.actions[i]);
    }

    page.attributes.actions = list;

    var queryJson = {
        "size": 10,
        "query": {
            "filtered": {
                "query": {
                    "match_all": {}
                },
                "filter": {
                    "type": {
                        "value": RECORD_TYPES.NOTE
                    }
                }
            }
        },
        "sort": {
            "modifiedDate": {
                "order": "desc"
            }
        }
    };
    var actions = getActions(page);

    var rawJson = actions.json;
    var json = JSON.parse(rawJson);

    var list = formatter.newArrayList();

    for (var i = 0; i < json.actions.length; i++) {
        list.add(json.actions[i]);
    }

    var result = db.search(JSON.stringify(queryJson));
    page.attributes.recentChanges = result;
    page.attributes.noteActionList = list;
    page.attributes.noteTemplates = db.findByType(RECORD_TYPES.TEMPLATE);
}

function addNewAction(page, params) {
    log.info('addNewAction page={} params={}', page, params);

    var db = getOrCreateUrlDb(page);

    var actions = db.child(RECORD_NAMES.ACTION());

    if (isNull(actions)) {
        actions = db.createNew(RECORD_NAMES.ACTION(), '{"actions":[]}', RECORD_TYPES.ACTION);
    }

    var rawJson = actions.json;
    var json = JSON.parse(rawJson);

    var tag = safeString(params.addNewAction);
    json.actions.push(tag);

    actions.update(JSON.stringify(json));

    return page.jsonResult(true);
}

function removeAction(page, params) {
    log.info('removeAction page={} params={}', page, params);

    var db = getOrCreateUrlDb(page);

    var actions = db.child(RECORD_NAMES.ACTION());

    if (isNull(actions)) {
        return page.jsonResult(false);
    }

    var rawJson = actions.json;
    var json = JSON.parse(rawJson);
    var tag = safeString(params.removeAction);

    var a = json.actions;

    var newList = [];

    for (var i = 0; i < a.length; i++) {
        if (a[i] !== tag) {
            newList.push(a[i]);
        }
    }

    json.actions = newList;

    actions.update(JSON.stringify(json));

    return page.jsonResult(true);
}

function addTemplate(page, params) {
    log.info('addTemplate page={} params={}', page, params);

    var db = getOrCreateUrlDb(page);

    var tTitle = safeString(params.name);
    var tName = replaceYuckyChars(tTitle);
    var actionString = safeString(params.action);

    var templateRecord = getTemplateRecord(page, tName);

    if (isNotNull(templateRecord)) {
        var v = views.jsonResult(false).addFieldMessage('title', 'a Template with that name already exists');
        return views.jsonObjectView(v);
    }

    var d = {
        templateTitle: tTitle,
        templateName: tName,
        title: safeString(params.title),
        action: actionString,
        details: safeString(params.details)
    };

    if (isNotBlank(actionString)) {
        var actions = getActionsArray(page);

        if (!actions.contains(actionString)) {
            addAction(page, actionString);
        }
    }

    db.createNew(RECORD_NAMES.TEMPLATE(tName), JSON.stringify(d), RECORD_TYPES.TEMPLATE);

    return page.jsonResult(true, 'Successfully added template');
}

function updateTemplate(page, params) {
    log.info('updateTemplate page={} params={}', page, params);

    var templateId = safeString(params.updateTemplate);

    var record = getTemplateRecordFromId(page, templateId);
    var json = JSON.parse(record.json);

    var actionString = safeString(params.action);

    if (isNotBlank(actionString)) {
        var actions = getActionsArray(page);

        if (!actions.contains(actionString)) {
            addAction(page, actionString);
        }
    }

    var d = {
        templateTitle: safeString(params.name),
        templateName: json.templateName,
        title: safeString(params.title),
        action: actionString,
        details: safeString(params.details)
    };

    record.update(JSON.stringify(d));

    return page.jsonResult(true, 'Updated');
}

function searchActions(page, params) {
    log.info('searchActions page={} params={}', page, params);

    var actions = getActions(page);

    return views.textView(actions.json);
}
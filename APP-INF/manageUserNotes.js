function manageUserNotes(page, params) {
    log.info('manageUserNotes page={} params={}', page, params);

    var db = getOrCreateUrlDb(page);

    var types = getTypes(page);

    var rawJson = types.json;
    var json = JSON.parse(rawJson);

    var list = formatter.newArrayList();

    for (var i = 0; i < json.types.length; i++) {
        list.add(json.types[i]);
    }

    page.attributes.noteActionList = list;

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

    var result = db.search(JSON.stringify(queryJson));
    page.attributes.recentChanges = result;
    page.attributes.noteTemplates = db.findByType(RECORD_TYPES.TEMPLATE);
}

function addNewType(page, params) {
    log.info('addNewType page={} params={}', page, params);

    var tag = safeString(params.addNewType);

    addType(page, tag);

    return page.jsonResult(true);
}

function removeType(page, params) {
    log.info('removeType page={} params={}', page, params);

    var db = getOrCreateUrlDb(page);

    var types = db.child(RECORD_NAMES.TYPE());

    if (isNull(types)) {
        return page.jsonResult(false);
    }

    var rawJson = types.json;
    var json = JSON.parse(rawJson);
    var tag = safeString(params.removeType);

    var a = json.types;

    var newList = [];

    for (var i = 0; i < a.length; i++) {
        if (a[i] !== tag) {
            newList.push(a[i]);
        }
    }

    json.types = newList;

    types.update(JSON.stringify(json));

    return page.jsonResult(true);
}

function addTemplate(page, params) {
    log.info('addTemplate page={} params={}', page, params);

    var db = getOrCreateUrlDb(page);

    var tTitle = safeString(params.name);
    var tName = replaceYuckyChars(tTitle);
    var typeString = safeString(params.type);

    var templateRecord = getTemplateRecord(page, tName);

    if (isNotNull(templateRecord)) {
        var v = views.jsonResult(false).addFieldMessage('name', 'a Template with that name already exists');
        return views.jsonObjectView(v);
    }

    var d = {
        templateTitle: tTitle,
        templateName: tName,
        title: safeString(params.title),
        type: typeString,
        details: safeString(params.details)
    };

    if (isNotBlank(typeString)) {
        addType(page, typeString);
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
        var types = getTypesArray(page);

        if (!types.contains(actionString)) {
            addType(page, actionString);
        }
    }

    var d = {
        templateTitle: safeString(params.name),
        templateName: json.templateName,
        title: safeString(params.title),
        type: actionString,
        details: safeString(params.details)
    };

    record.update(JSON.stringify(d));

    return page.jsonResult(true, 'Updated');
}

function removeTemplate(page, params) {
    log.info('updateTemplate page={} params={}', page, params);

    var templateId = safeString(params.removeTemplate);

    var record = getTemplateRecordFromId(page, templateId);

    if (isNotNull(record)) {
        record.delete();
        return page.jsonResult(true, 'Template deleted');
    }

    return page.jsonResult(false, 'Template not found');
}

function searchTypes(page, params) {
    log.info('searchTypes page={} params={}', page, params);

    var types = getTypes(page);

    return views.textView(types.json, 'text/json');
}
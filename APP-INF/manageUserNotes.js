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
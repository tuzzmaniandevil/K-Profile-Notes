function userNotesTab(page, params, context) {
    var db = getOrCreateUrlDb(page);

    var ur = page.userResource;

    var queryJson = {
        "query": {
            "filtered": {
                "query": {
                    "match_all": {}
                },
                "filter": {
                    "and": [
                        {
                            "term": {
                                "userId": ur.thisProfile.id
                            }
                        },
                        {
                            "type": {
                                "value": RECORD_TYPES.NOTE
                            }
                        }
                    ]
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

    var actions = getActions(page);

    var rawJson = actions.json;
    var json = JSON.parse(rawJson);

    var list = formatter.newArrayList();

    for (var i = 0; i < json.actions.length; i++) {
        list.add(json.actions[i]);
    }

    context.put('noteActionsList', list);

    context.put('userNotesSearchResults', result);
}

function addUserNote(page, params) {
    log.info('addUserNote page={} params={}', page, params);
    var db = getOrCreateUrlDb(page);

    var currentUser = securityManager.currentUser;
    var now = formatter.now;
    var nowISO = formatter.formatDateISO8601(now);

    var userHref = safeString(params.createNew);
    var userResource = page.find(userHref);

    var title = safeString(params.title);
    var details = safeString(params.details);
    var action = safeString(params.action);

    var actions = getActionsArray(page);

    if (!actions.contains(action)) {
        addAction(page, action);
    }


    log.info('Add note for user {}', securityManager.currentUser.name);

    var d = {
        title: title,
        details: details,
        createdDate: nowISO,
        modifiedDate: nowISO,
        createdBy: currentUser.thisProfile.id,
        modifiedBy: currentUser.thisProfile.id,
        action: action,
        userName: userResource.thisProfile.name,
        userId: userResource.thisProfile.id
    };

    db.createNew(RECORD_NAMES.NOTE(), JSON.stringify(d), RECORD_TYPES.NOTE);

    return page.jsonResult(true);
}

function updateUserNote(page, params) {

}

function deleteUserNote(page) {
    log.info('deleteUserNote page={} attributes={}', page, page.attributes);

    var noteId = safeString(page.attributes.noteId)

    var record = getNoteRecord(page, noteId);

    if (isNotNull(record)) {
        record.delete();
    }
}
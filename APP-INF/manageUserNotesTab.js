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
                                "value": _config.RECORD_TYPES.NOTE
                            }
                        }
                    ]
                }
            }
        },
        "sort": {
            "createdDate": {
                "order": "desc"
            }
        }
    };

    var result = db.search(JSON.stringify(queryJson));

    var types = getTypes(page);

    var rawJson = types.json;
    var json = JSON.parse(rawJson);

    var list = formatter.newArrayList();

    for (var i = 0; i < json.types.length; i++) {
        list.add(json.types[i]);
    }

    context.put('noteActionsList', list);

    context.put('userNotesSearchResults', result);

    context.put('userNotesTemplates', db.findByType(_config.RECORD_TYPES.TEMPLATE));
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
    var typeString = safeString(params.type);

    var types = getTypesArray(page);

    if (!types.contains(typeString)) {
        addType(page, typeString);
    }


    log.info('Add note for user {}', securityManager.currentUser.name);

    var d = {
        title: title,
        details: details,
        createdDate: nowISO,
        modifiedDate: nowISO,
        createdBy: currentUser.thisProfile.id,
        modifiedBy: currentUser.thisProfile.id,
        type: typeString,
        userName: userResource.thisProfile.name,
        userId: userResource.thisProfile.id
    };

    db.createNew(_config.RECORD_NAMES.NOTE(), JSON.stringify(d), _config.RECORD_TYPES.NOTE);

    return page.jsonResult(true);
}

function updateUserNote(page, params) {
    log.info('updateUserNote page = {} params = {}', page, params);

    var noteId = safeString(page.attributes.noteId)
    var currentUser = securityManager.currentUser;
    var now = formatter.now;
    var nowISO = formatter.formatDateISO8601(now);

    var record = getNoteRecord(page, noteId);

    if (isNull(record)) {
        return page.jsonResult(false);
    }

    var rawJson = record.json;
    var json = JSON.parse(rawJson);

    var title = safeString(params.title);
    var details = safeString(params.details);
    var type = safeString(params.type);

    var types = getTypesArray(page);

    if (!types.contains(type)) {
        addType(page, type);
    }

    json.title = title;
    json.details = details;
    json.type = type;
    json.modifiedBy = currentUser.thisProfile.id;
    json.modifiedDate = nowISO;


    log.info('result {}', JSON.stringify(json));

    record.update(JSON.stringify(json));

    return page.jsonResult(true);
}

function deleteUserNote(page) {
    log.info('deleteUserNote page={} attributes={}', page, page.attributes);

    var noteId = safeString(page.attributes.noteId)

    var record = getNoteRecord(page, noteId);

    if (isNotNull(record)) {
        record.delete();
    }
}
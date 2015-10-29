function getOrCreateUrlDb(page) {
    var jsonDb = page.find('/jsondb');
    var db = jsonDb.child(DB_NAME);
    log.info("jsonDb = {} db = {}", jsonDb, db);
    if (isNull(db)) {
        db = jsonDb.createDb(DB_NAME, DB_TITLE, DB_NAME);
        db.setTypeMappings(RECORD_TYPES.NOTE, JSON.stringify(NoteMappings));
    }

    return db;
}

function getNoteRecord(page, noteId) {
    var db = getOrCreateUrlDb(page);
    return db.child(noteId);
}

function getActions(page) {
    var db = getOrCreateUrlDb(page);
    var actions = db.child(RECORD_NAMES.ACTION());

    if (isNull(actions)) {
        actions = db.createNew(RECORD_NAMES.ACTION(), '{"actions":[]}', RECORD_TYPES.ACTION);
    }

    return actions;
}

function getActionsArray(page) {
    var db = getOrCreateUrlDb(page);
    var actions = db.child(RECORD_NAMES.ACTION());

    if (isNull(actions)) {
        actions = db.createNew(RECORD_NAMES.ACTION(), '{"actions":[]}', RECORD_TYPES.ACTION);
    }

    return actions.jsonObject.actions;
}

function addAction(page, action) {
    var actions = getActions(page);

    var rawJson = actions.json;
    var json = JSON.parse(rawJson);

    json.actions.push(action);

    actions.update(JSON.stringify(json));
}

var setAllowAccess = function (jsonDB, allowAccess) {
    transactionManager.runInTransaction(function () {
        jsonDB.setAllowAccess(allowAccess);
    });
};

var getAppSettings = function (page) {
    var websiteFolder = page.closest('websiteVersion');
    var org = page.organisation;
    var branch = null;

    if (websiteFolder !== null && typeof websiteFolder !== 'undefined') {
        branch = websiteFolder.branch;
    }

    var app = applications.get(APP_ID);
    if (app !== null) {
        var settings = app.getAppSettings(org, branch);
        return settings;
    }
    return null;
};

var checkRedirect = function (page, params) {
    var href = page.href;
    if (!href.endsWith('/')) {
        return views.redirectView(href + '/');
    }
};

var NoteMappings = {
    "properties": {
        "title": {
            "type": "string"
        },
        "details": {
            "type": "string"
        },
        "createdDate": {
            "type": "date"
        },
        "modifiedDate": {
            "type": "date"
        },
        "action": {
            "type": "string",
            "index": "not_analyzed"
        },
        "userName": {
            "type": "string",
            "index": "not_analyzed"
        },
        "userId": {
            "type": "string",
            "index": "not_analyzed"
        }
    }
};
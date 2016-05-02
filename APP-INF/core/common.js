function getOrCreateUrlDb(page) {
    var jsonDb = page.find('/jsondb');
    var db = jsonDb.child(_config.DB_NAME);
    log.info("jsonDb = {} db = {}", jsonDb, db);
    if (isNull(db)) {
        db = jsonDb.createDb(_config.DB_NAME, _config.DB_TITLE, _config.DB_NAME);

        setAllowAccess(db, true);

        var b = formatter.newMapBuilder();
        b
                .field(_config.RECORD_TYPES.NOTE, JSON.stringify(NoteMappings))
                .field(_config.RECORD_TYPES.TYPE, JSON.stringify(TypeMappings))
                .field(_config.RECORD_TYPES.TEMPLATE, JSON.stringify(TemplateMappings));

        db.updateTypeMappings(b);
    }

    return db;
}

function getNoteRecord(page, noteId) {
    var db = getOrCreateUrlDb(page);
    return db.child(noteId);
}

function getTemplateRecord(page, tName) {
    var db = getOrCreateUrlDb(page);
    var name = _config.RECORD_NAMES.TEMPLATE(tName);
    return db.child(name);
}

function getTemplateRecordFromId(page, tName) {
    var db = getOrCreateUrlDb(page);
    return db.child(tName);
}

function getTypes(page) {
    var db = getOrCreateUrlDb(page);
    var types = db.child(_config.RECORD_NAMES.TYPE());

    if (isNull(types)) {
        types = db.createNew(_config.RECORD_NAMES.TYPE(), '{"types":[]}', _config.RECORD_TYPES.TYPE);
    }

    return types;
}

function getTypesArray(page) {
    var db = getOrCreateUrlDb(page);
    var types = db.child(_config.RECORD_NAMES.TYPE());

    if (isNull(types)) {
        types = db.createNew(_config.RECORD_NAMES.TYPE(), '{"types":[]}', _config.RECORD_TYPES.TYPE);
    }

    return types.jsonObject.types;
}

function addType(page, action) {
    var types = getTypes(page);

    var rawJson = types.json;
    var json = JSON.parse(rawJson);

    log.info('type length {} raw:  {} json {}', json.types.length, rawJson, json);

    if (json.types.indexOf(action) < 0) {
        json.types.push(action);
    }

    types.update(JSON.stringify(json));
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

    var app = applications.get(_config.APP_ID);
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
            "type": "string",
            "index": "not_analyzed"
        },
        "details": {
            "type": "string",
            "index": "not_analyzed"
        },
        "createdDate": {
            "type": "date"
        },
        "modifiedDate": {
            "type": "date"
        },
        "type": {
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

var TypeMappings = {
    "properties": {
        "types": {
            "type": "string",
            "index": "not_analyzed"
        }
    }
};

var TemplateMappings = {
    "properties": {
        "templateTitle": {
            "type": "string",
            "index": "not_analyzed"
        },
        "templateName": {
            "type": "string",
            "index": "not_analyzed"
        },
        "title": {
            "type": "string",
            "index": "not_analyzed"
        },
        "details": {
            "type": "string",
            "index": "not_analyzed"
        },
        "type": {
            "type": "string",
            "index": "not_analyzed"
        }
    }
};
function addNote(page, byUser, forUser, title, type, details) {
    var now = formatter.now;
    var nowISO = formatter.formatDateISO8601(now);

    var titleClean = safeString(title);
    var typeClean = safeString(type);
    var detailsClean = safeString(details);

    var types = getTypesArray(page);

    if (!types.contains(typeClean)) {
        addType(page, typeClean);
    }

    var byRes = applications.userApp.findUserResource(byUser);
    var forRes = applications.userApp.findUserResource(forUser);

    var d = {
        title: titleClean,
        details: detailsClean,
        createdDate: nowISO,
        modifiedDate: nowISO,
        createdBy: byRes.thisProfile.id,
        modifiedBy: byRes.thisProfile.id,
        type: typeClean,
        userName: forRes.thisProfile.name,
        userId: forRes.thisProfile.id
    };

    var record = db.createNew(RECORD_NAMES.NOTE(), JSON.stringify(d), RECORD_TYPES.NOTE);

    return record.jsonObject;
}
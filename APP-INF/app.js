/*==== Admin Controllers ====*/

controllerMappings
        .adminController()
        .path('/_addUserNote')
        .enabled(true)
        .addMethod('POST', 'addUserNote', 'createNew')
        .build();

/* Profile Page Panel & Tabs */
controllerMappings
        .adminProfileTab()
        .tab('Notes', 'userNotesTab', 'userNotesTab')
        .tabTemplate('userNotes/manageUserNotesTab.html')
        .panel('Notes', 'userNotesPanel', 'userNotesPanel')
        .panelTemplate('userNotes/manageUserNotesPanel.html')
        .build();

function userNotesTab(page, params, context) {
    var db = getOrCreateUrlDb(page);
    context.put('jsonDb', db);
}

function userNotesPanel(page, params, context) {

}

function addUserNote(page, params, files) {
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
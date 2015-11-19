/*==== Tab/Panel Controllers ====*/

controllerMappings
        .adminController()
        .path('/_addUserNote$')
        .enabled(true)
        .addMethod('POST', 'addUserNote', 'createNew')
        .build();

controllerMappings
        .adminController()
        .path('/_addUserNote/(?<noteId>[^/]*)$')
        .enabled(true)
        .addMethod('POST', 'updateUserNote', 'updateUserNote')
        .addMethod('DELETE', 'deleteUserNote')
        .build();

/* Profile Page Panel & Tabs */
controllerMappings
        .adminProfileTab()
        .tab('Notes', 'userNotesTab', 'userNotesTab')
        .tabTemplate('userNotes/manageUserNotesTab.html')
        .panel('Notes', 'userNotesPanel', 'userNotesPanel')
        .panelTemplate('userNotes/manageUserNotesPanel.html')
        .build();

/*==== Admin Controllers ====*/
controllerMappings
        .adminController()
        .path('/userNotes/')
        .enabled(true)
        .defaultView(views.templateView('userNotes/manageUserNotes.html'))
        .addMethod('GET', 'searchTypes', 'searchTypes')
        .addMethod('GET', 'manageUserNotes')
        .addMethod('POST', 'addNewType', 'addNewType')
        .addMethod('POST', 'removeType', 'removeType')
        .addMethod('POST', 'addTemplate', 'addTemplate')
        .addMethod('POST', 'updateTemplate', 'updateTemplate')
        .addMethod('POST', 'removeTemplate', 'removeTemplate')
        .build();

/*==== Dashboard Portlets ====*/
controllerMappings
        .adminPortletController()
        .portletSection('adminDashboardQuickLinks')
        .templatePath('/theme/apps/userNotes/dashboardQuicklink.html')
        .method('dashboardQuicklink')
        .enabled(true)
        .build();

function dashboardQuicklink(page, params, contextMap) {
    var db = getOrCreateUrlDb(page);

    var notes = db.findByType(RECORD_TYPES.NOTE);

    contextMap.put('profileNotes_size', notes.size());
}
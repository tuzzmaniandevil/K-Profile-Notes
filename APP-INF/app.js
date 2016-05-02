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

    var notes = db.findByType(_config.RECORD_TYPES.NOTE);

    contextMap.put('profileNotes_size', notes.size());
}

/*==== User Timeline ====*/
controllerMappings.setUserTimelineFunction('generateTimelineItems');

function generateTimelineItems(page, user, list) {

    var db = getOrCreateUrlDb(page);

    var profile = user.thisProfile;

    var queryJson = {
        "size": 2147483647,
        "query": {
            "filtered": {
                "filter": {
                    "bool": {
                        "must": [{
                                "type": {
                                    "value": _config.RECORD_TYPES.NOTE
                                }
                            },
                            {
                                "term": {
                                    "userId": profile.id.toString()
                                }
                            }
                        ]
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

    var hits = result.hits.hits;

    log.info('Hits: {}', hits.length);

    for (var i = 0; i < hits.length; i++) {
        var h = hits[i];
        var s = h.source;

        var createdDate = formatter.toDate(s.createdDate);
        var modifiedDate = formatter.toDate(s.modifiedDate);
        var isModified = (createdDate.compareTo(modifiedDate) < 0 ? true : false);

        var createdBy = page.find('/manageUsers/' + s.createdBy + '/');

        var createdByUR = createdBy.userResource;

        log.info('Created Date: {} , Modified Date: {}, CreatedBy: {}', createdDate, modifiedDate, createdByUR);

        var streamItem = applications.stream.streamEventBuilder()
                .profile(user)
                .title('Note Created by ' + createdByUR.thisProfile.formattedName + ': ' + s.title)
                .desc(s.details)
                .date(createdDate)
                .category('success')
                .inbound(true)
                .icon('fa-sticky-note')
                .build();

        list.add(streamItem);

    }
}
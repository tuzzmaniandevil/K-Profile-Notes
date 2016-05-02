function userNotesPanel(page, params, context) {
    var db = getOrCreateUrlDb(page);

    var ur = page.userResource;

    var queryJson = {
        "size": 0,
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
            "modifiedDate": {
                "order": "desc"
            }
        }
    };

    var result = db.search(JSON.stringify(queryJson));
    
    var total = 0;
    
    if(isNotNull(result)){
        total = result.hits.totalHits;
    }
    
    context.put('totalNotesCount', total);
}
function handleEmailReceivedEvent(page, event) {
    log.info('handleEmailReceivedEvent page={} event={}', page, event);

    var emailInOption = getOrCreateOption(page, 'email-in');
    var emailOutOption = getOrCreateOption(page, 'email-out');

    /* Check and handle the email-in option */
    var emailIn = emailInOption.jsonObject;
    if (emailIn.enabled) {
        log.info('EmailIn option enabled. Creating note');


    }
}
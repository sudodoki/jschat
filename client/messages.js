var backbone = require('exoskeleton');
var composer = require('composer')();
var notification = require('./services/notification');
var ContactFactory = require('./models/ContactFactory');
var Storage = require('./services/storage');
module.exports = function(app){
  backbone.socket.addEventListener("message", function(data, type){
    try{
      data = JSON.parse(data);
    }catch(e){
      console.log('cant parse data', data);
    }
    var roomProps = composer.compose('room-props');
    var id = roomProps && roomProps.id;
    var storage = new Storage(id);
    var messages = roomProps && roomProps.messages;
    var component = roomProps && roomProps.component;
    var room = roomProps && roomProps.room;

    if(data.type == "WRITING" && id == data.rid){
      messages.userWriting(data.uid);
      return;
    }
    if(data.type == "STATUS" && data.uid){
      var user = ContactFactory.getContactModel(data.uid);
      user.fetch();
      return;
    }
    if(data.action == "JOIN" || data.action == "LEAVE"){
      // todo: optimize
      room.fetch();
    }
    if(data.rid == id && messages && component){
      var model = messages.push(data);
      storage.push(model);
      if(model.__user){
        var data = model.__user;
        // throw notification
        if(notification.shouldNotify()){
          var note = notification.show(data.get('gh_avatar'), data.get('displayName') || data.get('gh_username'), model.get('text'));
          // focus on window if notification is clicked
          note.onclick = function(){
            window.focus();
          }
          if(note){
            setTimeout(function(){
              note.cancel();
            }, 2000);
          }
        }
      }
      //component.refs.messagesList.scrollToBottom();
    }
  });
}
Meteor.startup(function() {
  Session.setDefault('channel', 'channel3');
});


//Messages helpers
Template.messages.helpers({
  messages: Messages.find({})
});

// Template.messages.helpers({
//   checkSession: function(){
//     return this.session === Session.get('channel');
//   }
// });
Template.messages.onCreated(function(){
  var self = this;
  self.autorun(function() {
    self.subscribe('messages', Session.get('channel'));
  });
});
//Channels
Template.listings.helpers({
  channels: Channels.find({})
});


Template.channelForm.events({
  'click .channel-submit': function(e){
    Meteor.call('newChannel', {name: $('.channel-input').val()});
    Session.setPersistent('channel', $('.channel-input').val());
    var channel = Channels.findOne({name: $('.channel-input').val()});
    Meteor.call('updateChannel', {channel: channel, userId: Meteor.userId()});
  }
});

Template.channel.helpers({
  active: function() {
    if (Session.get('channel') === this.name) {
      return "active";
    } else {
      return "";
    }
  }
});


//Header helpers
Template.header.helpers({
  currentChannel: function() {
    return Session.get('channel');
  }
});
Template.footer.events({
  'keypress input': function(event) {
    var inputCheck = $('.input-box_text').val();
    if(inputCheck!= '') {
      var charCode = (typeof event.which =="number") ? event.which : event.keyCode;
      if (charCode == 13) {
          event.stopPropagation();
          Meteor.call('newMessage', {text: $('.input-box_text').val(), channel: Session.get('channel')});
          // $('.message-history').append('<div class="message"><a href="" class="message_profile-pic"></a><a href="" class="message_username">scotch</a><span class="message_timestamp">1:31 AM</span><span class="message_star"></span><span class="message_content">' + $('.input-box_text').val() + '</span></div>');
          $('.input-box_text').val("");
          return false;
      }
    }
    }
});

//Register new helper to get username from id
Template.registerHelper("usernameFromId", function(userId){
  var user = Meteor.users.findOne({_id: userId});
  if(typeof user === "undefined") {
    return "Anonymous";
  }
  if (typeof user.services.github !== "undefined"){
    return user.services.github.username;
  }
  if (typeof user.services.facebook !== "undefined"){
    return user.services.facebook.username;
  }
  if (typeof user.services.google !== "undefined"){
    return user.services.google.username;
  }
  return user.username;
});

//Get login user name
Template.registerHelper("getUserName", function(){
  if (Meteor.user()) {
    return Meteor.user().username;
  }
  else {
    return 0;
  }

});
//Register new helper to get time from timestamp
Template.registerHelper("getTime", function(timestamp){
  var date = new Date(timestamp);
  var hours = date.getHours();
  var minutes = '0' + date.getMinutes();
  var seconds = '0' + date.getSeconds();
  return hours + ':' + minutes + ':' + seconds;
});
//Config User Account
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

//Enable email verification
Accounts.config({
  sendVerificationEmail: true
});
//Subscribe to the database
// Meteor.subscribe('messages');
Meteor.subscribe('allUsernames');
Meteor.subscribe('channels');

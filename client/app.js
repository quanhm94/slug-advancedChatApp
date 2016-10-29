Meteor.startup(function() {
    var friends = [];
    Session.setDefault('channel', 'channel3');
    Session.setDefault('activeFriend', friends);
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
Template.channelListing.helpers({
    channels: Channels.find({}),
    friends: Session.get('activeFriend')
});


Template.channelForm.events({
  'click .channel-submit': function(e){
      createChannel($('.channel-input').val());
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

//Footer helpers
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

//Helper to get friends if user is logged in
Template.registerHelper("getFriends", function(){
    if(Meteor.user()){
        return Meteor.user().profile.friends;
    }
});
//Add friend to session friend list
Template.friend.events({
    'click .friend-name' : function (e,t) {

        var name = t.$(e.currentTarget).children('.name-text').text();
        var friends = Session.get('activeFriend');
        if (friends.indexOf(name) === -1 ) {
                friends.push(name);
                Session.set('activeFriend', friends);
                createChannel(name);
            }

    }
});
//Helper to get username from id
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
Meteor.subscribe('images');

//Image upload

var uploader = new ReactiveVar();
var currentUserId = Meteor.userId();
Template.uploadImage.helpers({
    images: Images.find({})
});

Template.uploadImage.events({
    'change .uploadFile': function (event) {

        event.preventDefault();

        var upload = new Slingshot.Upload("imageUploader");
        var timeStamp = Math.floor(Date.now());
        upload.send(document.getElementById('uploadFile').files[0], function (error, downloadUrl) {
            uploader.set();
            if (error) {
                console.error('Error uploading');
            }
            else {
                console.log("Success!");
                Meteor.call('uploadImage', {imageURL: downloadUrl, time: timeStamp, uploadedBy: currentUserId});
            }
        });
        uploader.set(upload);
    }
});

Template.uploadImage.helpers({

    isUploading: function () {
        return Boolean(uploader.get());
    },

    progress: function () {
        var upload = uploader.get();
        if (upload)
            return Math.round(upload.progress() * 100);
    },

    url: function () {

        return Images.findOne({uploadedBy: currentUserId}, {sort: {time: -1}});

    },

});

function createChannel(channelName) {
    Meteor.call('newChannel', {name: channelName});
    var channel = Channels.findOne({name: channelName});
    Meteor.call('updateChannel', {channel: channel, userId: Meteor.userId()});
}
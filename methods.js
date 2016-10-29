Meteor.methods({
  newMessage: function (message) {
    message.timestamp = Date.now();
    message.userId = Meteor.userId();
    Messages.insert(message);
  }
});
Meteor.methods({
  newChannel: function (channel) {
    channel.subUsers = [Meteor.userId()];
    Channels.insert(channel);
  }
});
Meteor.methods({
  updateChannel: function (channel) {
    console.log(channel);
    Channels.update({_id: channel._id}, {$push: {subUsers: Meteor.userId()}});
  }
});

Meteor.methods({
  addFriends: function (friendId) {

    var friends = Meteor.user().profile.friends;
    friends.push(friendId);
    Meteor.users.update(Meteor.user()._id, {$set: {"profile.friends": friends}});
    console.log(Meteor.user());
  }
});
Meteor.methods({
  uploadImage: function (img) {
    Images.insert(img);
  }
});


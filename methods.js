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
  updateChannel: function (channel, userId) {
    Channels.update({_id: channel._id}, {$push: {subUsers: userId}});
  }
});

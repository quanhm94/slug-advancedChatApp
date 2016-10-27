/**
 * Created by anonymous on 28/10/16.
 */
Accounts.onCreateUser(function (options, user) {
    if (user.profile == undefined) user.profile = {};
    user.profile.friends = [{name: "Tom"}, {name: "Dan"}];
    return user;
});
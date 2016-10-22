/**
 * Created by Quan Hoang on 10/22/2016.
 */
Slingshot.fileRestrictions("imageUploader", {
    allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
    maxSize: 2 * 1024 * 1024
});

Slingshot.createDirective("imageUploader", Slingshot.S3Storage, {
    AWSAccessKeyId: "AKIAIMHAMRFTDCCNN3FA",
    AWSSecretAccessKey: "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",
    bucket: "slugprofileimg",
    acl: "public-read",
    region: "ap-southeast-2",

    authorize: function () {
        if (!this.userId) {
            var message = "Please login before posting images";
            throw new Meteor.Error("Login Required", message);
        }

        return true;
    },

    key: function (file) {
        var currentUserId = Meteor.user().emails[0].address;
        return currentUserId + "/" + file.name;
    }

});
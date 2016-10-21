Router.configure({
  layoutTemplate: 'app'
});
//Root Route
Router.route('/',function(){
  this.redirect('/'+Session.get('channel'));
  this.render('', {to: 'channel-form'});
});

Router.route('/:channel', function() {
  Session.setPersistent('channel', this.params.channel);
  this.render('messages');
})

Router.route('/channel/crtChannel', function(){
  this.render('channelForm', {to: 'channel-form'});
}
);

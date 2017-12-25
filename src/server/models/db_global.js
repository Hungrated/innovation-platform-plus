const User = require('./db_users');
const Profile = require('./db_profiles');
const Blog = require('./db_blogs');
const Comment = require('./db_comments');
const Plan = require('./db_plans');
const File = require('./db_files');
const Banner = require('./db_banner');
const Class = require('./db_classes');
const Meeting = require('./db_meeting');
const Moment = require('./db_moments');

User.hasOne(Profile, {
  foreignKey: 'user_id'
});

Profile.hasMany(Plan, {
  foreignKey: 'student_id'
});
Profile.hasMany(Blog, {
  foreignKey: 'author_id'
});
Profile.hasMany(Meeting, {
  foreignKey: 'student_id'
});
Profile.hasMany(Moment, {
  foreignKey: 'student_id'
});

Profile.sync().then();
User.sync().then();

Class.belongsTo(Profile, {
  foreignKey: 'teacher_id'
});
Class.sync().then();

Blog.hasMany(Comment, {
  foreignKey: 'blog_id'
});

Comment.belongsTo(Profile, {
  foreignKey: 'student_id'
});

Blog.sync().then();
Comment.sync().then();

Plan.sync().then();

File.belongsTo(Profile, {
  foreignKey: 'uploader_id'
});

File.sync().then();

Banner.belongsTo(Profile, {
  foreignKey: 'uploader_id'
});

Banner.sync().then();

Meeting.belongsTo(Class, {
  foreignKey: 'class_id'
});

Meeting.sync().then();

Moment.sync().then();

module.exports = {
  User, Profile, Blog, Comment, Plan, File, Banner, Class, Meeting, Moment
};

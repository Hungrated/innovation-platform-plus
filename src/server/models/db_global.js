const User = require('./db_users');
const Profile = require('./db_profiles');
const Blog = require('./db_blogs');
const Comment = require('./db_comments');
const Plan = require('./db_plans');
const File = require('./db_files');
const Banner = require('./db_banner');
const Class = require('./db_classes');
const Meeting = require('./db_meeting');
const Moment = require('./db_moment');

User.hasOne(Profile, {
  foreignKey: 'user_id'
});

Profile.sync().then();
User.sync().then();

Class.belongsTo(Profile, {
  foreignKey: 'teacher_id'
});
Class.sync().then();

Blog.belongsTo(Profile, {
  foreignKey: 'author_id'
});

Blog.hasMany(Comment, {
  foreignKey: 'blog_id'
});

Comment.belongsTo(Profile, {
  foreignKey: 'student_id'
});

Blog.sync().then();
Comment.sync().then();

Plan.belongsTo(Profile, {
  foreignKey: 'student_id'
});

Plan.sync().then();

File.belongsTo(Profile, {
  foreignKey: 'uploader_id'
});

File.sync().then();

Banner.belongsTo(Profile, {
  foreignKey: 'uploader_id'
});

Banner.sync().then();

Meeting.belongsTo(Profile, {
  foreignKey: 'student_id'
});

Meeting.belongsTo(Class, {
  foreignKey: 'class_id'
});

Meeting.sync().then();

Moment.belongsTo(Profile, {
  foreignKey: 'student_id'
});

Moment.sync().then();

module.exports = {
  User, Profile, Blog, Comment, Plan, File, Banner, Class, Meeting, Moment
};

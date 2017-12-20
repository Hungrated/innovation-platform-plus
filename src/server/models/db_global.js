const User = require('./db_users');
const Profile = require('./db_profiles');
const Blog = require('./db_blogs');
const Comment = require('./db_comments');
const Plan = require('./db_plans');
const File = require('./db_files');
const Banner = require('./db_banner');

User.hasOne(Profile, {
  foreignKey: 'user_id'
});

User.sync().then();
Profile.sync().then();

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

module.exports = {
  User, Profile, Blog, Comment, Plan, File, Banner
};

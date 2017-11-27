module.exports = {

  REG_SUCCEEDED: {
    'status': 1000,
    'msg': '注册成功'
  },

  REG_FAILED: {
    'status': 1001,
    'msg': '注册失败'
  },

  LOGIN_SUCCEEDED: {
    'status': 1100,
    'msg': '登录成功'
  },

  INVALID_USERNAME: {
    'status': 1101,
   'msg': '无此用户名'
  },

  PASSWORD_CHECK_FAILED: {
    'status': 1102,
    'msg': '密码错误'
  },

  ALREADY_LOGGED_IN: {
    'status': 1103,
    'msg': '已是登录状态'
  },

  NOT_YET_LOGGED_IN: {
   'status': 1104,
    'msg': '尚未登录状态'
  },

  LOGGED_OUT: {
    'status': 1200,
    'msg': '已退出登录'
  },

  LOG_OUT_ERROR: {
    'status': 1201,
    'msg': '退出异常'
  },

  USERINFO_IMPORT_SUCCEEDED: {
    'status': 1300,
    'msg': '学生信息导入成功'
  },

  USERINFO_IMPORT_FAILED: {
    'status': 1301,
    'msg': '学生信息导入失败'
  },

  USER_PWD_MOD_SUCCEEDED: {
    'status': 1400,
    'msg': '密码修改成功'
  },

  USER_PWD_MOD_FAILED: {
    'status': 1401,
    'msg': '密码修改失败'
  },

  PROFILE_MOD_SUCCEEDED: {
    'status': 2000,
    'msg': '档案更新成功'
  },

  PROFILE_MOD_FAILED: {
    'status': 2001,
    'msg': '档案更新失败'
  },

  PROFILE_FETCH_FAILED: {
    'status': 2101,
    'msg': '档案获取失败'
  },

  BLOG_PUB_SUCCEEDED: {
   'status': 3000,
    'msg': '博文发布成功'
  },

  BLOG_PUB_FAILED: {
    'status': 3001,
    'msg': '博文发布失败'
  },

  BLOG_LIST_FETCH_FAILED: {
    'status': 3101,
    'msg': '获取博文列表失败'
  },

  BLOG_DETAILS_FETCH_FAILED: {
    'status': 3102,
    'msg': '获取博文详情失败'
  },

  COMMENT_SUCCEEDED: {
    'status': 3200,
    'msg': '评论成功'
  },

  COMMENT_FAILED: {
    'status': 3201,
    'msg': '评论失败'
  },

  FILE_UPLOAD_SUCCEEDED: {
    'status': 4000,
    'msg': '资源文件上传成功'
  },

  FILE_UPLOAD_FAILED: {
    'status': 4001,
    'msg': '资源文件上传失败'
  },

  FILE_RENAME_FAILED: {
    'status': 4101,
    'msg': '资源文件重命名失败'
  },

  FILE_INFO_FETCH_ERROR: {
    'status': 4102,
    'msg': '资源文件信息错误'
  },

  FILE_DOWNLOAD_FAILED: {
    'status': 4201,
    'msg': '资源文件下载失败'
  },

  PLAN_SUBMIT_SUCCEEDED: {
    'status': 5000,
    'msg': '计划提交成功'
  },

  PLAN_SUBMIT_FAILED: {
    'status': 5001,
    'msg': '计划提交失败'
  },

  PLAN_MOD_SUCCEEDED: {
    'status': 5100,
    'msg': '计划修改成功'
  },

  PLAN_MOD_FAILED: {
    'status': 5101,
    'msg': '计划修改失败'
  },

  PLAN_VERIFY_SUCCEEDED: {
    'status': 5200,
    'msg': '计划审核成功'
  },

  PLAN_VERIFY_FAILED: {
    'status': 5201,
    'msg': '计划审核失败'
  },

  PLAN_RATE_SUCCEEDED: {
    'status': 5300,
    'msg': '计划评价成功'
  },

  PLAN_RATE_FAILED: {
    'status': 5301,
    'msg': '计划评价失败'
  },

  PLAN_QUERY_SUCCEEDED: {
    'status': 5400,
    'msg': '计划查询成功'
  },

  PLAN_QUERY_FAILED: {
    'status': 5401,
    'msg': '计划查询失败'
  },

  PLAN_EXPORT_SUCCEEDED: {
    'status': 5500,
    'msg': '计划导出成功'
  },

  PLAN_EXPORT_FAILED: {
    'status': 5501,
    'msg': '计划导出失败'
  },

  CONNECTION_ERROR: {
    'status': 9001,
    'msg': '通信故障'
  },

  SERVER_INNER_ERROR: {
    'status': 9002,
    'msg': '服务器内部错误'
  }
};
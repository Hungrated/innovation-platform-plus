module.exports = {

  REG_SUCCESSFUL: {
    'status': 1000,
    'msg': '注册成功'
  },

  REG_FAILED: {
    'status': 1001,
    'msg': '注册失败'
  },

  LOGIN_SUCCESSFUL: {
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

  USERINFO_PARSE_SUCCESSFUL: {
    'status': 1300,
    'msg': '学生信息解析成功'
  },

  USERINFO_PARSE_FAILED_NOT_SUITABLE: {
    'status': 1301,
    'msg': '学生信息解析失败：表格文件格式不匹配'
  },

  USERINFO_PARSE_FAILED_DUP_CLASS_INFO: {
    'status': 1302,
    'msg': '学生信息解析失败：班级信息已存在，无需重复添加'
  },

  USERINFO_IMPORT_SUCCESSFUL: {
    'status': 1400,
    'msg': '学生信息导入成功'
  },

  USERINFO_IMPORT_FAILED: {
    'status': 1401,
    'msg': '学生信息导入失败'
  },

  USER_PWD_MOD_SUCCESSFUL: {
    'status': 1500,
    'msg': '密码修改成功'
  },

  USER_PWD_MOD_FAILED: {
    'status': 1501,
    'msg': '密码修改失败'
  },

  PROFILE_MOD_SUCCESSFUL: {
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

  BLOG_PUB_SUCCESSFUL: {
    'status': 3000,
    'msg': '文章发布成功'
  },

  BLOG_PUB_FAILED: {
    'status': 3001,
    'msg': '文章发布失败'
  },

  BLOG_LIST_FETCH_FAILED: {
    'status': 3101,
    'msg': '获取博文列表失败'
  },

  BLOG_DETAILS_FETCH_FAILED: {
    'status': 3102,
    'msg': '获取博文详情失败'
  },

  COMMENT_SUCCESSFUL: {
    'status': 3200,
    'msg': '评论成功'
  },

  COMMENT_FAILED: {
    'status': 3201,
    'msg': '评论失败'
  },

  FILE_UPLOAD_SUCCESSFUL: {
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

  PLAN_SUBMIT_SUCCESSFUL: {
    'status': 5000,
    'msg': '计划提交成功'
  },

  PLAN_SUBMIT_FAILED: {
    'status': 5001,
    'msg': '计划提交失败'
  },

  PLAN_MOD_SUCCESSFUL: {
    'status': 5100,
    'msg': '计划修改成功'
  },

  PLAN_MOD_FAILED: {
    'status': 5101,
    'msg': '计划修改失败'
  },

  PLAN_VERIFY_SUCCESSFUL: {
    'status': 5200,
    'msg': '计划审核成功'
  },

  PLAN_VERIFY_FAILED: {
    'status': 5201,
    'msg': '计划审核失败'
  },

  PLAN_RATE_SUCCESSFUL: {
    'status': 5300,
    'msg': '总评成功'
  },

  PLAN_RATE_FAILED: {
    'status': 5301,
    'msg': '总评失败'
  },

  PLAN_QUERY_SUCCESSFUL: {
    'status': 5400,
    'msg': '计划查询成功'
  },

  PLAN_QUERY_FAILED: {
    'status': 5401,
    'msg': '计划查询失败'
  },

  PLAN_EXPORT_SUCCESSFUL: {
    'status': 5500,
    'msg': '计划导出成功'
  },

  PLAN_EXPORT_FAILED: {
    'status': 5501,
    'msg': '计划导出失败'
  },

  FINAL_EXPORT_SUCCESSFUL: {
    'status': 5600,
    'msg': '期末成绩表导出成功'
  },

  FINAL_EXPORT_FAILED: {
    'status': 5601,
    'msg': '期末成绩表导出失败'
  },

  CLASS_QUERY_SUCCESSFUL: {
    'status': 6000,
    'msg': '班级获取成功'
  },

  CLASS_QUERY_FAILED: {
    'status': 6001,
    'msg': '班级获取失败'
  },

  CLASS_QUERY_NULL: {
    'status': 6002,
    'msg': '班级获取为空'
  },

  CLASS_STATUS_CHANGE_SUCCESSFUL: {
    'status': 6100,
    'msg': '班级状态更改成功'
  },

  CLASS_STATUS_CHANGE_FAILED: {
    'status': 6101,
    'msg': '班级状态更改失败'
  },

  MEETING_REC_SUBMIT_SUCCESSFUL: {
    'status': 7000,
    'msg': '记录提交成功'
  },

  MEETING_REC_SUBMIT_FAILED: {
    'status': 7001,
    'msg': '记录提交失败'
  },

  MEETING_QUERY_FAILED: {
    'status': 7101,
    'msg': '记录查询失败'
  },

  MOMENT_FETCH_SUCCESSFUL: {
    'status': 8000,
    'msg': '动态获取成功'
  },

  MOMENT_FETCH_FAILED: {
    'status': 8001,
    'msg': '动态获取失败'
  },

  INFO_DELETE_SUCCESSFUL: {
    'status': 8000,
    'msg': '信息删除成功'
  },

  INFO_DELETE_FAILED: {
    'status': 8001,
    'msg': '信息删除失败'
  },

  BANNER_IMG_UPLOAD_SUCCESSFUL: {
    'status': 8100,
    'msg': '轮播图上传成功'
  },

  BANNER_IMG_UPLOAD_FAILED: {
    'status': 8101,
    'msg': '轮播图上传失败'
  },

  BANNER_IMG_STATUS_CHANGE_SUCCESSFUL: {
    'status': 8200,
    'msg': '轮播图状态更改成功'
  },

  BANNER_IMG_STATUS_CHANGE_FAILED: {
    'status': 8201,
    'msg': '轮播图状态更改失败'
  },

  BANNER_IMG_MOD_SUCCESSFUL: {
    'status': 8300,
    'msg': '轮播图更改成功'
  },

  BANNER_IMG_MOD_FAILED: {
    'status': 8301,
    'msg': '轮播图更改失败'
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

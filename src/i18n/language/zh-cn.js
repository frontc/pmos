export default{
    sitename:"PMOS",
    personalCenter:"个人中心",
    logout:"退出",
    login:"登录",
    maintenance:"维护",
    form:{
        username:"用户名",
        usernameHolder:"请输入用户名",
        usernameError:"用户名由英文字母开头的长度4-32位数字字母组成",
        password:"密码",
        passwordHolder:"请输入密码",
        passwordError:"请输入至少4个字符的密码",
        loginSuccess:"登陆成功！",
        loginFailed:"登陆失败！用户名或密码不正确！",
        projectName:"项目名称",
        bizType:"业务类型",
        costDept:"成本归属部门",
        employeeDept:"报工部门",
        demandDept:"需求部门",
        useDept:"使用部门",
        supplier:"供应商",
        outsider:"外协人员",
        employeeName:"员工姓名",
        select:"请选择",
        projectNameRequired:"项目名称不可为空",
        deptNameRequired:"部门名称不可为空",
        projectNameError:"项目名称长度应在2-60之间",
        bizType1Required:"业务大类不可为空",
        bizType2Required:"业务小类不可为空",
        bizTypeRequired:"业务类型不可为空",
        bizTypeCodeRequired:"业务类型代码不可为空",
        bizTypeCode1LengthError:"一级业务类型代码长度应为2",
        bizTypeCode2LengthError:"二级业务类型代码长度应为6",
        bizTypeCode2TypoError:"二级业务类型代码应以父代码开头",
        bizTypeCodeRepeatedError:"业务类型代码重复",
        costDeptRequired:"费用归属部门不可为空",
        month:"月份",
        selectFile:"选择文件",
        upload:"上传",
        download:"下载",
        projectType:"项目类型",
        dept:"部门",
        projectMonth:"立项月份",
        required:"此项不可为空",
        floatRequired:"必须为数字",
        blankError:"不可包含空格",
        target:"目标",
        all:"---全部---",
        projectStatus:"项目状态",
        totalProgress:"总体进度(0-1)",
        budgetDept:"预算部门",
        possibleOccurrence:"可能性",
        year:"年度",
        deptName:"部门",
    },
    tips404:"页面找不到了...",
    backHome:"返回首页",
    menu:{
        Expenditure:"实际发生",
        OwnManpower:"自有人力",
        OutsourcedManpower:"外协人力",
        Budget:"科技预算",
        DeptBudget:"部门预算",
        ProjectBudget:"项目预算",
        Basic:"基础数据",
        BussinessList:"业务类别",
        ProjectList:"项目清单",
        DeptList:"部门列表",
        DataWork:"数据作业",
        AnalysisTrace:"分析追踪",
        ProjectProgress:"项目进度",
    },
    action:{
        operation:"操作",
        add:"新增",
        edit:"编辑",
        delete:"删除",
        batchDelete:"批量删除",
        confirm:"确定",
        cancel:"取消",
        search:"查询",
        submit:"提交",
        empty:"清空",
        export:"导出",
        import:"导入",
        summary:"汇总",
    },
    tips:{
        deleteConfirm:"确认删除",
        deleteTitle:"删除数据",
        success:"成功",
        validateFailed:"校验失败",
        monthRequired:"请选择月份",
        fileRequired:"请选择文件",
        uploadWarning:"上传将清除现有对应范围数据，建议先导出备份，确认导入?",
        warning:"警告",
        successImport:"成功导入数据：",
        successGenerate:"成功生成数据：",
        containsDirtyDataImport:"未能导入!数据中存在脏数据：",

    },
    thead:{
        uid:"ID",
        monthId:"月份",
        supplier:"供应商",
        projectCode:"项目编号",
        projectName:"项目名称",
        bizType1:"业务大类",
        bizType2:"业务小类",
        costDept:"费用归属",
        bizTypeCode:"业务类型代码",
        bizType:"业务类型",
        relatedDept:"关联部门",
        parentCode:"父业务类型",
        levelID:"层级ID",
        employeeDept:"报工部门",
        demandDept:"需求部门",
        employeeCode:"工号",
        employeeName:"姓名",
        task:"任务",
        workHours:"工时",
        workDate:"报工日期",
        workDesc:"工作描述",
        useDept:"使用部门",
        productName:"产品名称",
        outsiderName:"姓名",
        level:"层级",
        scheduledWorkday:"应出勤日",
        actualWorkday:"实际出勤日",
        payAmount:"金额(元)",
        dept:"部门",
        projectType:"项目类型",
        projectManager:"PM",
        totalBudget:"总预算",
        ownManpowerBudget:"自有人力",
        outsourcedManpowerBudget:"外协人力",
        technicalServiceFeeBudget:"其他技服",
        capexBudget:"CAPEX",
        cloudFeeBudget:"云资源",
        otherBudget:"其他费用",
        manhourInternalTotal:"自有人月",
        manhourExternalTotal:"外协人月",
        scheduledStartDate:"项目起",
        scheduledEndDate:"项目止",
        projectMonth:"立项月份",
        projectStatus:"状态",
        totalProgress:"总计",
        ownManpowerProgress:"自有人力",
        outsourcedManpowerProgress:"外协人力",
        technicalServiceProgress:"技术服务费",
        capexProgress:"CAPEX",
        cloudProgress:"云资源",
        otherProgress:"其他",
        manhourInternalProgress:"自有人月",
        manhourExternalProgress:"外协人月",
        projectStatus:"状态",
        updateDate:"更新日期",
        budgetDept:"预算部门",
        item:"项目",
        itemDesc:"说明",
        opexBudget:"OPEX",
        technicalServiceBudget:"技服费",
        cloudBudget:"云资源",
        manhourInternal:"自有人月",
        manhourExternal:"外协人月",
        manhourInternalYear:"自有人年",
        manhourExternalYear:"外协人年",
        bizType1:"大类",
        bizType2:"小类",
        possibleOccurrence:"可能",
        deptName:"部门名称",
    },
    dialog:{
        export:"数据导出",
        import:"数据导入",
        manhourInternalImportTips:"1.导入时将清除当前月数据；2.部门名称将去除公司名；3.公共项目将用任务名覆盖项目名；4.新增项目将自动在项目映射中新增。",
    },
    dataSummary:"数据汇总",
    projectSummay:"项目汇总",
    budget:"预算",
    actual:"实际",
};
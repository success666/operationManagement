import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

Vue.use(Router)

import Layout from '../views/layout/Layout'
import Login from '../views/login/index'
import NotFound from '../views/404'
import DashBoard from '../views/dashboard/index'
import AccountList from '../views/accountOperat/accountList'
import AccountAdd from '../views/accountOperat/accountAdd'
import AccountEdit from '../views/accountOperat/accountEdit'
import Role from '../views/accountOperat/role'
import RoleList from '../views/accountOperat/roleList'
import ModifyPwd from '../views/login/modifyPwd'
import AccountTab from '../views/accountOperat/accountTab'
import SchoolTab from '../views/accountSchool/acSchoolTab'
import SchoolRole from '../views/accountSchool/roleMgmt'
import SchoolRoleAdd from '../views/accountSchool/roleMgmtAdd'
import SchoolMgmt from '../views/accountSchool/schoolMgmt'
import SchoolAdd from '../views/accountSchool/schoolAdd'
import SchoolEdit from '../views/accountSchool/schoolEdit'
import SchoolDetail from '../views/accountSchool/schoolDetail'
import SchoolAcMgmt from '../views/accountSchool/schoolAccountMgmt'
import SchoolAcAdd from '../views/accountSchool/schoolAccountAdd'
import SchoolAcEdit from '../views/accountSchool/schoolAccountEdit'
import DeptTab from '../views/accountDept/deptTab'
import DeptMgmt from '../views/accountDept/deptMgmt'
import DeptAdd from '../views/accountDept/deptAdd'
import DeptEdit from '../views/accountDept/deptEdit'
import DeptRoleMgmt from '../views/accountDept/deptRoleMgmt'
import DeptRoleAdd from '../views/accountDept/deptRoleAdd'
import DeptAccountMgmt from '../views/accountDept/deptAccountMgmt'
import DeptAccountAdd from '../views/accountDept/deptAccountAdd'
import DeptAccountEdit from '../views/accountDept/deptAccountEdit'
import KnowledgeAdd from '../views/knowledgeManagement/knowledgeAdd'
import KnowledgeDetails from '../views/knowledgeManagement/knowledgeDetails'
import KnowledgeEdit from '../views/knowledgeManagement/knowledgeEdit'
import KnowledgeMange from '../views/knowledgeManagement/knowledgeManage'
import VersionAdd from '../views/version/versionAdd'
import ParentFeedback from '../views/version/parentFeedback'
import SchoolFeedback from '../views/version/schoolFeedback'
import ProblemDetails from '../views/version/ProblemDetails'
import ProblemLook from '../views/version/problemLook'
import VersionMange from '../views/version/versionMange'
import VersionDetail from '../views/version/versionDetail'
import GpMgmt from '../views/operateMgmt/gpMgmt'
import GuidancePoint from '../views/operateMgmt/guidancePoint'
import GuidancePointAdd from '../views/operateMgmt/guidancePointAdd'
import GuidancePointEdit from '../views/operateMgmt/guidancePointEdit'
import GuidancePointImport from '../views/operateMgmt/guidacePointImport'
import GuidancePointDetail from '../views/operateMgmt/guidancePointDetail'

import Product from '../views/hardwareManagement/productmanager/product'
import ProductAdd from '../views/hardwareManagement/productmanager/productAdd'
import ProductEdit from '../views/hardwareManagement/productmanager/productEdit'
import ProductBatch from '../views/hardwareManagement/productBatchManager/productBatch'
import BatchAdd from '../views/hardwareManagement/productBatchManager/batchAdd'
import BatchEdit from '../views/hardwareManagement/productBatchManager/batchEdit'

import DeviceGroup from '../views/hardwareManagement/deviceGroup/deviceGroup'
import AddDevice from '../views/hardwareManagement/deviceGroup/addDevice'
import BindSchool from '../views/hardwareManagement/deviceGroup/bindschool'
import ViewDeviceGroup from '../views/hardwareManagement/deviceGroup/viewdevicegroup'

import Device from '../views/hardwareManagement/deviceManager/device'
import ImportDevice from '../views/hardwareManagement/deviceManager/importdevice'
import DeviceEdit from '../views/hardwareManagement/deviceManager/deviceedit'
import ViewDevice from '../views/hardwareManagement/deviceManager/viewdevice'

import Firmware from '../views/hardwareManagement/firmwareManager/firmware'
import FirmwareAdd from '../views/hardwareManagement/firmwareManager/firmwareadd'
import CheckDevice from '../views/hardwareManagement/firmwareManager/checkdevice'
import CheckVersion from '../views/hardwareManagement/firmwareManager/checkversion'
import FirmwareEdit from '../views/hardwareManagement/firmwareManager/firmwareedit'
import AfterSale from '../views/hardwareManagement/aftersale/aftersale'

import HwMgmt from '../views/teachMgmt/hwMgmt'
import HomwworkMgmt from '../views/teachMgmt/homeworkMgmt'
import HomeworkAdd from '../views/teachMgmt/homeworkAdd'
import HomwworkEdit from '../views/teachMgmt/homeworkEdit'
import HomeworkDetail from '../views/teachMgmt/homeworkDetail'
import HomeworkImport from '../views/teachMgmt/homeworkImport'

import Knowledge from '../views/knowledgeManagement/manager'
import Version from '../views/version/manager'
import ProblemFeedback from '../views/version/problemFeedback'
import ProductManager from '../views/hardwareManagement/productmanager/manager'
import ProductBatchMananger from '../views/hardwareManagement/productBatchManager/manager'
import DeviceManager from '../views/hardwareManagement/deviceManager/manager'
import DeviceGroupManager from '../views/hardwareManagement/deviceGroup/manager'
import FirmwareManager from '../views/hardwareManagement/firmwareManager/manager'

// 字典管理
import DictData from '../views/dictionaries/manager'
import DictionariesList from '../views/dictionaries/dictionariesList'
import Dictionaries from '../views/dictionaries/dictionaries'
import AddDictionaries from '../views/dictionaries/addDictionaries'


// app宣传管理
import AppAdvertise from '../views/appAdvertise/manager'
import AppAdvertiseList from '../views/appAdvertise/appAdvertiseList'
import AppAdvertiseDetail from '../views/appAdvertise/appAdvertiseDetail'

// 体质管理
import TestItemList from '../views/physical/testItem/TestItemList'
import TestItemDetail from '../views/physical/testItem/TestItemDetail'
import GuidanceDeyail from '../views/physical/testItem/GuidanceDeyail'
import TestItemImport from '../views/physical/testItem/BatchImport'
import TestItemForm from '../views/physical/testItem/TestItemForm'
import HealthImport from '../views/physical/health/BatchImport'
import HealthItemDetail from '../views/physical/health/HealthItemDetail'
import HealthForm from '../views/physical/health/HealthForm'
import HealthList from '../views/physical/health/HealthList'
import PhyMgmt from '../views/physical/PhyMgmt'

export const constantRouterMap = [
    { path: '/login', name: 'login', component: Login },
    { path: '/notfound', name: 'notfound', component: NotFound },
    // { path: '*', redirect: '/notfound' },
    { path: '/modifypwd', name: 'modifypwd', component: ModifyPwd },
    {
        path: '/',
        component: Layout,
        redirect: '/userSystem',
        name: 'Dashboard',
        hidden: true,
        children: [
            { path: 'dashboard', component: DashBoard },
            // 运营账号管理
            {
                path: 'userSystem',
                name: 'accounttab',
                component: AccountTab,
                redirect: '/userSystem/accountlist',
                meta: { title: '运营账号管理' },
                children: [
                    { path: 'accountlist', name: 'accountlist', component: AccountList, meta: { title: '账号管理' } },
                    { path: 'accountadd', name: 'accountadd', component: AccountAdd, meta: { title: '账号新增' } },
                    { path: 'accountedit', name: 'accountedit', component: AccountEdit, meta: { title: '账号编辑' } },
                    { path: 'role', name: 'role', component: Role, meta: { title: '角色新增' } },
                    { path: 'roleedit', name: 'roleedit', component: Role, meta: { title: '角色编辑' } },
                    { path: 'rolelist', name: 'rolelist', component: RoleList, meta: { title: '角色管理' } }
                ]
            },
            // 学校账号管理
            {
                path: 'schoolAccount',
                name: 'schoolAccount',
                component: SchoolTab,
                redirect: '/schoolAccount/schoolmgmt',
                meta: { title: '学校账号管理' },
                children: [
                    { path: 'role', name: 'schoolAcRole', component: SchoolRole, meta: { title: '角色管理' } },
                    { path: 'roleadd', name: 'schoolAcRoleAdd', component: SchoolRoleAdd, meta: { title: '角色新增' } },
                    { path: 'schoolmgmt', name: 'schoolMgmt', component: SchoolMgmt, meta: { title: '学校管理' } },
                    { path: 'schooladd', name: 'schoolAdd', component: SchoolAdd, meta: { title: '学校新增' } },
                    { path: 'schooledit', name: 'schoolEdit', component: SchoolEdit, meta: { title: '学校编辑' } },
                    { path: 'schooldetail', name: 'schoolDetail', component: SchoolDetail, meta: { title: '学校详情' } },
                    { path: 'schoolacmgmt', name: 'schoolAcMgmt', component: SchoolAcMgmt, meta: { title: '学校账号管理' } },
                    { path: 'schoolacadd', name: 'schoolAcAdd', component: SchoolAcAdd, meta: { title: '学校账号新增' } },
                    { path: 'schoolacedit', name: 'schoolAcEdit', component: SchoolAcEdit, meta: { title: '学校账号编辑' } }
                ]
            },
            // 教育局管理
            {
                path: 'mgmtDeptAccount',
                name: 'mgmtDeptAccount',
                component: DeptTab,
                redirect: '/mgmtDeptAccount/deptmgmt',
                meta: { title: '教育局管理' },
                children: [
                    { path: 'deptmgmt', name: 'deptmgmt', component: DeptMgmt, meta: { title: '教育机构管理' } },
                    { path: 'deptadd', name: 'deptadd', component: DeptAdd, meta: { title: '教育机构新增' } },
                    { path: 'deptedit', name: 'deptedit', component: DeptEdit, meta: { title: '教育机构编辑' } },
                    { path: 'deptrolemgmt', name: 'deptrolemgmt', component: DeptRoleMgmt, meta: { title: '角色管理' } },
                    { path: 'deptroleadd', name: 'deptroleadd', component: DeptRoleAdd, meta: { title: '角色新增' } },
                    { path: 'deptroleedit', name: 'deptroleedit', component: DeptRoleAdd, meta: { title: '角色编辑' } },
                    { path: 'deptaccountmgmt', name: 'deptaccountmgmt', component: DeptAccountMgmt, meta: { title: '教育机构账号管理' } },
                    { path: 'deptaccountadd', name: 'deptaccountadd', component: DeptAccountAdd, meta: { title: '教育机构账号新增' } },
                    { path: 'deptaccountedit', name: 'deptaccountedit', component: DeptAccountEdit, meta: { title: '教育机构账号编辑' } }
                ]
            },
            // 知识管理
            {
                path: 'knowledge',
                name: 'knowledge',
                component: Knowledge,
                redirect: '/knowledge/knowledge',
                meta: { title: '知识管理' },
                children: [
                    { path: 'knowledgeadd', name: 'knowledgeAdd', component: KnowledgeAdd, meta: { title: '添加知识' } },
                    { path: 'knowledgedetails', name: 'knowledgeDetails', component: KnowledgeDetails, meta: { title: '知识详情' } },
                    // { path: 'knowledge', name: 'knowledgeMange', component: KnowledgeMange, meta: { title: '知识管理' }},
                    { path: 'knowledge', name: 'knowledgeMange', component: KnowledgeMange },
                    { path: 'knowledgeedit', name: 'knowledgeEdit', component: KnowledgeEdit, meta: { title: '编辑知识' } }
                ]
            },
            // 版本管理
            {
                path: 'appVersion',
                name: 'version',
                component: Version,
                redirect: '/appVersion/appVersion',
                meta: { title: '版本管理' },
                children: [
                    { path: 'versionadd', name: 'versionAdd', component: VersionAdd, meta: { title: '新增版本' } },
                    // { path: 'appVersion', name: 'versionMange', component: VersionMange, meta: { title: '版本列表' }},
                    { path: 'appVersion', name: 'versionMange', component: VersionMange },
                    { path: 'versiondetail', name: 'versionDetail', component: VersionDetail, meta: { title: '版本详情' } }
                ]
            },
            {
                path: 'problemFeedback',
                name: 'problemFeedback',
                component: ProblemFeedback,
                redirect: '/problemFeedback/parentFeedback',
                meta: { title: '问题反馈' },
                children: [
                    { path: 'parentFeedback', name: 'parentFeedback', component: ParentFeedback, meta: { title: '家长反馈' } },
                    { path: 'schoolFeedback', name: 'schoolFeedback', component: SchoolFeedback, meta: { title: '学校反馈' } },
                    { path: 'ProblemLook', name: 'ProblemLook', component: ProblemLook, meta: { title: '' } },
                    { path: 'ProblemDetails', name: 'ProblemDetails', component: ProblemDetails, meta: { title: '' } },
                ]
            },
            // 字典管理
            {
                path: 'dictData',
                name: 'DictData',
                component: DictData,
                redirect: '/dictData/dictionariesList',
                meta: { title: '字典管理' },
                children: [
                    { path: 'dictionariesList', name: 'DictionariesList', component: DictionariesList, meta: { title: '字典类型列表', keepAlive: true } },
                    { path: 'dictionaries', name: 'Dictionaries', component: Dictionaries, meta: { title: '字典列表', keepAlive: true } },
                    { path: 'adddictionaries', name: 'AddDictionaries', component: AddDictionaries, meta: { title: '新增字典', keepAlive: false } },
                    { path: 'editdictionaries', name: 'EditDictionaries', component: AddDictionaries, meta: { title: '新增字典', keepAlive: false } },
                ]
            },

            // app宣传管理
            {
                path: 'notice',
                name: 'AppAdvertise',
                component: AppAdvertise,
                redirect: '/notice/appAdvertiseList',
                meta: { title: 'app宣传管理' },
                children: [
                    { path: 'appAdvertiseList', name: 'AppAdvertiseList', component: AppAdvertiseList, meta: { title: '公告管理', keepAlive: true } },
                    { path: 'appAdvertiseDetail', name: 'AppAdvertiseDetail', component: AppAdvertiseDetail, meta: { title: '新增公告', keepAlive: false } }
                ]
            },
            // 指导点管理
            {
                path: 'guidancePoint',
                name: 'guidancePoint',
                component: GpMgmt,
                redirect: '/guidancePoint/guidancemgmt',
                meta: { title: '指导点管理' },
                children: [
                    { path: 'guidancemgmt', name: 'guidancemgmt', component: GuidancePoint, meta: { title: '指导点列表' } },
                    { path: 'guidanceadd', name: 'guidanceadd', component: GuidancePointAdd, meta: { title: '指导点新增' } },
                    { path: 'guidanceedit', name: 'guidanceedit', component: GuidancePointEdit, meta: { title: '指导点编辑' } },
                    { path: 'guidanceimport', name: 'guidanceimport', component: GuidancePointImport, meta: { title: '指导点导入' } },
                    { path: 'guidancedetail', name: 'guidancedetail', component: GuidancePointDetail, meta: { title: '指导点详情' } }
                ]
            },
            // 教务管理
            {
                path: 'homeworkLib',
                name: 'teachmgmt',
                component: HwMgmt,
                redirect: '/homeworkLib/homeworkmgmt',
                meta: { title: '教务管理' },
                children: [
                    { path: 'homeworkmgmt', name: 'homeworkmgmt', component: HomwworkMgmt, meta: { title: '作业库列表' } },
                    { path: 'homeworkadd', name: 'homeworkadd', component: HomeworkAdd, meta: { title: '作业库新增' } },
                    { path: 'homeworkedit', name: 'homeworkedit', component: HomwworkEdit, meta: { title: '作业库编辑' } },
                    { path: 'homeworkimport', name: 'homeworkimport', component: HomeworkImport, meta: { title: '作业库导入' } },
                    { path: 'homeworkdetail', name: 'homeworkdetail', component: HomeworkDetail, meta: { title: '作业库详情' } }
                ]
            },
            // 体质管理
            {
                path: 'examinationRecord_lv2',
                name: 'PhyMgmt',
                component: PhyMgmt,
                redirect: '/examinationRecord_lv2/testItemList',
                meta: { title: '体质管理' },
                children: [
                    { path: 'testItemList', name: 'TestItemList', component: TestItemList, meta: { title: '体测管理' } },
                    { path: '/testItemDetail', name: 'TestItemDetail', component: TestItemDetail, meta: { title: '体测详情' } },
                    { path: '/guidanceDeyail', name: 'GuidanceDeyail', component: GuidanceDeyail, meta: { title: '体测详情' } },
                    { path: '/testItemImport', name: 'TestItemImport', component: TestItemImport, meta: { title: '批量导入' } },
                    { path: '/healthImport', name: 'HealthImport', component: HealthImport, meta: { title: '批量导入' } },
                    { path: '/healthItemDetail', name: 'HealthItemDetail', component: HealthItemDetail, meta: { title: '体检详情' } },
                    { path: '/testItemForm', name: 'TestItemForm', component: TestItemForm, meta: { title: '编辑体测详情数据' } },
                    { path: '/addTestItemForm', name: 'AddTestItemForm', component: TestItemForm, meta: { title: '添加体测数据' } },
                    { path: '/healthList', name: 'HealthList', component: HealthList, meta: { title: '体检管理' } },
                    { path: '/healthForm', name: 'HealthForm', component: HealthForm, meta: { title: '编辑体检详情数据' } },
                    { path: '/addHealthForm', name: 'AddHealthForm', component: HealthForm, meta: { title: '添加体检数据' } }
                ]
            },
            // 产品管理
            {
                path: 'product',
                name: 'productmanager',
                component: ProductManager,
                redirect: '/product/product',
                meta: { title: '产品管理' },
                children: [
                    { path: 'product', name: 'product', component: Product },
                    // { path: 'product', name: 'product', component: Product, meta: { title: '产品管理' }},
                    { path: 'productadd', name: 'productAdd', component: ProductAdd, meta: { title: '新增产品' } },
                    { path: 'productedit', name: 'productEdit', component: ProductEdit, meta: { title: '产品修改' } }
                ]
            },
            // 批次管理
            {
                path: 'productBatch',
                name: 'productBatchManager',
                component: ProductBatchMananger,
                redirect: '/productBatch/productBatch',
                meta: { title: '批次管理' },
                children: [
                    // { path: 'productBatch', name: 'productBatch', component: ProductBatch, meta: { title: '批次管理' }},
                    { path: 'productBatch', name: 'productBatch', component: ProductBatch },
                    { path: 'batchadd', name: 'batchAdd', component: BatchAdd, meta: { title: '新增产品批次' } },
                    { path: 'batchedit', name: 'batchEdit', component: BatchEdit, meta: { title: '产品批次修改' } }
                ]
            },
            // 设备管理
            {
                path: 'device',
                name: 'devicemanager',
                component: DeviceManager,
                redirect: '/device/device',
                meta: { title: '设备管理' },
                children: [
                    { path: 'device', name: 'device', component: Device },
                    { path: 'importdevice', name: 'importDevice', component: ImportDevice, meta: { title: '导入设备' } },
                    { path: 'deviceedit', name: 'deviceedit', component: DeviceEdit, meta: { title: '修改设备' } },
                    { path: 'viewdevice', name: 'viewdevice', component: ViewDevice, meta: { title: '查看' } },
                    // { path: 'afterSale', name: 'afterSale', component: AfterSale, meta: { title: '售后管理' }}
                ]
            },
            // 设备组管理
            {
                path: 'deviceGroup',
                name: 'deviceGroupManager',
                component: DeviceGroupManager,
                redirect: '/deviceGroup/deviceGroup',
                meta: { title: '设备组管理' },
                children: [
                    { path: 'deviceGroup', name: 'deviceGroup', component: DeviceGroup },
                    { path: 'adddevice', name: 'addDevice', component: AddDevice, meta: { title: '添加设备' } },
                    { path: 'bindschool', name: 'bindSchool', component: BindSchool, meta: { title: '绑定学校' } },
                    { path: 'viewdevicegroup', name: 'viewdevicegroup', component: ViewDeviceGroup, meta: { title: '查看设备' } }
                ]
            },
            // 固件管理
            {
                path: 'firmware',
                name: 'firmwaremanager',
                component: FirmwareManager,
                redirect: '/firmware/firmware',
                meta: { title: '固件管理' },
                children: [
                    { path: 'firmware', name: 'firmware', component: Firmware },
                    { path: 'firmwareadd', name: 'firmwareadd', component: FirmwareAdd, meta: { title: '新增固件' } },
                    { path: 'checkdevice', name: 'checkdevice', component: CheckDevice, meta: { title: '查看设备' } },
                    { path: 'checkversion', name: 'Checkversion', component: CheckVersion, meta: { title: '查看版本' } },
                    { path: 'firmwareedit', name: 'firmwareedit', component: FirmwareEdit, meta: { title: '修改固件' } }
                ]
            },
            { path: 'afterSale', name: 'afterSale', component: AfterSale, meta: { title: '售后管理' } }
        ]
    },
    // 硬件管理
    // {
    //   path: '/',
    //   component: Layout,
    //   redirect: '/product/product',
    //   name: 'hardwareManager',
    //   meta: { title: '硬件管理' },
    //   children: [
    //     // 产品管理
    //     { path: 'product', name: 'productmanager', component: ProductManager, redirect: '/product/product', meta: { title: '产品管理' },
    //       children: [
    //         { path: 'product', name: 'product', component: Product },
    //         // { path: 'product', name: 'product', component: Product, meta: { title: '产品管理' }},
    //         { path: 'productadd', name: 'productAdd', component: ProductAdd, meta: { title: '新增产品' }},
    //         { path: 'productedit', name: 'productEdit', component: ProductEdit, meta: { title: '产品修改' }}
    //       ]
    //     },
    //     // 批次管理
    //     { path: 'productBatch', name: 'productBatchManager', component: ProductBatchMananger, redirect: '/productBatch/productBatch', meta: { title: '批次管理' },
    //       children: [
    //         // { path: 'productBatch', name: 'productBatch', component: ProductBatch, meta: { title: '批次管理' }},
    //         { path: 'productBatch', name: 'productBatch', component: ProductBatch },
    //         { path: 'batchadd', name: 'batchAdd', component: BatchAdd, meta: { title: '新增产品批次' }},
    //         { path: 'batchedit', name: 'batchEdit', component: BatchEdit, meta: { title: '产品批次修改' }}
    //       ]
    //     },
    //     // 设备管理
    //     { path: 'device', name: 'devicemanager', component: DeviceManager, redirect: '/device/device', meta: { title: '设备管理' },
    //       children: [
    //         { path: 'device', name: 'device', component: Device },
    //         { path: 'importdevice', name: 'importDevice', component: ImportDevice, meta: { title: '导入设备' }},
    //         { path: 'deviceedit', name: 'deviceedit', component: DeviceEdit, meta: { title: '修改设备' }},
    //         { path: 'viewdevice', name: 'viewdevice', component: ViewDevice, meta: { title: '查看' }},
    //         // { path: 'afterSale', name: 'afterSale', component: AfterSale, meta: { title: '售后管理' }}
    //       ]
    //     },
    //     // 设备组管理
    //     { path: 'deviceGroup', name: 'deviceGroupManager', component: DeviceGroupManager, redirect: '/deviceGroup/deviceGroup', meta: { title: '设备组管理' },
    //       children: [
    //         { path: 'deviceGroup', name: 'deviceGroup', component: DeviceGroup },
    //         { path: 'adddevice', name: 'addDevice', component: AddDevice, meta: { title: '添加设备' }},
    //         { path: 'bindschool', name: 'bindSchool', component: BindSchool, meta: { title: '绑定学校' }},
    //         { path: 'viewdevicegroup', name: 'viewdevicegroup', component: ViewDeviceGroup, meta: { title: '查看设备' }}
    //       ]
    //     },
    //     // 固件管理
    //     { path: 'firmware', name: 'firmwaremanager', component: FirmwareManager,
    //       redirect: '/firmware/firmware', meta: { title: '固件管理' },
    //       children: [
    //         { path: 'firmware', name: 'firmware', component: Firmware },
    //         { path: 'firmwareadd', name: 'firmwareadd', component: FirmwareAdd, meta: { title: '新增固件' }},
    //         { path: 'checkdevice', name: 'checkdevice', component: CheckDevice, meta: { title: '查看设备' }},
    //         { path: 'checkversion', name: 'Checkversion', component: CheckVersion, meta: { title: '查看版本' }},
    //         { path: 'firmwareedit', name: 'firmwareedit', component: FirmwareEdit, meta: { title: '修改固件' }}
    //       ]
    //     },
    //     { path: 'afterSale', name: 'afterSale', component: AfterSale, meta: { title: '售后管理' }}
    //   ]
    // },
    // 演示
    {
        path: '/example',
        component: Layout,
        redirect: '/example/table',
        name: 'Example',
        meta: { title: 'Example', icon: 'example' },
        children: [{
                path: 'table',
                name: 'Table',
                component: () =>
                    import ('@/views/table/index'),
                meta: { title: 'Table', icon: 'table' }
            },
            {
                path: 'tree',
                name: 'Tree',
                component: () =>
                    import ('@/views/tree/index'),
                meta: { title: 'Tree', icon: 'tree' }
            }
        ]
    },

    {
        path: '/form',
        component: Layout,
        children: [{
            path: 'index',
            name: 'Form',
            component: () =>
                import ('@/views/form/index'),
            meta: { title: 'Form', icon: 'form' }
        }]
    }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})
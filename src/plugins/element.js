import Vue from 'vue'
import { 
  Button, 
  Input, 
  Form, 
  FormItem, 
  Message, 
  Container, 
  Header,
  Aside,
  Main,        
  Menu, 
  Submenu, 
  MenuItem,
  Breadcrumb,
  BreadcrumbItem, 
  Card,
  Table,
  TableColumn,
  Switch,
  Pagination,
  Dialog,
  MessageBox,
  Tooltip
} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tooltip)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
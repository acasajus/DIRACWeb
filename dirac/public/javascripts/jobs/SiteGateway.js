var dataSelect = ''; // Required to store the data for filters fields. Object.
var dataMngr = ''; // Required to connect form and table. Object.
var tableMngr = ''; // Required to handle configuration data for table. Object.
// Main routine
function initLoop(selection){
  dataSelect = selection;
  Ext.onReady(function(){
    var recSites = recordSite();
    var recServices = recordServices();
    var recResources = recordResources();
    var recStorage = recordStorage();
    var sites = initTable(recSites,'Site');
    var services = initTable(recServices,'Service');
    var resources = initTable(recResources,'Resource');
    var storage = initTable(recStorage,'Storage');
    var mainContent = new Ext.TabPanel({
      activeTab:0,
      items:[sites,services,resources,storage],
      margins:'0 0 2 0',
      monitorResize:true,
      region:'center'
    });
    renderInMainViewport([ mainContent ]);
  });
}
// function describing data structure, should be individual per page
function recordSite(){
  var record = new Ext.data.Record.create([
    {name:'SiteName'},
    {name:'Tier'},
    {name:'GridType'},
    {name:'Country'},
    {name:'Status'},
    {name:'DateEffective',type:'date',dateFormat:'Y-n-j H:i:s'},
    {name:'FormerStatus'},
    {name:'Reason'},
    {name:'FullCountry'},
    {name:'StatusIcon',mapping:'Status'}
  ]);
  return record
}
function recordServices(){
  var record = new Ext.data.Record.create([
    {name:'ServiceName'},
    {name:'ServiceType'},
    {name:'Site'},
    {name:'Country'},
    {name:'Status'},
    {name:'DateEffective',type:'date',dateFormat:'Y-n-j H:i:s'},
    {name:'FormerStatus'},
    {name:'Reason'},
    {name:'FullCountry'},
    {name:'SiteName',mapping:'Site'},
    {name:'StatusIcon',mapping:'Status'}
  ]);
  return record
}
function recordResources(){
  var record = new Ext.data.Record.create([
    {name:'ResourceName'},
    {name:'SiteName'},
    {name:'ResourceType'},
    {name:'Country'},
    {name:'Status'},
    {name:'DateEffective',type:'date',dateFormat:'Y-n-j H:i:s'},
    {name:'FormerStatus'},
    {name:'Reason'},
    {name:'FullCountry'},
    {name:'StatusIcon',mapping:'Status'}
  ]);
  return record
}
function recordStorage(){
  var record = new Ext.data.Record.create([
    {name:'StorageElementName'},
    {name:'SiteName'},
    {name:'ResourceName'},
    {name:'Country'},
    {name:'Status'},
    {name:'DateEffective',type:'date',dateFormat:'Y-n-j H:i:s'},
    {name:'FormerStatus'},
    {name:'Reason'},
    {name:'FullCountry'},
    {name:'StatusIcon',mapping:'Status'}
  ]);
  return record
}
// Initialisation of selection sidebar, all changes with selection items should goes here
function initTable(record,mode){
  function initBar(mode){
    var select = selectPanel(mode + 'SelectPanel'); // Initializing container for selection objects
    select.buttons[2].hide(); // Remove refresh button
    if(mode == 'Site'){
      var siteStatus = createMenu('siteStatus','Status');
      var siteType = createMenu('siteType','Type');
      var siteName = createMenu('siteName','Site');
      select.insert(0,siteStatus);
      select.insert(1,siteType);
      select.insert(2,siteName);
      for(var i = 0; i < select.items.items.length; i++){
        select.items.items[i].id = 'SiteSelect_' + select.items.items[i].id;
      }
    }else if(mode == 'Service'){
      var serviceStatus = createMenu('serviceStatus','Status');
      var serviceType = createMenu('serviceType','Type');
      var serviceSiteName = createMenu('serviceSiteName','Site');
      var serviceName = createMenu('serviceName','Service');
      select.insert(0,serviceStatus);
      select.insert(1,serviceType);
      select.insert(2,serviceSiteName);
      select.insert(3,serviceName);
      for(var i = 0; i < select.items.items.length; i++){
        select.items.items[i].id = 'ServiceSelect_' + select.items.items[i].id;
      }
    }else if(mode == 'Resource'){
      var resourceStatus = createMenu('resourceStatus','Status');
      var resourceType = createMenu('resourceType','Type');
      var resourceSiteName = createMenu('resourceSiteName','Site');
      var resourceName = createMenu('resourceName','Resource');
      select.insert(0,resourceStatus);
      select.insert(1,resourceType);
      select.insert(2,resourceSiteName);
      select.insert(3,resourceName);
      for(var i = 0; i < select.items.items.length; i++){
        select.items.items[i].id = 'ResourceSelect_' + select.items.items[i].id;
      }
    }else if(mode == 'Storage'){
      var storageStatus = createMenu('storageStatus','Status');
      var storageSiteName = createMenu('storageSiteName','Site');
      var storageName = createMenu('storageName','Storage');
      select.insert(0,storageStatus);
      select.insert(1,storageSiteName);
      select.insert(2,storageName);
      for(var i = 0; i < select.items.items.length; i++){
        select.items.items[i].id = 'StorageSelect_' + select.items.items[i].id;
      }
    }
  // Insert object to container BEFORE buttons:
    if(mode == 'Site'){
      var bar = sideBar('SiteSelectSideBar');
      bar.setTitle('Site Selections');
    }else if(mode == 'Service'){
      var bar = sideBar('ServiceSelectSideBar');
      bar.setTitle('Services Selections');
    }else if(mode == 'Resource'){
      var bar = sideBar('ResourceSelectSideBar');
      bar.setTitle('Resources Selections');
    }else if(mode == 'Storage'){
      var bar = sideBar('StorageSelectSideBar');
      bar.setTitle('Storage Selections');
    }
    bar.insert(0,select);
    return bar
  }
  var store = initStore(record);
  store.setDefaultSort('DateEffective','DESC'); // Default sorting
  if(mode == 'Site'){
    var columns = [
      {header:'',width:26,sortable:false,dataIndex:'StatusIcon',renderer:status,hideable:false,fixed:true,menuDisabled:true},
      {header:'SiteName',sortable:true,dataIndex:'SiteName',align:'left'},
      {header:'Status',sortable:true,dataIndex:'Status',align:'left'},
      {header:'Tier',sortable:true,dataIndex:'Tier',align:'left'},
      {header:'GridType',sortable:true,dataIndex:'GridType',align:'left'},
      {header:'',width:26,sortable:false,dataIndex:'Country',renderer:flag,hideable:false,fixed:true,menuDisabled:true},
      {header:'Country',sortable:true,dataIndex:'FullCountry',align:'left'},
      {header:'DateEffective [UTC]',sortable:true,dataIndex:'DateEffective',align:'left',renderer:Ext.util.Format.dateRenderer('Y-m-j H:i')},
      {header:'FormerStatus',sortable:true,dataIndex:'FormerStatus',align:'left'},
      {header:'Reason',sortable:true,dataIndex:'Reason',align:'left'},
    ];
    var id = 'SiteTab';
    store.baseParams = {'mode':'Site'};
    var bar = initBar(mode);
  }else if(mode == 'Service'){
    var columns = [
      {header:'',width:26,sortable:false,dataIndex:'StatusIcon',renderer:status,hideable:false,fixed:true,menuDisabled:true},
      {header:'ServiceName',sortable:true,dataIndex:'ServiceName',align:'left'},
      {header:'Status',sortable:true,dataIndex:'Status',align:'left'},
      {header:'Type',sortable:true,dataIndex:'ServiceType',align:'left'},
      {header:'SiteName',sortable:true,dataIndex:'SiteName',align:'left'},
      {header:'',width:26,sortable:false,dataIndex:'Country',renderer:flag,hideable:false,fixed:true,menuDisabled:true},
      {header:'Country',sortable:true,dataIndex:'FullCountry',align:'left'},
      {header:'DateEffective [UTC]',sortable:true,dataIndex:'DateEffective',align:'left',renderer:Ext.util.Format.dateRenderer('Y-m-j H:i')},
      {header:'FormerStatus',sortable:true,dataIndex:'FormerStatus',align:'left'},
      {header:'Reason',sortable:true,dataIndex:'Reason',align:'left'},
    ];
    var id = 'ServiceTab';
    store.baseParams = {'mode':'Service'};
    var bar = initBar(mode);
  }else if(mode == 'Storage'){
    var columns = [
      {header:'',width:26,sortable:false,dataIndex:'StatusIcon',renderer:status,hideable:false,fixed:true,menuDisabled:true},
      {header:'StorageElementName',sortable:true,dataIndex:'StorageElementName',align:'left'},
      {header:'Status',sortable:true,dataIndex:'Status',align:'left'},
      {header:'ResourceName',sortable:true,dataIndex:'ResourceName',align:'left'},
      {header:'SiteName',sortable:true,dataIndex:'SiteName',align:'left'},
      {header:'',width:26,sortable:false,dataIndex:'Country',renderer:flag,hideable:false,fixed:true,menuDisabled:true},
      {header:'Country',sortable:true,dataIndex:'FullCountry',align:'left'},
      {header:'DateEffective [UTC]',sortable:true,dataIndex:'DateEffective',align:'left',renderer:Ext.util.Format.dateRenderer('Y-m-j H:i')},
      {header:'FormerStatus',sortable:true,dataIndex:'FormerStatus',align:'left'},
      {header:'Reason',sortable:true,dataIndex:'Reason',align:'left'},
    ];
    var id = 'StorageTab';
    store.baseParams = {'mode':'Storage'};
    var bar = initBar(mode);
  }else{
    var columns = [
      {header:'',width:26,sortable:false,dataIndex:'StatusIcon',renderer:status,hideable:false,fixed:true,menuDisabled:true},
      {header:'ResourceName',sortable:true,dataIndex:'ResourceName',align:'left'},
      {header:'Status',sortable:true,dataIndex:'Status',align:'left'},
      {header:'SiteName',sortable:true,dataIndex:'SiteName',align:'left'},
      {header:'ResourceType',sortable:true,dataIndex:'ResourceType',align:'left'},
      {header:'',width:26,sortable:false,dataIndex:'Country',renderer:flag,hideable:false,fixed:true,menuDisabled:true},
      {header:'Country',sortable:true,dataIndex:'FullCountry',align:'left'},
      {header:'DateEffective [UTC]',sortable:true,dataIndex:'DateEffective',align:'left',renderer:Ext.util.Format.dateRenderer('Y-m-j H:i')},
      {header:'FormerStatus',sortable:true,dataIndex:'FormerStatus',align:'left'},
      {header:'Reason',sortable:true,dataIndex:'Reason',align:'left'},
    ];
    var id = 'ResourceTab';
    store.baseParams = {'mode':'Resource'};
    var bar = initBar(mode);
  }
  tableMngr = {'store':store,'columns':columns,'tbar':'','id':id};
  var t = table(tableMngr);
  var bbar = t.getBottomToolbar();
  bbar.hide();
  t.addListener('cellclick',function(table,rowIndex,columnIndex){
      showMenu('main',table,rowIndex,columnIndex);
  });
  var panel = new Ext.Panel({
    layout: 'border',
    items:[bar,t],
    margins:'0 0 2 0',
  });
  if(mode == 'Site'){
    panel.setTitle('Sites');
  }else if(mode == 'Service'){
    panel.setTitle('Services');
  }else if(mode == 'Resource'){
    panel.setTitle('Resources');
  }else if(mode == 'Storage'){
    panel.setTitle('Storage');
  }
  return panel
}
function setMenuItems(selections,table){
  if(selections && table && dirac.menu){
    if(table.id == 'SiteTab'){
      dirac.menu.add(
        {handler:function(){AJAXrequestAlt('getSiteHistory',selections.SiteName)},text:'History'}
      );
    }else if(table.id == 'ServiceTab'){
      dirac.menu.add(
        {handler:function(){AJAXrequestAlt('getServiceHistory',selections.ServiceName)},text:'History'}
      );
    }else if(table.id == 'ResourceTab'){
      dirac.menu.add(
        {handler:function(){AJAXrequestAlt('getResourceHistory',selections.ResourceName)},text:'History'}
      );
    }else if(table.id == 'StorageTab'){
      dirac.menu.add(
        {handler:function(){AJAXrequestAlt('getStorageHistory',selections.StorageElementName)},text:'History'}
      );
    }
  }else{
    return
  }
};
function afterDataLoad(){
  var msg = [];
  if(dataMngr){
    if(dataMngr.store){
      if(dataMngr.store.extra_msg){
         msg = dataMngr.store.extra_msg;
      }
    }
  }
  var statPanel = Ext.getCmp('statGrid');
  if((statPanel)&&(msg)){
    msg = createStateMatrix(msg);
    statPanel.store.loadData(msg);
  }
}
function AJAXrequestAlt(value,id){
  try{
    gMainLayout.container.mask('Please wait');
  }catch(e){}
  if(value == 'getSiteHistory'){
    var params = {'mode':'Site','getSiteHistory':id};
  }else if(value == 'getServiceHistory'){
    var params = {'mode':'Service','getServiceHistory':id};
  }else if(value == 'getResourceHistory'){
    var params = {'mode':'Resource','getResourceHistory':id};
  }else if(value == 'getStorageHistory'){
    var params = {'mode':'Storage','getStorageHistory':id};
  }else{
    var params = {value:id};
  }
  Ext.Ajax.request({
    failure:function(response){
      gMainLayout.container.unmask();
      AJAXerror(response.responseText);
    },
    method:'POST',
    params:params,
    success:function(response){
      AJAXsuccess(value,id,response.responseText);
    },
    url:'submit'
  });
}
function AJAXsuccess(value,id,response){
  try{
    gMainLayout.container.unmask();
  }catch(e){}
  var jsonData = Ext.util.JSON.decode(response);
  if(jsonData['success'] == 'false'){
    alert('Error: ' + jsonData['error']);
    return
  }
  var result = jsonData.result;
  var record = new Ext.data.Record.create([
    {name:'Status'},
    {name:'DateEffective'},
    {name:'Reason'},
    {name:'StatusIcon',mapping:'Status'}
  ]);
  var reader = new Ext.data.JsonReader({
    root:'result',
    totalProperty:'total'
  },record);
  var columns = [
    {header:'',width:26,sortable:false,dataIndex:'StatusIcon',renderer:status,hideable:false,fixed:true,menuDisabled:true},
    {header:'Status',sortable:true,dataIndex:'Status',align:'left'},
    {header:'Reason',sortable:true,dataIndex:'Reason',align:'left'},
    {header:'DateEffective',sortable:true,dataIndex:'DateEffective',align:'left'}
  ];
  var store = new Ext.data.Store({
    data:jsonData,
    reader:reader
  });
  var panel = new Ext.grid.GridPanel({
    anchor:'100%',
    columns:columns,
    store:store,
    stripeRows:true,
    viewConfig:{forceFit:true}
  });
  panel.addListener('cellclick',function(table,rowIndex,columnIndex){
    showMenu('nonMain',table,rowIndex,columnIndex);
  });
  if(value == 'getSiteHistory'){
    id = 'History of the site: ' + id;
  }else if(value == 'getServiceHistory'){
    id = 'History of the service: ' + id;
  }else if(value == 'getResourceHistory'){
    id = 'History of the resource: ' + id;
  }else if(value == 'getStorageHistory'){
    id = 'History of the storage element: ' + id;
  }else{
    id = setTitle(value,id);
  }
  displayWin(panel,id);
}

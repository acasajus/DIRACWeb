var gPlotsList = []; //Valid list of plots
var gTypeName = ""; //Type name
var gMainPanel = false;

function initSRMSpaceTokenDeploymentPlots( plotsList, selectionData ){
  gPlotsList = plotsList;
  Ext.onReady(function(){
    renderPage( plotsList, selectionData );
  });
}

function renderPage( plotsList, selectionData ){
  initPlotPage( "SRM Space Token plot generation" );

  appendToLeftPanel( createComboBox( "plotName", "Plot to generate", "Select a plot", plotsList ) );

  appendTimeSelectorToLeftPanel();

  var selWidgets = []

  selWidgets.push( createMultiselect( "Site", "Site", selectionData.Site ) );
  selWidgets.push( createMultiselect( "Hostname", "Hostname", selectionData.Hostname ) );
  selWidgets.push( createMultiselect( "SpaceTokenDesc", "Space Token Description", selectionData.SpaceTokenDesc ) );

  selWidgets.push( createHidden( "typeName", "SRMSpaceTokenDeployment" ) );
  appendToLeftPanel( createPanel( "Selection conditions", selWidgets ) );

  var orderKeys = []
  for( key in selectionData )
  {
  	orderKeys.push( [ key, key ] );
  }

  appendToLeftPanel( createRadioBoxPanel( "grouping", "Group by", orderKeys ) );

  renderPlotPage();
}

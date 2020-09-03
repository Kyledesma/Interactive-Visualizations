///http://127.0.0.1:8000/
///to refresh

// var limited = data.filter((val,i)=>i<10)
// console.log(limited)



///Section 1: Populating the drop-down list
//create a function to unpack data
function unpack(rows,index) {
  return rows.map(function (row) {
      return row[index];
  });
};

d3.json("samples.json").then(function(data) {
  var id = unpack(data.metadata, "id");
  d3.select("#selDataset")
  .selectAll("select")
  .data(id)
  .enter()
  .append("option")
  .html(function(d) {
    return `<option value ="${d}">${d}</option>`;
  })
});

// Section 2: Initializes the page with a default plot
function init() {
  d3.json("samples.json").then((data) => {
   
    ///Setting default subject ID
   var array = data.samples[0];
   var demo = data.metadata[0];


  ///CREATING BAR GRAPH
     //filtering to get the top 10 x values
     var rawx = array.otu_ids.filter((val,i)=>i<10);
 
     //Prefixing the x values with 'OTU '
     var x = rawx.map(function (i){
       return 'OTU ' + i;
     });
     
     ///filtering to get the top 10 y values
     var y = array.sample_values.filter((val,i)=>i<10);
   
     ///filtering to get the top 10 hover values
     var hover = array.otu_labels.filter((val,i)=>i<10);
     
     // Create the trace for the default bar graph
     var trace1 = {
       x: y,
       y: x,
       type: "bar",
       mode: 'markers',
       text: hover,
       orientation: 'h',
       order: 'descending',
       transforms: [{
        type: 'sort',
        target: 'y',
        order: 'descending'}]
     };
   
       // Create the data array for our bar graph plot
       var data = [trace1];
   
       // Define the bar graph plot layout
       var layout1 = {
        title: "Top 10 OTUs",
      };
     
       // Plot the chart to a div tag with id "bar-plot"
       Plotly.newPlot("bar",data,layout1);
      

  ///CREATING BUBBLE CHART
      //Creating the bubble chart trace
      var trace2 = {
        x : array.otu_ids,
        y : array.sample_values,
        mode: 'markers',
        marker: {
          size: array.sample_values,
          color:array.otu_ids, 
        },
        text: array.otu_labels,
      };

      // Create the data array for our bar graph plot
      var data2 = [trace2];

      //Creating the bubble chart layout
      var layout2 = {
        title:'Bubble Chart', 
        showlegend: false
      };

      // Plot the chart to a div tag with id "bar-plot"
       Plotly.newPlot("bubble",data2,layout2);
      


  ///POPULATING DEMOGRAPHIC INFO PANEL

          // select demographic panel to put data
           var demographicInfo = d3.select("#sample-metadata");

         // get demographic data and append info to panel
            Object.entries(demo).forEach((key) => {   
                demographicInfo.append("h5").text(key[0] + ": " + key[1] + "\n");    
            });

      });


}


// Section 3: Making everything dynamic
d3.selectAll("body").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.node().value;
  ///console.log(dataset);

  var CHART = d3.selectAll("#plot").node();

  // Initialize x and y arrays
  var x = [];
  var y = [];


  ///Converting the drop-down from string to ID to match demographic info
  datasetInt = parseInt(dataset);

  ///Reading in data file
  d3.json("samples.json").then((data) => {
  
  ///Pulling data for the selected drop-down
  var array = data.samples.find(({id}) => id === dataset);
  console.log(array);


    ///POPULATING DEMOGRAPHIC INFO TABLE
    var datasetInt = parseInt(dataset);
    var demo = data.metadata.find(({id}) => id === datasetInt);

    // select demographic panel to put data
    var demographicInfo = d3.select("#sample-metadata");
    demographicInfo.text("");

    // get demographic data and append info to panel
        Object.entries(demo).forEach((key) => {   
            demographicInfo.append("h5").text(key[0] + ": " + key[1] + "\n");    
        });

  ///CREATING BAR CHART
    //filtering to get the top 10 x values
    var rawx = array.otu_ids.filter((val,i)=>i<10);

    //Prefixing the x values with 'OTU '
    var x = rawx.map(function (i){
      return 'OTU ' + i;
    });

    ///filtering to get the top 10 y values
    var y = array.sample_values.filter((val,i)=>i<10);
    // console.log(y);

    ///filtering to get the top 10 hover values
    var hover = array.otu_labels.filter((val,i)=>i<10);
    
    // Create the trace for the dynamic bar graph
    var trace1 = {
      x: y,
      y: x,
      type: "bar",
      mode: 'markers',
      text: hover,
      orientation: 'h',
      transforms: [{
        type: 'sort',
        target: 'y',
        order: 'descending'
      }]
      };

    // Create the data array for our plot
      var data = [trace1];

    // Define the plot layout
      var layout = {
        title: "Top 10 OTUs",
    
    };
    
    // Plot the chart to a div tag with id "bar-plot"
      Plotly.newPlot("bar",data,layout);


  ///CREATING BUBBLE CHART
    
      //Creating the bubble chart trace
      var trace2 = {
        x : array.otu_ids,
        y : array.sample_values,
        mode: 'markers',
        marker: {
          size: array.sample_values,
          color:array.otu_ids, 
        },
        text: array.otu_labels,
      };

      // Create the data array for our bar graph plot
      var data2 = [trace2];

      //Creating the bubble chart layout
      var layout2 = {
        title:'Bubble Chart', 
        showlegend: false,
      };

      // Plot the chart to a div tag with id "bar-plot"
       Plotly.newPlot("bubble",data2,layout2);
   
       
 
  
  });
  };
  
  init();

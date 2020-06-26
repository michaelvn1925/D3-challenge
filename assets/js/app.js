// @TODO: YOUR CODE HERE!
var sampleData = "data.csv";

function seeData() {
    d3.csv("assets/data/data.csv").then(function(data) {
        console.log(data);
    });
}

seeData();


// Build the plot
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

 // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(CSVdata) {
    
    // Parse Data/Cast as numbers
    //===========================
    CSVdata.forEach(function(data) {
        data.poverty = +data.poverty
        data.healthcare = +data.healthcare
        data.age = +data.age
        data.smokes = +data.smokes
        console.log(data.state);
        console.log(data.abbr);
        console.log(data.poverty);
        console.log(data.healthcare);
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(CSVdata, d => d.poverty + 2)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(CSVdata, d => d.smokes) + 2])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
    .attr("class", "theCircles");

  var circlesGroup = svg.selectAll("g theCircles").data(CSVdata).enter();
    // We append the circles for each row of data (or each state, in this case).
     // Create Circles
    var circlesgroup = chartGroup.selectAll("g .theCircles")
    .data(CSVdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "12")
    .attr("fill", "blue")
    .attr("opacity", ".4")

     console.log(circlesgroup);
    
    var textgroup = chartGroup.selectAll("g .theCircles")
    .data(CSVdata)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.smokes) + (12 / 2.5))
    .attr("font-size", 12)
    .attr("class", "stateText")
    .text( function(d) {
      return d.abbr;
    })

    // Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Below Poverty line: ${d.poverty}<br>Percent smokers: ${d.smokes}`);
        });
    
    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listener to display and hide the tooltip
    textgroup.on("mouseover", function(data){
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

     circlesgroup.on("mouseover", function(data){
       toolTip.show(data, this);
   })
//       // onmouseout event
       .on("mouseout", function(data, index) {
           toolTip.hide(data);
       });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", ".5em")
        .attr("class", "axisText")
        .text("Percent smokers");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Percent Living in Poverty");
    }).catch(function(error) {
      console.log(error);
    });
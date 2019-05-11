var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// svg wrapper
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("fill", "blue")
  .attr("border-style", "solid")
  .attr("border-color", "black")
  .attr("opacity", ".9");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import csv data
d3.csv("data.csv")
  .then(function(stateData) {

    // parse data
    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
    });

    // scale
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(stateData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([25, d3.max(stateData, d => d.age)])
      .range([height, 0]);

    // create axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Age (years)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty (%)");
    var textgroup = chartGroup.append("g");

    // make circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", "15")
    .attr("fill", "green")
    .attr("opacity", ".3")
    .text(stateData);

    // add text
    textgroup.selectAll("text")
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.age))
    .text(d=>d.abbr)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")

    // init tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Poverty: ${d.poverty}%<br>Age: ${d.age} years`);
      });

    // call it
    chartGroup.call(toolTip);

    // event listeners
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  });

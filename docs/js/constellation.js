// Constants
const width = window.innerWidth;
const height = window.innerHeight;
// const color  = d3.scaleOrdinal(d3.schemeCategory10);
// Node colors
const director_color = '#7959ff';
const actor_color = '#FFB326';
// Link colors
const default_color = '#f1f1f1';
const highlight_color = '#4dfffc';
const other_color = '#767676';   // similar to background-color
// Test color
const text_color = '#dee7e7';

// Construct the main SVG
const svg = d3.select("div#constellation_svg")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// Creates the force graph
//
// More info at https://github.com/d3/d3-force
const simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(d => d.id))
  .force("charge", d3.forceManyBody().strength(-10))     // more force for more clarity
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collide", d3.forceCollide().radius(10));

// Add encompassing group for the zoom
//
// TODO: Describe what this does exactly, and why we need it here.
const g = svg.append("g")
  .attr("class", "everything");

// Graph has two keys: "nodes" and "links"
d3.json("result.json", (error, graph) => {
  if (error)
    throw error;

  // Internal list used by isConnected().
  const linkedByIndex = {};
  graph.links.forEach(link => linkedByIndex[link.source + "," + link.target] = true);

  function areNodesConnected(nodeA, nodeB) {
    return linkedByIndex[nodeA.id + "," + nodeB.id] || linkedByIndex[nodeB.id + "," + nodeA.id] || nodeA.id == nodeB.id;
  }

  function isLinkConnectedToNode(link, node) {
    return link.source === node || link.target === node
  }

  // .... Not sure where this is used .... commented for now
  // // Create data = list of groups
  // const allGroups = ["yellow", "blue", "red", "green", "purple", "black"]
  // const filterButton = g.append("g").attr("class", "filters")
  //   .append('select')
  //   .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
  //   .data(allGroups)
  //   .enter()
  //   .append('option')
  //   .text(function (d) { return d; }) // text showed in the menu
  //   .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // Data structure that allows us to directly call idToNode['Ben Affleck']
  // to get a node instead of knowing its ID in the array.
  const idToNode = {};
  graph.nodes.forEach(node => idToNode[node.id] = node)

  // The edges we see on the graph
  const links = g.append("g").attr("class", "links").selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke", default_color)
    .attr("stroke-width", function (d) { return Math.sqrt(6 * d.counts); }); // thickness based on number of movies done
  // .attr("d", function(d) {
  //     var curve=2;
  //     var homogeneous=3.2;
  //     var dx = d.target.x - d.source.x,
  //         dy = d.target.y - d.source.y,
  //         dr = Math.sqrt(dx*dx+dy*dy)*(d.linknum+homogeneous)/(curve*homogeneous);  //linknum is defined above
  //         return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  //     });
  // .on("click", expandLink);

  // The nodes we see on the graph
  const nodes = g.append("g").attr("class", "nodes").selectAll("g")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", function (d) { return 7.5 / Math.sqrt(d.group); }) // radius based on group - director / actor
    .attr("fill", function (d) { return (d.group == '1') ? director_color : actor_color; })    // colour based on group - director / actor
    .call(d3.drag()
      .on("start", drag_start)
      .on("drag", dragged)
      .on("end", drag_end));

  // The text above the nodes
  const text = g.append("g").attr("class", "labels").selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g")
    .append("text")
    .attr("x", "1.2em")
    .attr("y", ".35em")
    .style("font-family", "sans-serif")
    .style("font-size", "0.6em")
    .style("fill", text_color)
    .text(node => node.id);

  // TODO: Can we remove this? I don't see where it's used...
  // Reply to above TODO: It is used to display the name of the node (director / actor) on hover
  nodes.append("title").text(node => node.id);
  // Do the same for links, but display movies count
  links.append("title").text(link => link.counts);

  // --- nodes ---
  nodes.on('mouseover', selectedNode => {
    // Highlight the selected node and all of the neighboring nodes
    //
    // TODO: Only highlights direct neighbors: we should highlight
    // all of the nodes reachable from the current node.
    nodes.style('opacity', linkedNode => areNodesConnected(selectedNode, linkedNode) ? 1 : 0.1);
    text.style('opacity', linkedNode => areNodesConnected(selectedNode, linkedNode) ? 1 : 0.1);

    // Highlight all of the relevant links
    links.style('stroke', link => isLinkConnectedToNode(link, selectedNode) ? highlight_color : other_color)
      // .style('stroke-width', link => isLinkConnectedToNode(link, selectedNode) ? 4 : 1)  // Removed because it hinders with dynamic width
      // function(link) {return 4*link.counts;} -> doesn't work
      .style('opacity', link => isLinkConnectedToNode(link, selectedNode) ? 1 : 0.6);
  })
    .on('mouseout', () => {
      // Reset style for ALL nodes and ALL links
      nodes.style('opacity', 1);
      text.style('opacity', 1);
      links.style('stroke', default_color)
        // .style('stroke-width', 1) // Removed because it hinders with dynamic width
        .style('opacity', 0.6);
    });

  // --- links ---
  links.on('mouseover', selectedLink => {
    // Highlight the selected node and all of the neighboring nodes
    //
    // TODO: Only highlights direct neighbors: we should highlight
    // all of the nodes reachable from the current node.
    nodes.style('opacity', linkedNode => isLinkConnectedToNode(selectedLink, linkedNode) ? 1 : 0.1);
    text.style('opacity', linkedNode => isLinkConnectedToNode(selectedLink, linkedNode) ? 1 : 0.1);

    // Highlight all of the relevant links
    links.style('stroke', link => (link == selectedLink) ? highlight_color : other_color)
      // .style('stroke-width', link => isLinkConnectedToNode(link, selectedNode) ? 4 : 1)  // Removed because it hinders with dynamic width
      .style('opacity', link => (link == selectedLink) ? 1 : 0.6);
  })
    .on('mouseout', () => {
      // Reset style for ALL nodes and ALL links
      nodes.style('opacity', 1);
      text.style('opacity', 1);
      links.style('stroke', default_color)
        // .style('stroke-width', 1) // Removed because it hinders with dynamic width
        .style('opacity', 0.6);
    })
    .on("click", selectedLink => { open_side_window(selectedLink) });

  simulation.nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  function ticked() {
    nodes.attr("cx", d => d.x)
      .attr("cy", d => d.y);

    links.attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    text.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
  }
});

// Add zoom capabilities
//
// To disable just wheel-driven zooming (say to not interfere with native scrolling),
// you can remove the zoom behavior’s wheel event listener after
// applying the zoom behavior to the selection.
//
// Alternatively, use zoom.filter for greater control over which events can initiate zoom gestures.
//
// https://github.com/d3/d3-zoom#_zoom
const zoom_handler = d3.zoom()
  // TODO: Doesn't work on D3 v4 anymore...
  .on("zoom", zoom_actions)
// .on("wheel.zoom", null);

zoom_handler(svg);

// Zoom functions
function zoom_actions() {
  svg.select("g").attr("transform", d3.event.transform);
}

// Dragging functions
function drag_start(d) {
  if (!d3.event.active)
    simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function drag_end(d) {
  if (!d3.event.active)
    simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// function expandLink(d) {
//   d3.event.stopPropagation();
//   var i;
//   for (i = 1; i < d.counts, i++) {
//     links.append(this);
//   }
//   // need to remove this object from data
//   // d3.select(this)
//   //   .remove();
// }

// Construct side-window chart svg
const side_margin = { top: 10, right: 20, bottom: 30, left: 50 },
  side_width = width / 3 - side_margin.left - side_margin.right,
  side_height = height / 3 - side_margin.top - side_margin.bottom;

const side_chart = d3.select("div#side_chart")
  .append("svg")
  .attr("width", side_width + side_margin.left + side_margin.right)
  .attr("height", side_height + side_margin.top + side_margin.bottom)
  .append("g")
  .attr("transform", `translate(${side_margin.left},${side_margin.top})`);

const side_x = side_chart.append("g");
  // .attr("transform", `translate(0,  ${side_height + 5})`);

const side_y = side_chart.append("g")
  .attr("transform", "translate(-5, 0)");

const side_data = side_chart.append("g");

// /* Set the width of the sidebar to 250px (show it) */
// function open_side_window(data) {
//   document.getElementById("side_window").style.width = `${width / 3}px`;
//   document.getElementById("side-title").textContent = `${data.source.id} x ${data.target.id}`;

//   var data_ = data.title.map(function (title, i) {
//     return [title, new Date(data.year[i], 0, 1), data.budget[i], data.revenue[i], data.imdb_rating[i]];
//   });

//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain(d3.extent(data_, function (d) { return d[2]; }))
//     .range([0, side_width]);
//   side_x.attr("transform", "translate(0," + side_height + ")")
//     .call(d3.axisBottom(x).tickFormat(d3.format("($.2s")))
//     .selectAll("text")
//     .attr("transform", "translate(-10,0)rotate(-45)")
//     .style("text-anchor", "end");

//   // Y axis
//   var y = d3.scaleBand()
//     .domain(data_.map(function(d) { return d[0]; }))
//     .range([ 0, side_height ])
//     .padding(.1);
//   side_y.call(d3.axisLeft(y))

//   //Bars
//   side_data.selectAll("myRect")
//     .data(data_)
//     .enter()
//     .append("rect")
//     .attr("x", x(0) )
//     .attr("y", function(d) { return y(d[0]); })
//     .attr("width", function(d) { return x(d[2]); })
//     .attr("height", y.bandwidth() )
//     .attr("fill", "#69b3a2")
// }

/* Set the width of the sidebar to 250px (show it) */
function open_side_window(data) {
  document.getElementById("side_window").style.width = `${width / 3}px`;
  document.getElementById("side-title").textContent = `${data.source.id} x ${data.target.id}`;

  var data_ = data.title.map(function (title, i) {
    return [title, new Date(data.year[i], 0, 1), data.budget[i], data.revenue[i], data.imdb_rating[i]];
  });

  // Add X axis
  var x = d3.scaleBand()
    .domain(data_.map(function(d) { return d[0]; }))
    .range([0, side_width])
    .padding(.1);
  side_x.attr("transform", "translate(0," + side_height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data_, function(d) { return d[2]; })])
    .range([side_height, 0]);
  side_y.call(d3.axisLeft(y).tickFormat(d3.format("($.2s")));

  //Bars
  bars = side_data.selectAll("rect").data(data_);
  bars.exit().remove();
  bars.enter()
    .append("rect")
      .attr("fill", "#69b3a2")

  side_data.selectAll("rect").data(data_)
    .transition().duration(500)
    .attr("x", function(d) { return x(d[0]); })
    .attr("y", function(d) { return y(d[2]); })
    .attr("width", x.bandwidth())
    .attr("height",  function(d) { return side_height - y(d[2]); })
  
  var max_height = 0;
  side_x.selectAll('.tick').each(function() {
    console.log(this)
    if (this.getBBox().height > max_height) 
      max_height = this.getBBox().height;
  })
  console.log(max_height)
  d3.select("div#side_chart").select('svg')
    .attr("height", side_height + side_margin.top + side_margin.bottom + max_height)
}

// function open_side_window(data) {
//   document.getElementById("side_window").style.width = `${width / 3}px`;
//   document.getElementById("side-title").textContent = `${data.source.id} x ${data.target.id}`;

//   var data_ = data.title.map(function (title, i) {
//     return [title, new Date(data.year[i], 0, 1), data.budget[i], data.revenue[i], data.imdb_rating[i]];
//   });

//   // Add X axis
//   var x = d3.scaleTime()
//     .domain(d3.extent(data_, function (d) {
//       return d[1];
//     }))
//     .range([0, side_width]);
//   side_x.call(d3.axisBottom(x).tickFormat(x => x.getMonth()==0 ? d3.timeFormat("%Y")(x) : ""));

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain(d3.extent(data_, function (d) {
//       return d[2];
//     }))
//     .range([side_height, 0]);
//   side_y.call(d3.axisLeft(y).tickFormat(d3.format("($.2s")));

//   circles = side_data.selectAll("circle").data(data_);
//   circles.exit().remove();
//   circles.enter()
//     .append("circle")
//     .attr("r", 0);

//   labels = side_data.selectAll("text").data(data_);
//   labels.exit().remove();
//   labels.enter().append("text")

//   side_data.selectAll("text")
//     .attr('class', 'place-label')
//     .attr("x", function(d) {return x(d[1]) + 10})
//     .attr("y", function(d) {return y(d[2]) > side_height/2  ? y(d[2]) - 10 : y(d[2]) + 15 })
//     .text(function(d) {return d[0]})
//     .attr("font-size", "10px")
//     .style("text-anchor", function(d) { return x(d[1]) < side_width/2 ? "start" : "end"});

//   circles = side_data.selectAll("circle").data(data_);
//   circles.transition()
//     .duration(500)
//     .attr("cx", function (d) { return x(d[1]) })
//     .attr("cy", function (d) { return y(d[2]) })
//     .attr("r", function (d) { return d[4] });
// }

/* Set the width of the sidebar to 0 (hide it) */
function close_side_window() {
  document.getElementById("side_window").style.width = "0";
}

// Constants

// We have set a 2px border around the SVG delimit where the animation starts and ends (see constellation.css).
// 
// This is basically to be pixel-perfect with the SVG size and the website :).
const containerBorderWidth = 4;

// Set the width/height of the constellation.
const containerDimensions = d3.select("div#constellation_svg").node().getBoundingClientRect()
const width               = containerDimensions.width - containerBorderWidth;
const height              = containerDimensions.height - containerBorderWidth;

// Node colors
const director_color = '#7959ff';
const actor_color    = '#FFB326';

// Link colors
const default_color   = '#f1f1f1';
const highlight_color = '#4dfffc';
const other_color     = '#767676';   // similar to background-color

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

  // Used to display the name of the node (director / actor) on hover
  nodes.append("title").text(node => node.id);

  // Do the same for links, but display movies count
  links.append("title").text(link => link.counts);

  // --- nodes ---
  nodes.on('mouseover', selectedNode => {
    // Highlight the selected node and all of the neighboring nodes
    nodes.style('opacity', linkedNode => areNodesConnected(selectedNode, linkedNode) ? 1 : 0.1);
    text.style('opacity', linkedNode => areNodesConnected(selectedNode, linkedNode) ? 1 : 0.1);

    // Highlight all of the relevant links
    links.style('stroke', link => isLinkConnectedToNode(link, selectedNode) ? highlight_color : other_color)
      .style('opacity', link => isLinkConnectedToNode(link, selectedNode) ? 1 : 0.6);
  })
    .on('mouseout', () => {
      // Reset style for ALL nodes and ALL links
      nodes.style('opacity', 1);
      text.style('opacity', 1);
      links.style('stroke', default_color)
        .style('opacity', 0.6);
    });

  // --- links ---
  links.on('mouseover', selectedLink => {
    // Highlight the selected node and all of the neighboring nodes
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
const zoom_handler = d3.zoom()
  .on("zoom", zoom_actions)

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
const side_margin = { top: 51, right: 20, bottom: 30, left: 50 },
  side_width = width / 3 - side_margin.left - side_margin.right,
  side_height = height / 3 - side_margin.top - side_margin.bottom;

const side_chart = d3.select("div#side_chart")
  .append("svg")
  .attr("width", side_width + side_margin.left + side_margin.right)
  .attr("height", side_height + side_margin.top + side_margin.bottom)
  .append("g")
  .attr("transform", `translate(${side_margin.left},${side_margin.top})`);

const side_x = side_chart.append("g");
const side_y = side_chart.append("g")
  .attr("transform", "translate(-5, 0)");

const side_data = side_chart.append("g");

function toTitles(s){ return s.replace(/\w\S*/g, function(t) { return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(); }); }

/* Set the width of the sidebar to 250px (show it) */
function open_side_window(data) {
  document.getElementById("side_window").style.width = `${width / 3}px`;
  document.getElementById("side-title").textContent = `${toTitles(data.source.id)} x ${toTitles(data.target.id)}`;

  var data_ = data.title.map(function (title, i) {
    return [title, new Date(data.year[i], 0, 1), data.budget[i], data.revenue[i], data.imdb_rating[i]];
  });

  data_.sort(function(a, b) { return a[1] - b[1] })
  var groups = d3.map(data_, function(d) { return (d[0]) }).keys()
  var subgroups = [2, 3]

  // Add X axis
  var x = d3.scaleBand()
    .domain(groups)
    .range([0, side_width])
    .padding(.2);
  side_x.attr("transform", "translate(0," + side_height + ")")
    .call(d3.axisBottom(x).tickFormat(toTitles))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data_, function(d) { return Math.max(d[2], d[3]); })])
    .range([side_height, 0]);
  side_y.call(d3.axisLeft(y).tickFormat(d3.format("($.2s")));

   // Add Y axis
  var rating = d3.scaleLinear()
    .domain([0, 10])
    .range([side_height, 0]);

  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['lightpink','lightskyblue'])

  side_data.selectAll(".bar-group").data(data_).exit().remove();
  side_data.selectAll(".bar-group").selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .exit().remove()
  
  side_data.selectAll(".bar-group")
    .data(data_)
      .enter()
        .append("g").attr("class", "bar-group")
      .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")

  side_data.selectAll(".bar-group")
    .transition().duration(500)
      .attr("transform", function(d) { return "translate(" + x(d[0]) + ",0)"; })
      .selectAll("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) { return side_height - y(d.value); })
        .attr("fill", function(d) { return color(d.key); })
        .attr("opacity", '0.8');


  labels = side_data.selectAll("text").data(data_);
  labels.exit().remove();
  labels.enter().append("text")
      
  side_data.selectAll("text")
    .attr('class', 'place-label')
    .attr("x", function(d) {return x(d[0]) + (x.bandwidth() / 2) + 10})
    .attr("y", function(d) {return rating(d[4]) > side_height/2  ? rating(d[4]) - 10 : rating(d[4]) + 15 })
    .text(function(d) {return d[4]})
    .attr("fill", "darkgoldenrod")
    .attr("font", "bold")
    .attr("font-size", "12px")
    .style("text-anchor", function(d) { return x(d[1]) < side_width/2 ? "start" : "end"});

  circles = side_data.selectAll("circle").data(data_);
  circles.exit().remove();
  circles.enter()
    .append("circle")
    .attr("r", 0);

  circles = side_data.selectAll("circle").data(data_);
  circles.transition()
    .duration(500)
    .attr("fill", "darkgoldenrod")
    .attr("cx", function (d) { return x(d[0]) + (x.bandwidth() / 2) })
    .attr("cy", function (d) { return rating(d[4]) })
    .attr("r", 4);

    side_data.selectAll("path").data([data_], function(d) { return d[4] }).exit().remove();
  line = side_data.selectAll("path").data([data_], function(d) { return d[4] });
  line
    .enter()
    .append("path")
    .merge(line)
    .transition()
    .duration(500)
    .attr("fill", "none")
    .attr("stroke", "darkgoldenrod")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
      .x(function(d) { return x(d[0]) + (x.bandwidth() / 2) })
      .y(function(d) { return rating(d[4]) })
      )

  var max_height = 0;
  side_x.selectAll('.tick').each(function() {
    if (this.getBBox().height > max_height) 
      max_height = this.getBBox().height;
  })
  d3.select("div#side_chart").select('svg')
    .attr("height", side_height + side_margin.top + side_margin.bottom + max_height)
  
  document.getElementById("side_window").style.height = `${side_height + side_margin.top + side_margin.bottom + max_height + 40}px`;

  var legspacing = 70;
  var labels = ['budget', 'revenue']

  var legend = side_chart.selectAll(".legend")
      .data(subgroups)
      .enter()
      .append("g")

  legend.append("rect")
      .attr("fill", function(d) { return color(d); })
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", function (d, i) {
          return i * legspacing - 30;
      })
      .attr("y", -30);

  legend.append("text")
      .attr("class", "label")
      .attr("x", function (d, i) {
          return i * legspacing - 10;
      })
      .attr("y", -18)
      .attr("text-anchor", "start")
      .text(function (d, i) {
          return labels[i];
      });
}

/* Set the width of the sidebar to 0 (hide it) */
function close_side_window() {
  document.getElementById("side_window").style.width = "0";
}

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

// Text color
const text_color = '#dee7e7';

// global data structure used to retrieve node names faster.
// 
// We fill it up with the help of the fillLinkedByIndex() function.
const linkedByIndex = {};

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

// Add encompassing group (useful for the zoom)
const g = svg.append("g")
  .attr("class", "everything");

// Graph has two keys: "nodes" and "links"
d3.json("result.json", (error, graph) => {
  if (error)
    throw error;

  // We construct this list once when we receive the data from the server.
  fillLinkedByIndex(graph);

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
    .attr("stroke", "white")
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
    .text(node => toTitles(node.id));

  // Used to display the name of the node (director / actor) on hover
  nodes.append("title").text(node => toTitles(node.id));

  // Do the same for links, but display movies count
  links.append("title").text(link => link.counts.toString() + " movies");

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
      // If we are in the middle of a search, we need to let the
      // highlightSearchedNodes() take care of resetting the correct
      // properties of the nodes.
      highlightSearchedNodes(nodes, transitionTime=0);

      // Reset style for text and links after the hover is done
      text.style('opacity', 1);
      links
        .style('stroke', default_color)
        .style('opacity', 0.6);
    });

  // --- links ---
  links.on('mouseover', selectedLink => {
    // Highlight the selected node and all of the neighboring nodes
    nodes.style('opacity', linkedNode => isLinkConnectedToNode(selectedLink, linkedNode) ? 1 : 0.1);
    text.style('opacity', linkedNode => isLinkConnectedToNode(selectedLink, linkedNode) ? 1 : 0.1);

    // Highlight all of the relevant links
    links.style('stroke', link => (link == selectedLink) ? highlight_color : other_color)
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

  // When the search bar has some new text, we trigger the search
  d3.select("input#search").on("input", function() { highlightSearchedNodes(nodes) });
});

// Responsible for showing which nodes have been searched for
// 
// transitionTime is the time (in ms) the transition from a regular node to a searched node will take.
function highlightSearchedNodes(nodes, transitionTime = 500) {
  // Note: We do not rely on this.value here,
  // because we will call that function when we have no event binding to do,
  // so "this" in that case will not point to the input.
  // 
  // The tradeoff here is to explicitly search for the search input in here.
  const searchValue = d3.select("input#search").node().value.toLowerCase();

    // If we didn't enter any filter or a filter that is too short: reset all nodes borders.
  if (!searchValue || searchValue.length < 2) {
    nodes
      .attr("stroke", "white")
      .style('opacity', 1)
      .attr("stroke-width", 1);
  } else { // Otherwise, change the border of the nodes matching the filter
    const regularCircles  = nodes.filter(node => !node.id.includes(searchValue));
    const filteredCircles = nodes.filter(node => node.id.includes(searchValue));

    filteredCircles
    .attr("stroke", "red")
    .transition().duration(transitionTime)
    .style('opacity', 1)
    .attr("stroke-width", 3);

    regularCircles
    .attr("stroke", "white")
    .transition() // We want the same transition for those, no matter what transitionTime is set to
    .style('opacity', 0.5)
    .attr("stroke-width", 1);
  }
}

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

// Construct side-window chart svg
const side_margin = { top: 51, right: 20, bottom: 30, left: 50 }

side_width  = (width / 3) - side_margin.left - side_margin.right;
side_height = (height / 3) - side_margin.top - side_margin.bottom;

const side_chart = d3.select("div#side_chart")
  .append("svg")
  .attr("width", side_width + side_margin.left + side_margin.right)
  .attr("height", side_height + side_margin.top + side_margin.bottom)
  .append("g")
  .attr("transform", `translate(${side_margin.left},${side_margin.top})`);

const side_x = side_chart.append("g");
const side_y = side_chart.append("g")
  .attr("transform", "translate(-5, 0)");

// Container that will be used in the side-window
const side_data = side_chart.append("g");

// Tooltip to display statistics about columns in the animation.
var tooltip = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

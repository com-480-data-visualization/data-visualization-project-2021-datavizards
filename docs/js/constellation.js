// Constants
const width  = window.innerWidth;
const height = window.innerHeight;
const color  = d3.scaleOrdinal(d3.schemeCategory10);

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
  .force("collide", d3.forceCollide().radius(5));

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
    .attr("stroke-width", function (d) { return d.counts; }); // thickness based on number of movies done

  // The nodes we see on the graph
  const nodes = g.append("g").attr("class", "nodes").selectAll("g")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", function (d) {return 5/Math.sqrt(d.group);}) // radius based on group - director / actor
    .attr("fill", function (d) { return color(d.group); })  // colour based on group - director / actor
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
    .attr("x", 7)
    .attr("y", ".31em")
    .style("font-family", "sans-serif")
    .style("font-size", "0.5em")  // smaller font
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

    // Highlight all of the relevant links
    links.style('stroke', link => isLinkConnectedToNode(link, selectedNode) ? '#69b3b2' : '#b8b8b8')
      // .style('stroke-width', link => isLinkConnectedToNode(link, selectedNode) ? 4 : 1)  // Removed because it hinders with dynamic width
      .style('opacity', link => isLinkConnectedToNode(link, selectedNode) ? 1 : 0.6)
  })
  .on('mouseout', () => {
    // Reset style for ALL nodes and ALL links
    nodes.style('opacity', 1);
    links.style('stroke', '#999')
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

    // Highlight all of the relevant links
    links.style('stroke', link => (link == selectedLink) ? '#69b3b2' : '#b8b8b8')
      // .style('stroke-width', link => isLinkConnectedToNode(link, selectedNode) ? 4 : 1)  // Removed because it hinders with dynamic width
      .style('opacity', link => (link == selectedLink) ? 1 : 0.6)
  })
  .on('mouseout', () => {
    // Reset style for ALL nodes and ALL links
    nodes.style('opacity', 1);
    links.style('stroke', '#999')
      // .style('stroke-width', 1) // Removed because it hinders with dynamic width
      .style('opacity', 0.6);
  });

  simulation.nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  function ticked() {
    nodes.attr("cx", d => d.x )
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
  // .on("zoom", zoom_actions)
  .on("wheel.zoom", null);

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

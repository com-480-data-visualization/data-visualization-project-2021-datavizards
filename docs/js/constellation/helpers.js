// Capitalize a string.
function toTitles(s) {
  return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
}

//////////////////////////
//// Graph functions /////
//////////////////////////

// Fill the linkedByIndex data structure given a graph.
function fillLinkedByIndex(graph) {
  return graph.links.forEach(link => linkedByIndex[link.source + "," + link.target] = true);
}

// Check whether two nodes are connected with an edge.
function areNodesConnected(nodeA, nodeB) {
  return linkedByIndex[nodeA.id + "," + nodeB.id] || linkedByIndex[nodeB.id + "," + nodeA.id] || nodeA.id == nodeB.id;
}

// Check whether an edge is adjacent to a node.
function isLinkConnectedToNode(link, node) {
  return link.source === node || link.target === node
}

//////////////////////////
///// Zoom functions /////
//////////////////////////

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

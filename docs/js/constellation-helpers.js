// Capitalize a string.
function toTitles(s) {
  return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
}

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

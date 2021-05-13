var width  = window.innerWidth;
var height = window.innerHeight;
var svg = d3.select("div#constellation_svg")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-5))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(5));

// Add encompassing group for the zoom 
var g = svg.append("g")
    .attr("class", "everything");

d3.json("result.json", function (error, graph) {
    if (error)
        throw error;

    var linkedByIndex = {};
    graph.links.forEach(function (d) {
        linkedByIndex[d.source + "," + d.target] = true;
    });

    function isConnected(a, b) {
        return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id] || a.id == b.id;
    }

    var idToNode = {};
    graph.nodes.forEach(function (n) {
        idToNode[n.id] = n;
    })

    var link = g.append("g").attr("class", "links").selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

    var node = g.append("g").attr("class", "nodes").selectAll("g")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function (d) { return color(d.group); })
        .call(d3.drag()
            .on("start", drag_start)
            .on("drag", dragged)
            .on("end", drag_end));

    var text = g.append("g").attr("class", "labels").selectAll("g")
        .data(graph.nodes)
        .enter().append("g")
        .append("text")
        .attr("x", 7)
        .attr("y", ".31em")
        .style("font-family", "sans-serif")
        .style("font-size", "0.7em")
        .text(function (d) { return d.id; });

    node.append("title")
        .text(function (d) { return d.id; });

    node
        .on('mouseover', function (d) {
            // Highlight the node and its neighbors
            node
                .style('opacity', function (n_d) {
                    return isConnected(d, n_d) ? 1 : 0.1; 
                })
            // Highlight the connections
            link
                .style('stroke', function (link_d) {
                    return link_d.source === idToNode[d.id] || link_d.target === idToNode[d.id] ? '#69b3b2' : '#b8b8b8'; 
                })
                .style('stroke-width', function (link_d) { 
                    return link_d.source === idToNode[d.id] || link_d.target === idToNode[d.id] ? 4 : 1; 
                })
                .style('opacity', function (link_d) { 
                    return link_d.source === idToNode[d.id] || link_d.target === idToNode[d.id] ? 1 : 0.6; 
                })
        })
        .on('mouseout', function (d) {
            node.style('opacity', 1)
            link
                .style('stroke', 'black')
                .style('stroke-width', 1)
                .style('opacity', 0.6)
        });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });

        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        text
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
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
var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions)
    .on("wheel.zoom", null);

zoom_handler(svg);

// Zoom functions 
function zoom_actions() {
    svg.select("g").attr("transform", d3.event.transform)
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

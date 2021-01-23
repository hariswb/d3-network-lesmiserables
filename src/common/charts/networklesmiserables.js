import * as d3 from "d3";
import { lesmischars, lesmisgraph, metrics_range } from "../data";
console.log(lesmischars)
const drag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

const nodeColor = (val, category, metric_highest) => {
  const colorScheme = {
    community: getColor(val, "interpolateTurbo"),
    degree_centrality: getColor(val, "interpolatePlasma"),
    eigenvector_centrality: getColor(val, "interpolateViridis"),
    betweenness_centrality: getColor(val, "interpolateCool"),
    closeness_centrality: getColor(val, "interpolateCividis"),
  };
  function getColor(val, scheme) {
    return d3.scaleSequential(d3[scheme])(val / metric_highest);
  }
  return colorScheme[category];
};

const NetworkLesmiserables = function (id) {
  const margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = 600 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  let FOCUS = 11;
  let METRIC = "degree_centrality";

  const svg = d3
    .select("#".concat(id))
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Background
  const layerBg = svg.append("g");
  layerBg
    .append("rect")
    .attr("fill", "white")
    .attr("opacity", 1)
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", height)
    .attr("width", width);

  // Network Chart

  const links = lesmisgraph.edges.map((d) =>
    Object.create({ source: d[0], target: d[1], value: 1 })
  );
  const nodes = lesmischars.map((d) => Object.create(d));

  const simulation = d3
    .forceSimulation(nodes)
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("charge", d3.forceManyBody().strength(-100))
    .force(
      "link",
      d3.forceLink(links).id((d) => d.character)
    )
    .force("radial", d3.forceRadial(width / 2))
    .force("collition", d3.forceCollide(1));

  const layerLinks = svg.append("g");
  const layerNodes = svg.append("g");

  const node = layerNodes
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("class", "circle")
    .attr("stroke", (d) => (d.index == FOCUS ? "#111111" : "white"))
    .attr("stroke-width", (d) => (d.index == FOCUS ? 4 : 1.5))
    .attr("r", (d) => (d.index == FOCUS ? 15 : 10))
    .attr("fill", (d) =>
      nodeColor(d[METRIC], METRIC, metrics_range[METRIC].highest)
    )
    .call(drag(simulation))
    .on("click", function (d, i) {
      FOCUS = i.index;
      d3.select(this).text((d) => {
        d3.select(".character-name").html(d.character);
        d3.select(".character-description").html(d.info == " "?"Sorry, no info about this character":d.info);
      });
      node
        .attr("stroke", (d) => (FOCUS == d.index ? "#111111" : "white"))
        .attr("stroke-width", (d) => (d.index == FOCUS ? 4 : 1.5))
        .attr("r", (d) => (d.index == FOCUS ? 15 : 10));
    });


  const link = layerLinks
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke", "grey")
    .attr("opacity", 0.5)
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  // Character Focus
  d3.select(".character-name").text(lesmischars[11].character);
  d3.select(".character-description").text(lesmischars[11].info);

  // Legend Gradient Bar

  const layerLegend = svg.append("g");

  layerLegend.call(legendGradient, METRIC, metrics_range);

  function legendGradient(selection, METRIC, metrics_range) {
    const hi = metrics_range[METRIC].highest;
    const x = d3
      .scaleLinear()
      .domain([0, hi])
      .range([0, width / 4]);
    const dataLegend = d3.range(100).map((t) => (t / 100) * hi);
    if (METRIC !== "community") {
      const xAxis = selection
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${20},${20})`)
        .call(d3.axisBottom(x).tickValues([0, hi / 2, hi]));

      selection
        .append("g")
        .attr("class", "legend")
        .selectAll("rect")
        .data(dataLegend)
        .join("rect")
        .attr("transform", `translate(${20},${10})`)
        .attr("width", 2)
        .attr("height", 10)
        .attr("x", function (d) {
          return x(d);
        })
        .attr("fill", function (d) {
          return nodeColor(d, METRIC, metrics_range[METRIC].highest);
        });
    }
  }
  // Metric Selection

  d3.select("#metric-select").on("change", metricSelect);
  function metricSelect() {
    METRIC = this.value;
    d3.select("#metric-description").html(lesmisgraph.description[METRIC]);
    d3.selectAll(".circle").attr("fill", function (d) {
      return nodeColor(d[METRIC], METRIC, metrics_range[METRIC].highest);
    });
    d3.selectAll(".legend").remove();
    layerLegend.call(legendGradient, METRIC, metrics_range);
  }
  d3.select("#metric-description").html(lesmisgraph.description[METRIC]);

  // Start Simulation
  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });
};
export default NetworkLesmiserables;

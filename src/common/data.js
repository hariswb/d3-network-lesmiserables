import * as d3 from "d3";
import lesmisgraph from "../data/lesmisgraph.json"
import lesmischarsStr from "../data/lesmischars.json"

// console.log(lesmisgraph)
// console.log(JSON.parse(lesmischars))
const lesmischars = JSON.parse(lesmischarsStr)

const metrics_name = ["degree_centrality","betweenness_centrality","closeness_centrality","eigenvector_centrality","community"]

const metrics_range = {}

metrics_name.forEach(function(name){
    metrics_range[name] = {
        highest: d3.max(lesmischars.map(c=>c[name])),
        lowest:d3.min(lesmischars.map(c=>c[name]))
    }
})
export { lesmisgraph, lesmischars,metrics_range};

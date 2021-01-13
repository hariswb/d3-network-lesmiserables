import * as d3 from "d3";
import { fieldDetails, grpVals } from "../data";

const SquarePie = function () {
  var USER_SEX = "2",
    USER_RACESIMP = "1",
    USER_AGEGRP = "2";

  function getValKey() {
    return "grp" + USER_SEX + USER_RACESIMP + USER_AGEGRP;
  }
  var VAL_KEY = getValKey();

  const margin = { top: 0, right: 0, bottom: 0, left: 6 },
    width = 134 - margin.left - margin.right,
    height = 134 - margin.top - margin.bottom;
  
  const format = d3.format(",d")

  const delay_per_unit = 30,
    bg_color = "#e0e0e0";

  const valfields = d3.keys(fieldDetails);

  // Total Count

  d3.select("#totalcnt #n").text(format(grpVals[VAL_KEY]["total"]))
  

  // Get Cells For Chart
  const cells = [];
  d3.select("#grid")
    .text()
    .split("\n")
    .forEach(function (line, i) {
      let re = /\w+/g,
        m;
      while ((m = re.exec(line)))
        cells.push({
          name: m[0],
          selected: 1,
          x: m.index / 3,
          y: i,
        });
    });
  
  // Create Square Pie Chart
  valfields.forEach(function (v, i) {
    const grid_width =
        d3.max(cells, function (d) {
          return d.x;
        }) + 1,
      grid_height =
        d3.max(cells, function (d) {
          return d.y;
        }) + 1,
      cell_size = width / grid_width,
      holder_width = width + margin.left + margin.right;

    const div = d3
      .select("#charts")
      .append("div")
      .attr("id", "holder" + v)
      .attr("class", "chartholder")
      .style("width", holder_width + "px");

    div.append("h3").html(fieldDetails[v].desc);

    const svg = div
      .append("svg")
      .attr("class", "squarepie")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const cell = svg
      .append("g")
      .attr("id", "vf" + v)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
      .selectAll(".cell")
      .data(cells)
      .enter()
      .append("g")
      .attr("class", "cell")
      .attr("transform", function (d) {
        return (
          "translate(" +
          (d.x - grid_width / 2) * cell_size +
          "," +
          (d.y - grid_height / 2) * cell_size +
          ")"
        );
      });

    cell
      .append("rect")
      .attr("x", -cell_size / 2)
      .attr("y", -cell_size / 2)
      .attr("width", cell_size - 0.5)
      .attr("height", cell_size - 0.5)
      .style("fill", function (d, i) {
        if (i < 100 - grpVals[VAL_KEY][v]) {
          return bg_color;
        } else {
          return fieldDetails[v].color;
        }
      });
  });
  // Create Buttons interactive
  d3.selectAll("#sex .button").on("click", function () {
    USER_SEX = d3.select(this).attr("data-val");
    d3.select("#sex .current").classed("current", false);
    d3.select(this).classed("current", true);
    update();
  });

  d3.selectAll("#racesimp .button").on("click", function() {
    USER_RACESIMP = d3.select(this).attr("data-val");
      d3.select("#racesimp .current").classed("current", false);
      d3.select(this).classed("current", true);
      update();
  });
  d3.selectAll("#agegrp .button").on("click", function() {
    USER_AGEGRP = d3.select(this).attr("data-val");
      d3.select("#agegrp .current").classed("current", false);
      d3.select(this).classed("current", true);
      update();
  });

  function update() {
    const prev_val_key = VAL_KEY;
    VAL_KEY = getValKey();

    // Update Total Count

    d3.select("#totalcnt #n").transition()
      .duration(200)
      .tween("text",function(t){
        let that = d3.select(this)
        let just_number = that.text().replace(/,/g,"")
        let new_val = grpVals[VAL_KEY]["total"];
        var i = d3.interpolateNumber(just_number, new_val)
        console.log(just_number)
        
        return function(t){return that.text(format(i(t)))}
      })

    valfields.forEach(function (v, k) {
      let start_i = 100 - grpVals[prev_val_key][v];
      let end_i = 100 - grpVals[VAL_KEY][v];
      d3.select("#vf" + v)
        .selectAll(".cell rect")
        .transition()
        .duration(10)
        .delay(function (d, i) {
          if (start_i < end_i) {
            let curr_delay = (i - start_i) * delay_per_unit;
                        curr_delay = Math.max(curr_delay, 0);
            return curr_delay;
          } else if (start_i > end_i) {
            let curr_delay = (start_i - i) * delay_per_unit;
            curr_delay = Math.max(curr_delay, 0);
            return curr_delay;
          } else {
            return 0;
          }
        })
        .style("fill", function(d,i) {
          if (i < (100-grpVals[VAL_KEY][v])) {
              return bg_color;
          } else {
              return fieldDetails[v].color;
          }
      });
    });
  }
  console.log(USER_SEX)

};

export default SquarePie;

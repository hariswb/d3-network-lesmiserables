import * as d3 from "d3";
import data from "../data/group_demog_2016_v3.tsv"

const grpVals = {};

data.forEach(function(o) {
    grpVals["grp" + o.sex + o.racesimp + o.agegrp] = o;
});

function type(d) {
  d3.keys(d).map(function (key) {
    d[key] = +d[key];
  });
  return d;
}

const fieldDetails = {
  married: { desc: "Married", color: "#5B7BE9" },
  children: { desc: "Own children in Household", color: "#E0D22E" },
  healthcare: { desc: "Has Healthcare Coverage", color: "#2CCEF6" },
  college: { desc: "Bachelor's Degree or More", color: "#FB7F23" },
  employed: { desc: "Employed", color: "#D63CA3" },
  selfemp: { desc: "Self-employed", color: "#c38014" },
  publictrans: { desc: " Primarily Pub. Trans. to Work", color: "#E24062" },
  income_moremed: { desc: "Personal Income Above Nat. Med.", color: "#5BB923" },
  inpoverty: { desc: "Below Poverty Line", color: "#555" },
  isveteran: { desc: "Veteran", color: "#B190D0" },
  bornoutus: { desc: "Born Outside US", color: "#bcc832" },
  diffmovecog: { desc: "Cog. or Phys. Difficulty", color: "#ee7b9c" },
  diffhearvis: { desc: "Hearing or Vis. Difficulty", color: "#f299b3" },
  widowed: { desc: "Widowed", color: "#01d99f" },
};

export { fieldDetails, grpVals };

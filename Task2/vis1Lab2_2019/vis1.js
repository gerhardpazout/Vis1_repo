var xAxisSP, yAxisSP, xAxisLabelSP, yAxisLabelSP;

// TODO: parse dimensions (i.e., attributes) from input file*
var dimensions = ["dimension 1", "dimension 2", "dimension 3", "dimension 4", "dimension 5", "dimension 6"];
//*HINT: the first dimension is often a label; you can simply remove the first dimension with
// dimensions.splice(0, 1);

// the visual channels we can use for the scatterplot
var channels = ["scatterX", "scatterY", "color", "size"];

// size of the plots
var margin, widthPC, widthSP, height;
// svg containers
var svgPC, svgSP;

function init() {
    // define size of plots
    margin = {top: 20, right: 20, bottom: 20, left: 50},
        widthPC = 960,
        widthSP = 600,
        height = 500;

    // parallel coordinates SVG container
    svgPC = d3.select("#pc").append("svg")
        .attr("width", widthPC)
        .attr("height", height)
        .append("g");

    // scatterplot SVG container and axes
    svgSP = d3.select("#sp").append("svg")
        .attr("width", widthPC)
        .attr("height", height)
        .append("g");


    // read and parse input file
    var fileInput = document.getElementById("upload"),
        readFile = function () {

            // clear existing visualizations
            clear();

            var reader = new FileReader();
            reader.onloadend = function () {
                console.log("data loaded: ");
                console.log(reader.result);

                console.log();

                var data = d3.csvParse(reader.result);
                console.log(data);
                initVis(data);
            };
            reader.readAsBinaryString(fileInput.files[0]);
        };
    fileInput.addEventListener('change', readFile);

    console.log(fileInput);
}

function initVis(_data) {

    console.log();

    dimensions = _data.columns;
    dimensionsWithoutFirst = [...dimensions]; //create copy for safe array manipulation
    //remove first attribute since its not used in charts and also would result in empty chart if it was used
    dimensionsWithoutFirst  = d3.keys(_data[0]).filter(function(attribute, idx) { return idx != 0 })

    // x scaling for parallel coordinates
    var xPC = d3.scalePoint()
        .domain(dimensionsWithoutFirst)
        .range([margin.left, widthPC - margin.left - margin.right]);

    // y scalings
    var y = d3.scaleLinear()
        .range([height - margin.bottom - margin.top, margin.top]);

    // used another var y2 instead for testing purposes,
    // generateYAxes(_data) will eventually be used for var y, and var y will be used in code
    var yPC = {}
    for (i in dimensions) {
        var attribute = dimensions[i]
        yPC[attribute] = d3.scaleLinear()
            .domain( d3.extent(_data, function(d) { return +d[attribute]; }) )
            .range([height - margin.bottom - margin.top, margin.top])
    }

    // parallel coordinates axes container
    var gPC = svgPC.selectAll(".dimension")
        .data(dimensionsWithoutFirst)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) {
            return "translate(" + xPC(d) + ")";
        });

    // parallel coordinates axes
    gPC.append("g")
        .attr("class", "axis")
        .each(function (attribute, idx) {
            d3.select(this).call(d3.axisLeft(yPC[attribute])); // not working withd y2[attribute] because y2 is a array not an object
        })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", margin.top / 2)
        .text(function (attribute) {
            return attribute;
        });

    // *HINT: to make a call for each bound data item, use .each!
    // example: http://bl.ocks.org/milroc/4254604

    // draw lines into PC graph

    // function to get coordinates for each path
    // for each row (= 'db entry'): return x and y coordinates of the line that needs to be drawn.
    function drawPathsInPC(d) {
        return d3.line()(dimensionsWithoutFirst.map(function(p) { return [xPC(p), yPC[p](d[p])]; }));
    }

    //applying the function
    svgPC
        .selectAll(".path")
        .data(_data)
        .enter().append("path")
        .attr("d",  drawPathsInPC)
        .attr("class", "path"); //add class


    // SCATTER PLOT

    // x scalings for scatter plot
    // TODO: set x domain for each dimension
    var xSP = d3.scaleLinear()
        .range([margin.left, widthSP - margin.left - margin.right]);

    // scatterplot axes
    yAxisSP = svgSP.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + ")")
        .call(d3.axisLeft(y));

    yAxisLabelSP = yAxisSP.append("text")
        .style("text-anchor", "middle")
        .attr("y", margin.top / 2)
        .text("x");

    xAxisSP = svgSP.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + (height - margin.bottom - margin.top) + ")")
        .call(d3.axisBottom(xSP));

    xAxisLabelSP = xAxisSP.append("text")
        .style("text-anchor", "middle")
        .attr("x", widthSP - margin.right)
        .text("y");

    // init menu for the four visual channels
    channels.forEach(function (c) {
        initMenu(c, dimensions);
    });

    // refresh all four select menus
    channels.forEach(function (c) {
        refreshMenu(c);
    });

    renderSP();
}

// clear visualizations before loading a new file
function clear() {
    svgPC.selectAll("*").remove();
    svgSP.selectAll("*").remove();
}


// render scatterplot
function renderSP() {

    // TODO: get domain names from menu and label x- and y-axis

    // TODO: re-render axes

    // TODO: render dots
}

// init scatterplot select menu
function initMenu(id, entries) {
    $("select#" + id).empty();

    entries.forEach(function (d) {
        $("select#" + id).append("<option>" + d + "</option>");
    });

    $("#" + id).selectmenu({
        select: function () {
            renderSP();
        }
    });
}

// refresh menu after reloading data
function refreshMenu(id) {
    $("#" + id).selectmenu("refresh");
}

// read current scatterplot parameters
function readMenu(id) {
    return $("#" + id).val();
}
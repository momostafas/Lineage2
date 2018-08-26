// dimensions
//var width = document.getElementsByClassName("sentiment-append")[0].clientWidth;
var width = 1000;
console.log('width'+width);

var height = 1000;

console.log('height'+height);

var margin = {
    top: 50,
    bottom: 50,
    left: 1,
    right: 50,
};
// rest of vars
var w = 960,
    h = 800,
    maxNodeSize = 50,
    x_browser = 20,
    y_browser = 25
var div = d3.select("#tooltipholder").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
// create an svg to draw in
var svg = d3.select(".sentiment-append")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append('g')
    .attr('transform', 'translate(' + margin.top + ',' + margin.left + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;
var simulation = d3.forceSimulation()
    // pull nodes together based on the links between them
    .force("link", d3.forceLink().id(function (d) {
        return d.id;
    })
    .strength(0.02))
    // push nodes apart to space them out
    .force("charge", d3.forceManyBody().strength(-30))
    .force("x", (d) => {
        return Number(d.x)
    })
    .force("y", (d) => {
        return Number(d.y)
    })
    // add some collision detection so they don't overlap
    .force("collide", d3.forceCollide().radius(100))
    // and draw them around the centre of the space
    .force("center", d3.forceCenter(width / 2, height / 2));

    // set the nodes
    document.graph_data = graph
    var nodes = graph.nodes;
    // links between nodes
    var links = graph.links;
    renderInfo(document.graph_data.nodes[0])
    // add the curved links to our graphic
    var link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("stroke", function (d) {
            console.log("the path", d.color)
            if (d.color) return d.color
            //return "#ddd";
        });

    // add the nodes to the graphic
    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
    var defs = svg.append("svg:defs")

    var new_images = defs.selectAll(".pattern")
        .data(nodes)
        .enter().append("pattern")
        .attr("id", function (d) { return d.id; })
        .attr("viewBox","0 0 120 120")
        .attr("height", 1)
        .attr("width", 1)
        .attr("class", "pattern")
        .append("image")
        .attr("xlink:href", function (d) { return d.img; })
        .attr("width", 120)
        .attr("height", 120)
        .attr("preserveAspectRatio","none")
        // .attr("x", function (d) { return -20; })
        // .attr("y", function (d) { return -20; })
        .on("mouseover", mouseOver(.1))
        .on("mouseout", mouseOut)
    // a circle to represent the node
    var circles = node.append("circle")
        .attr("class", "node")
        .attr("r", function (d) {
            return 15 + Math.round(Math.random()*10)
        })
        .attr("fill", function (d) {
            console.log("the fille", "url(" + d.id + ")")
            return "url(#" + d.id + ")";
        })
        .attr("stroke", (d) => {
            return d.color
        })
        .on("mouseover", mouseOver(.1))
        .on("mouseout", mouseOut);
    /*
// Append images
var images = node.append("svg:image")
    .attr("xlink:href", function (d) { return d.img; })
    .attr("x", function (d) { return -25; })
    .attr("y", function (d) { return -25; })
    .attr("height", 0)
    .attr("width", 0)
    .attr("class", "node")
    .on("mouseover", mouseOver(.1))
    .on("mouseout", mouseOut);
*/
    // make the image grow a little on mouse over and add the text details on click
    var setEvents = circles
        // Append hero text
        .on('click', function (d) {
            d3.select("h1").html(d.party);
            d3.select("h2").html(d.name);
            d3.select("h3").html("Take me to " + "<a href='" + d.name + "' >" + d.party + " web page ⇢" + "</a>");
           // nodeActiveTwo(d)
        })

        .on('mouseenter', function () {
            // select element in current context
            d3.select(this)
                .transition()
                .attr("x", function (d) { return -60; })
                .attr("y", function (d) { return -60; })
                .attr("height", 100)
                .attr("width", 100)
        })
        // set back
        .on('mouseleave', function () {
            d3.select(this)
                .transition()
                .attr("x", function (d) { return -25; })
                .attr("y", function (d) { return -25; })
                .attr("height", 50)
                .attr("width", 50);
        });
    // hover text for the node
    node.append("title")
        .text(function (d) {
            return d.name;
        });

    // add a label to each node
    node.append("text")
        .attr("dx", -30)
        .attr("dy", "2.6em")
        .text(function (d) {
            return d.name;
        })
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .style("fill", function (d) {
            if (d.color == "lightgreen") return "green"
            return d.color;
        });
        console.log("nodes length",nodes.length)
    // add the nodes to the simulation and
    // tell it what to do on each tick
    console.log("posionoing all")
    
    simulation
        .nodes(nodes)
        .on("tick", ticked)

    // add the links to the simulation
    simulation
        .force("link")
        .links(links)
    // on each tick, update node and link positions
    function ticked() {
        link.attr("d", positionLink);
        node.attr("transform", positionNode);
    }

    // links are drawn as curved paths between nodes
    function positionLink(d) {
        var offset = 30;

        var midpoint_x = (d.source.x + d.target.x) / 2;
        var midpoint_y = (d.source.y + d.target.y) / 2;

        var dx = (d.target.x - d.source.x);
        var dy = (d.target.y - d.source.y);

        var normalise = Math.sqrt((dx * dx) + (dy * dy));

        var offSetX = midpoint_x + offset * (dy / normalise);
        var offSetY = midpoint_y - offset * (dx / normalise);
        if (typeof offSetX !== "number") {
            console.log("the mid points", midpoint_x, "the offset", offset, "the dy", dy, "the normalize", normalise)

        }
        //console.log("the last 2",d.target.x,d.target.y,typeof d.target.x)
        //console.log("the returning nan is","d.source.x",d.source.x,"d.source.y ",d.source.y,"offSetX",offSetX,"offSetY",offSetY,"d.target.x",d.target.x,"d.target.y",d.target.y)
        return "M" + Number(d.source.x) + "," + Number(d.source.y) +
            "S" + Number(offSetX) + "," + Number(offSetY) +
            " " + Number(d.target.x) + "," + Number(d.target.y);
    }

    // move the node based on forces calculations
    function positionNode(d) {
        console.log("positioning node",d)
        // keep the node within the boundaries of the svg
        if (d.x < 0) {
            d.x = 0
        };
        if (d.y < 0) {
            d.y = 0
        };
        if (d.x > width) {
            d.x = width
        };
        if (d.y > height) {
            d.y = height
        };
        return "translate(" + d.x + "," + d.y + ")";
    }

    // build a dictionary of nodes that are linked
    var linkedByIndex = {};
    links.forEach(function (d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    // check the dictionary to see if nodes are linked
    function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

    // fade nodes on hover
    function mouseOver(opacity) {
        return function (d) {
            // check all other nodes to see if they're connected
            // to this one. if so, keep the opacity at 1, otherwise
            // fade
            //nodeActiveTwo(d)
            renderInfo(d)
            node.style("stroke-opacity", function (o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity = 0;
                return thisOpacity;
            });
            node.style("fill-opacity", function (o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity = 0;
                return thisOpacity;
            })
            // also style link accordingly
            link.style("stroke-opacity", function (o) {
                return o.source === d || o.target === d ? 1 : opacity = 0;
            })
            circles.style("opacity", function (o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity = 0;
                return thisOpacity;
            })
    
        };
    }

    function mouseOut() {
        node.style("stroke-opacity", 1);
        node.style("fill-opacity", 1);
        link.style("stroke-opacity", 1);
        circles.style("opacity", 1);
        // images.style("opacity", 1);
        // new_images.style("opacity", 1);
        link.style("stroke", function (d) {
            console.log("the path color", d.color)
            return d.color
        });
    }
function tick() {


    path.attr("d", function (d) {

        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        //         console.log("the returning nan is","d.source.x",d.source.x,"d.source.y ",d.source.y,"offSetX",offSetX,"offSetY",offSetY,"d.target.x",d.target.x,"d.target.y",d.target.y,"dr",dr)
        return Number("M" + d.source.x + ","
            + d.source.y
            + "A" + dr + ","
            + dr + " 0 0,1 "
            + d.target.x + ","
            + d.target.y);

    })

    node.attr("transform", nodeTransform);
}
var sigInst, canvas, $GP
//Load data 
var config = {}
function GetQueryStringParams(sParam, defaultVal) {
    var sPageURL = "" + window.location;//.search.substring(1);//This might be causing error in Safari?
    if (sPageURL.indexOf("?") == -1) return defaultVal;
    sPageURL = sPageURL.substr(sPageURL.indexOf("?") + 1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    return defaultVal;
}


    config = data;
    console.log("the config", data)
    if (config.type != "network") {
        //bad config
        alert("Invalid configuration settings.")
        // return;
    }
    console.log("initing GUI")
    //As soon as page is ready (and data ready) set up it
    $(document).ready(setupGUI(config));


// FUNCTION DECLARATIONS

Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function initSigma(config) {
    //setImagesRenderer()
    console.log("the render has been made")
    var data = config.data

    var drawProps, graphProps, mouseProps;
    if (config.sigma && config.sigma.drawingProperties)
        drawProps = config.sigma.drawingProperties;
    else
        drawProps = {
            defaultLabelColor: "#000",
            defaultLabelSize: 14,
            defaultLabelBGColor: "#ddd",
            defaultHoverLabelBGColor: "#002147",
            defaultLabelHoverColor: "#fff",
            labelThreshold: 10,
            defaultEdgeType: "curve",
            hoverFontStyle: "bold",
            fontStyle: "bold",
            activeFontStyle: "bold"
        };

    if (config.sigma && config.sigma.graphProperties)
        graphProps = config.sigma.graphProperties;
    else
        graphProps = {
            minNodeSize: 1,
            maxNodeSize: 7,
            minEdgeSize: 0.2,
            maxEdgeSize: 0.5
        };

    if (config.sigma && config.sigma.mouseProperties)
        mouseProps = config.sigma.mouseProperties;
    else
        mouseProps = {
            minRatio: 0.75, // How far can we zoom out?
            maxRatio: 20, // How far can we zoom in?
        };

    if (document.querySelector('.siema')) {
        const mySiema = new Siema();

        document.querySelector('.prev').addEventListener('click', () => mySiema.prev());
        document.querySelector('.next').addEventListener('click', () => mySiema.next());
    }
    /*
var a = sigma.init(document.getElementById("sigma-canvas")).drawingProperties(drawProps).graphProperties(graphProps).mouseProperties(mouseProps);
CustomShapes.init(a);
sigInst = a;
a.active = !1;
a.neighbors = {};
a.detail = !1;
a.refresh()


dataReady = function() {//This is called as soon as data is loaded
  a.clusters = {};
  var image__url="https://scontent-cai1-1.xx.fbcdn.net/v/t1.0-9/29101004_367741943721874_1445045474770812928_n.jpg?oh=e87e460f66b54d334bc536666398c008&oe=5B2F9895"
  a.iterNodes(
      function (b) { //This is where we populate the array used for the group select box
          b.image={
              url:"https://scontent-cai1-1.xx.fbcdn.net/v/t1.0-9/29101004_367741943721874_1445045474770812928_n.jpg?oh=e87e460f66b54d334bc536666398c008&oe=5B2F9895"
          }
          // note: index may not be consistent for all nodes. Should calculate each time. 
           // alert(JSON.stringify(b.attr.attributes[5].val));
          // alert(b.x);
          a.clusters[b.color] || (a.clusters[b.color] = []);
          a.clusters[b.color].push(b.id);//SAH: push id not label
      }
	
  );
	
  a.bind("upnodes", function (a) {
      nodeActive(a.content[0])
  });

  a.draw();
  configSigmaElements(config);
}
 
  a.parseJson(data,dataReady);
gexf = sigmaInst = null;
  */
}


function setupGUI(config) {
    // Initialise main interface elements
    var logo = ""; // Logo elements
    if (config.logo.file) {

        logo = "<img src=\"" + config.logo.file + "\"";
        if (config.logo.text) logo += " alt=\"" + config.logo.text + "\"";
        if (config.logo.height) logo += " heigth=\"" + config.logo.height + "\"";
        if (config.logo.width) logo += " width=\"" + config.logo.width + "\"";
        logo += ">";
    } else if (config.logo.text) {
        logo = "<h1>" + config.logo.text + "</h1>";
    }
    if (config.logo.link) logo = "<a href=\"" + config.logo.link + "\">" + logo + "</a>";
    $("#maintitle").html(logo);

    // #title
    $("#title").html("<h2>" + config.text.title + "</h2>");

    // #titletext
    $("#titletext").html(config.text.intro);

    // More information
    if (config.text.more) {
        $("#information").html(config.text.more);
    } else {
        //hide more information link
        $("#moreinformation").hide();
    }

    // Legend

    // Node
    if (config.legend.nodeLabel) {
        $(".node").next().html(config.legend.nodeLabel);
    } else {
        //hide more information link
        $(".node").hide();
    }
    // Edge
    if (config.legend.edgeLabel) {
        $(".edge").next().html(config.legend.edgeLabel);
    } else {
        //hide more information link
        $(".edge").hide();
    }
    // Colours
    if (config.legend.nodeLabel) {
        $(".colours").next().html(config.legend.colorLabel);
    } else {
        //hide more information link
        $(".colours").hide();
    }

    $GP = {
        calculating: !1,
        showgroup: !1
    };
    $GP.intro = $("#intro");
    $GP.minifier = $GP.intro.find("#minifier");
    $GP.mini = $("#minify");
    $GP.info = $("#attributepane");
    $GP.info_donnees = $GP.info.find(".nodeattributes");
    $GP.info_name = $GP.info.find(".name");
    $GP.info_link = $GP.info.find(".link");
    $GP.info_data = $GP.info.find(".data");
    $GP.info_close = $GP.info.find(".returntext");
    $GP.info_close2 = $GP.info.find(".close");
    $GP.info_p = $GP.info.find(".p");
    $GP.info_close.click(nodeNormal);
    $GP.info_close2.click(nodeNormal);
    $GP.form = $("#mainpanel").find("form");
    $GP.search = new Search($GP.form.find("#search"));
    if (!config.features.search) {
        $("#search").hide();
    }
    if (!config.features.groupSelectorAttribute) {
        $("#attributeselect").hide();
    }
    $GP.cluster = new Cluster($GP.form.find("#attributeselect"));
    config.GP = $GP;
    initSigma(config);
}

function configSigmaElements(config) {
    $GP = config.GP;

    // Node hover behaviour
    if (config.features.hoverBehavior == "dim") {

        var greyColor = '#ccc';
        sigInst.bind('overnodes', function (event) {
            var nodes = event.content;
            var neighbors = {};
            sigInst.iterEdges(function (e) {
                if (nodes.indexOf(e.source) < 0 && nodes.indexOf(e.target) < 0) {
                    if (!e.attr['grey']) {
                        e.attr['true_color'] = e.color;
                        e.color = greyColor;
                        e.attr['grey'] = 1;
                    }
                } else {
                    e.color = e.attr['grey'] ? e.attr['true_color'] : e.color;
                    e.attr['grey'] = 0;

                    neighbors[e.source] = 1;
                    neighbors[e.target] = 1;
                }
            }).iterNodes(function (n) {
                if (!neighbors[n.id]) {
                    if (!n.attr['grey']) {
                        n.attr['true_color'] = n.color;
                        n.color = greyColor;
                        n.attr['grey'] = 1;
                    }
                } else {
                    n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
                    n.attr['grey'] = 0;
                }
            }).draw(2, 2, 2);
        }).bind('outnodes', function () {
            sigInst.iterEdges(function (e) {
                e.color = e.attr['grey'] ? e.attr['true_color'] : e.color;
                e.attr['grey'] = 0;
            }).iterNodes(function (n) {
                n.color = n.attr['grey'] ? n.attr['true_color'] : n.color;
                n.attr['grey'] = 0;
            }).draw(2, 2, 2);
        });

    } else if (config.features.hoverBehavior == "hide") {

        sigInst.bind('overnodes', function (event) {
            var nodes = event.content;
            var neighbors = {};
            sigInst.iterEdges(function (e) {
                if (nodes.indexOf(e.source) >= 0 || nodes.indexOf(e.target) >= 0) {
                    neighbors[e.source] = 1;
                    neighbors[e.target] = 1;
                }
            }).iterNodes(function (n) {
                if (!neighbors[n.id]) {
                    n.hidden = 1;
                } else {
                    n.hidden = 0;
                }
            }).draw(2, 2, 2);
        }).bind('outnodes', function () {
            sigInst.iterEdges(function (e) {
                e.hidden = 0;
            }).iterNodes(function (n) {
                n.hidden = 0;
            }).draw(2, 2, 2);
        });

    }
    $GP.bg = $(sigInst._core.domElements.bg);
    $GP.bg2 = $(sigInst._core.domElements.bg2);
    var a = [],
        b, x = 1;
    for (b in sigInst.clusters) a.push('<div style="line-height:12px"><a href="#' + b + '"><div style="width:40px;height:12px;border:1px solid #fff;background:' + b + ';display:inline-block"></div> Group ' + (x++) + ' (' + sigInst.clusters[b].length + ' members)</a></div>');
    //a.sort();
    $GP.cluster.content(a.join(""));
    b = {
        minWidth: 400,
        maxWidth: 800,
        maxHeight: 600
    };//        minHeight: 300,
    $("a.fb").fancybox(b);
    $("#zoom").find("div.z").each(function () {
        var a = $(this),
            b = a.attr("rel");
        a.click(function () {
            if (b == "center") {
                sigInst.position(0, 0, 1).draw();
            } else {
                var a = sigInst._core;
                sigInst.zoomTo(a.domElements.nodes.width / 2, a.domElements.nodes.height / 2, a.mousecaptor.ratio * ("in" == b ? 1.5 : 0.5));
            }

        })
    });
    $GP.mini.click(function () {
        $GP.mini.hide();
        $GP.intro.show();
        $GP.minifier.show()
    });
    $GP.minifier.click(function () {
        $GP.intro.hide();
        $GP.minifier.hide();
        $GP.mini.show()
    });
    $GP.intro.find("#showGroups").click(function () {
        !0 == $GP.showgroup ? showGroups(!1) : showGroups(!0)
    });
    a = window.location.hash.substr(1);
    if (0 < a.length) switch (a) {
        case "Groups":
            showGroups(!0);
            break;
        case "information":
            $.fancybox.open($("#information"), b);
            break;
        default:
            $GP.search.exactMatch = !0, $GP.search.search(a)
            $GP.search.clean();
    }

}

function Search(a) {
    this.input = a.find("input[name=search]");
    this.state = a.find(".state");
    this.results = a.find(".results");
    this.exactMatch = !1;
    this.lastSearch = "";
    this.searching = !1;
    var b = this;
    this.input.focus(function () {
        var a = $(this);
        a.data("focus") || (a.data("focus", !0), a.removeClass("empty"));
        b.clean()
    });
    this.input.keydown(function (a) {
        if (13 == a.which) return b.state.addClass("searching"), b.search(b.input.val()), !1
    });
    this.state.click(function () {
        var a = b.input.val();
        b.searching && a == b.lastSearch ? b.close() : (b.state.addClass("searching"), b.search(a))
    });
    this.dom = a;
    this.close = function () {
        this.state.removeClass("searching");
        this.results.hide();
        this.searching = !1;
        this.input.val("");//SAH -- let's erase string when we close
        nodeNormal()
    };
    this.clean = function () {
        this.results.empty().hide();
        this.state.removeClass("searching");
        this.input.val("");
    };
    this.search = function (a) {
        var b = !1,
            c = [],
            b = this.exactMatch ? ("^" + a + "$").toLowerCase() : a.toLowerCase(),
            g = RegExp(b);
        this.exactMatch = !1;
        this.searching = !0;
        this.lastSearch = a;
        this.results.empty();
        if (2 >= a.length) this.results.html("<i>You must search for a name with a minimum of 3 letters.</i>");
        else {
            sigInst.iterNodes(function (a) {
                g.test(a.label.toLowerCase()) && c.push({
                    id: a.id,
                    name: a.label
                })
            });
            c.length ? (b = !0, nodeActive(c[0].id)) : b = showCluster(a);
            a = ["<b>Search Results: </b>"];
            if (1 < c.length) for (var d = 0, h = c.length; d < h; d++) a.push('<a href="#' + c[d].name + '" onclick="nodeActive(\'' + c[d].id + "')\">" + c[d].name + "</a>");
            0 == c.length && !b && a.push("<i>No results found.</i>");
            1 < a.length && this.results.html(a.join(""));
        }
        if (c.length != 1) this.results.show();
        if (c.length == 1) this.results.hide();
    }
}

function Cluster(a) {
    this.cluster = a;
    this.display = !1;
    this.list = this.cluster.find(".list");
    this.list.empty();
    this.select = this.cluster.find(".select");
    this.select.click(function () {
        $GP.cluster.toggle()
    });
    this.toggle = function () {
        this.display ? this.hide() : this.show()
    };
    this.content = function (a) {
        this.list.html(a);
        this.list.find("a").click(function () {
            var a = $(this).attr("href").substr(1);
            showCluster(a)
        })
    };
    this.hide = function () {
        this.display = !1;
        this.list.hide();
        this.select.removeClass("close")
    };
    this.show = function () {
        this.display = !0;
        this.list.show();
        this.select.addClass("close")
    }
}
function showGroups(a) {
    a ? ($GP.intro.find("#showGroups").text("Hide groups"), $GP.bg.show(), $GP.bg2.hide(), $GP.showgroup = !0) : ($GP.intro.find("#showGroups").text("View Groups"), $GP.bg.hide(), $GP.bg2.show(), $GP.showgroup = !1)
}

function nodeNormal() {
    !0 != $GP.calculating && !1 != sigInst.detail && (showGroups(!1), $GP.calculating = !0, sigInst.detail = !0, $GP.info.delay(400).animate({ width: 'hide' }, 350), $GP.cluster.hide(), sigInst.iterEdges(function (a) {
        a.attr.color = !1;
        a.hidden = !1
    }), sigInst.iterNodes(function (a) {
        a.hidden = !1;
        a.attr.color = !1;
        a.attr.lineWidth = !1;
        a.attr.size = !1
    }), sigInst.draw(2, 2, 2, 2), sigInst.neighbors = {}, sigInst.active = !1, $GP.calculating = !1, window.location.hash = "")
}

function nodeActive(a) {
    //alert("node was clicked")
    var groupByDirection = false;
    if (config.informationPanel.groupByEdgeDirection && config.informationPanel.groupByEdgeDirection == true) groupByDirection = true;
	/*
    sigInst.neighbors = {};
    sigInst.detail = !0;
    var b = sigInst._core.graph.nodesIndex[a];
    showGroups(!1);
	var outgoing={},incoming={},mutual={};//SAH
    sigInst.iterEdges(function (b) {
        b.attr.lineWidth = !1;
        b.hidden = !0;
        
        n={
            name: b.label,
            colour: b.color
        };
        
   	   if (a==b.source) outgoing[b.target]=n;		//SAH
	   else if (a==b.target) incoming[b.source]=n;		//SAH
       if (a == b.source || a == b.target) sigInst.neighbors[a == b.target ? b.source : b.target] = n;
       b.hidden = !1, b.attr.color = "rgba(0, 0, 0, 1)";
    });
    var f = [];
    sigInst.iterNodes(function (a) {
        a.hidden = !0;
        a.attr.lineWidth = !1;
        a.attr.color = a.color
    });
    if (groupByDirection) {
		//SAH - Compute intersection for mutual and remove these from incoming/outgoing
		for (e in outgoing) {
			//name=outgoing[e];
			if (e in incoming) {
				mutual[e]=outgoing[e];
				delete incoming[e];
				delete outgoing[e];
			}
		}
    }
     */
    var createList = function (c) {
        var f = [];
        var e = [],
            //c = sigInst.neighbors,
            g;
        for (g in c) {
            var d = sigInst._core.graph.nodesIndex[g];
            d.hidden = !1;
            d.attr.lineWidth = !1;
            d.attr.color = c[g].colour;
            a != g && e.push({
                id: g,
                name: d.label,
                group: (c[g].name) ? c[g].name : "",
                colour: c[g].colour
            })
        }
        e.sort(function (a, b) {
            var c = a.group.toLowerCase(),
                d = b.group.toLowerCase(),
                e = a.name.toLowerCase(),
                f = b.name.toLowerCase();
            return c != d ? c < d ? -1 : c > d ? 1 : 0 : e < f ? -1 : e > f ? 1 : 0
        });
        d = "";
        for (g in e) {
            c = e[g];
			/*if (c.group != d) {
				d = c.group;
				f.push('<li class="cf" rel="' + c.color + '"><div class=""></div><div class="">' + d + "</div></li>");
			}*/
            f.push('<li class="membership"><a href="#' + c.name + '" onmouseover="sigInst._core.plotter.drawHoverNode(sigInst._core.graph.nodesIndex[\'' + c.id + '\'])\" onclick=\"nodeActive(\'' + c.id + '\')" onmouseout="sigInst.refresh()">' + c.name + "</a></li>");
        }
        return f;
    }

	/*console.log("mutual:");
	console.log(mutual);
	console.log("incoming:");
	console.log(incoming);
	console.log("outgoing:");
	console.log(outgoing);*/


    var f = [];

    //console.log("neighbors:");
    //console.log(sigInst.neighbors);

    if (groupByDirection) {
        size = Object.size(mutual);
        f.push("<h2>Mututal (" + size + ")</h2>");
        (size > 0) ? f = f.concat(createList(mutual)) : f.push("No mutual links<br>");
        size = Object.size(incoming);
        f.push("<h2>Incoming (" + size + ")</h2>");
        (size > 0) ? f = f.concat(createList(incoming)) : f.push("No incoming links<br>");
        size = Object.size(outgoing);
        f.push("<h2>Outgoing (" + size + ")</h2>");
        (size > 0) ? f = f.concat(createList(outgoing)) : f.push("No outgoing links<br>");
    } else {
        f = f.concat(createList(sigInst.neighbors));
    }
    //b is object of active node -- SAH
    b.hidden = !1;
    b.attr.color = b.color;
    b.attr.lineWidth = 6;
    //b.attr.strokeStyle = "#000000";
    console.log("chaning stroke style")
    var image_url = "https://scontent-cai1-1.xx.fbcdn.net/v/t1.0-9/29101004_367741943721874_1445045474770812928_n.jpg?oh=e87e460f66b54d334bc536666398c008&oe=5B2F9895"
    b.attr.strokeStyle = "url('https://scontent-cai1-1.xx.fbcdn.net/v/t1.0-9/29101004_367741943721874_1445045474770812928_n.jpg?oh=e87e460f66b54d334bc536666398c008&oe=5B2F9895')";
    sigInst.draw(2, 2, 2, 2);

    $GP.info_link.find("ul").html(f.join(""));
    $GP.info_link.find("li").each(function () {
        var a = $(this),
            b = a.attr("rel");
    });
    f = b.attr;
    if (f.attributes) {
        var image_attribute = false;
        if (config.informationPanel.imageAttribute) {
            image_attribute = config.informationPanel.imageAttribute;
        }
        e = [];
        temp_array = [];
        g = 0;
        var attributes = ["Negative", "Positive"]
        for (var attr in attributes) {
            var d = attributes[attr],
                h = "";
            if (attr != image_attribute) {
                h = '<span><strong>' + attr + ':</strong> ' + d + '</span><br/>'
            }
            //temp_array.push(f.attributes[g].attr);
            e.push(h)
        }

        if (!image_attribute) {
            console.log("there's image attraibute")
            //image_index = jQuery.inArray(image_attribute, temp_array);
            //$GP.info_name.html("<div><img src=" + f.attributes[image_attribute] + " style=\"vertical-align:middle\" /> <span onmouseover=\"sigInst._core.plotter.drawHoverNode(sigInst._core.graph.nodesIndex['" + b.id + '\'])" onmouseout="sigInst.refresh()">' + b.label + "</span></div>");
            $GP.info_name.html("<div><img src=" + image_url + " style=\"vertical-align:left;\" width=\"200\" height=\"200\" /> <span onmouseover=\"sigInst._core.plotter.drawHoverNode(sigInst._core.graph.nodesIndex['" + b.id + '\'])" onmouseout="sigInst.refresh()">' + b.label + "</span></div>");
        } else {
            console.log("no image attribute")
            $GP.info_name.html("<div><span onmouseover=\"sigInst._core.plotter.drawHoverNode(sigInst._core.graph.nodesIndex['" + b.id + '\'])" onmouseout="sigInst.refresh()">' + b.label + "</span></div>");
        }
        // Image field for attribute pane
        $GP.info_data.html(e.join("<br/>"))
    }
    $GP.info_data.show();
    //$GP.info_p.html("Connections:");
    $GP.info.animate({ width: 'show' }, 350);
    $GP.info_donnees.hide();
    $GP.info_donnees.show();
    sigInst.active = a;
    window.location.hash = b.label;
}

function showCluster(a) {
    var b = sigInst.clusters[a];
    if (b && 0 < b.length) {
        showGroups(!1);
        sigInst.detail = !0;
        b.sort();
        sigInst.iterEdges(function (a) {
            a.hidden = !1;
            a.attr.lineWidth = !1;
            a.attr.color = !1
        });
        sigInst.iterNodes(function (a) {
            a.hidden = !0
        });
        for (var f = [], e = [], c = 0, g = b.length; c < g; c++) {
            var d = sigInst._core.graph.nodesIndex[b[c]];
            !0 == d.hidden && (e.push(b[c]), d.hidden = !1, d.attr.lineWidth = !1, d.attr.color = d.color, f.push('<li class="membership"><a href="#' + d.label + '" onmouseover="sigInst._core.plotter.drawHoverNode(sigInst._core.graph.nodesIndex[\'' + d.id + "'])\" onclick=\"nodeActive('" + d.id + '\')" onmouseout="sigInst.refresh()">' + d.label + "</a></li>"))
        }
        sigInst.clusters[a] = e;
        sigInst.draw(2, 2, 2, 2);
        $GP.info_name.html("<b>" + a + "</b>");
        $GP.info_data.hide();
        $GP.info_p.html("Group Members:");
        $GP.info_link.find("ul").html(f.join(""));
        $GP.info.animate({ width: 'show' }, 350);
        $GP.search.clean();
        $GP.cluster.hide();
        return !0
    }
    return !1
}


function nodeActiveTwo(a) {

    //alert("showing info")
    // if (config.informationPanel.groupByEdgeDirection && config.informationPanel.groupByEdgeDirection == true) groupByDirection = true;
    var f = [];
    var b
    //console.log("neighbors:");
    //console.log(sigInst.neighbors);
    var image_url = "https://scontent-cai1-1.xx.fbcdn.net/v/t1.0-9/29101004_367741943721874_1445045474770812928_n.jpg?oh=e87e460f66b54d334bc536666398c008&oe=5B2F9895"
    // b.attr.strokeStyle = "url('https://scontent-cai1-1.xx.fbcdn.net/v/t1.0-9/29101004_367741943721874_1445045474770812928_n.jpg?oh=e87e460f66b54d334bc536666398c008&oe=5B2F9895')";
    // sigInst.draw(2, 2, 2, 2);

    $GP.info_link.find("ul").html(f.join(""));
    $GP.info_link.find("li").each(function () {
        var a = $(this),
            b = a.attr("rel");
    });
    var e = []
    if (a.attributes) {
        for (var attr in a.attributes) {
            var d = a.attributes[attr],
                h = "";
            h = '<span><strong>' + attr + ':</strong> ' + d + '</span><br/>'
            //temp_array.push(f.attributes[g].attr);
            e.push(h)
        }
    }
    console.log("there's image attraibute")
    //image_index = jQuery.inArray(image_attribute, temp_array);
    $GP.info_name.html("<h4>" + a.name + "</h4><div><img src=" + a.img + " style=\"vertical-align:middle\" /> <span></span></div>");
    // $GP.info_name.html("<div><img src=" + image_url + " style=\"vertical-align:left;\" width=\"200\" height=\"200\" /> <span onmouseover=\"sigInst._core.plotter.drawHoverNode(sigInst._core.graph.nodesIndex['" + b.id + '\'])" onmouseout="sigInst.refresh()">' + b.label + "</span></div>");
    // Image field for attribute pane
    $GP.info_data.html(e.join("<br/>"))
    $GP.info_data.show();
   //$GP.info_p.html("Connections:");
    $GP.info.animate({ width: 'show' }, 350);
    $GP.info_donnees.hide();
    $GP.info_donnees.show();
}

function renderInfo(node) { 
    console.log("rending image" + JSON.stringify(node))
    let name = node.name || node.username
    $(".profile-panel__user-data__img").attr("src",node.img)
    $(".profile-panel__user-data__data__name").text(name)
    $(".profile-panel__list").empty()
    Object.keys(node.count).forEach(key=>{
      let selector = ".profile-panel__user-data__numbers__value."
      $(selector+key).text(node.count[key])
    })
    let influencers = document.graph_data.links.filter((o)=>{return o.target.id==node.id})
    console.log("influencers",influencers)
    influencers.forEach(link=>{
        let percentage = parseInt(link.percentage) || 5
        console.log("percentage",percentage)
        let typeOfMost = "NEUTRAL"
        switch(link.color) {
            case "#4678c9":
            typeOfMost = "NEUTRAL"
            break;
            case "lightgreen":
            typeOfMost = "POSITIVE"
            break;
            case "#FF0000":
            typeOfMost = "NEGATIVE"
            break;
        }
        console.log("link",link)
        let bars = getProgressBars(link.count)
        let panel_user = `<div class="profile-panel__list-user">
    <div class="row">
        <div class="col-2">
            <img class="profile-panel__list-user__img" src="${link.source.img}" alt="">
        </div>
        <div class="col-10">
            <span class="profile-panel__list-user__name">${link.source.name}</span>
            ${bars}
          </div>
        </div>
    </div>
</div>
<hr>`
        console.log(panel_user)
        $(".profile-panel__list").append(panel_user)
        
    })
    console.log("influencers",influencers)
    //$(".profile-panel__list")
}
function getProgressBars(count) { 
    let bars=``
    let allCount = 0
    Object.keys(count).forEach(key=>{return allCount+=parseInt(count[key])})
    Object.keys(count).forEach(sentiment=>{
        let percentage = (parseInt(count[sentiment])/allCount)*100
        console.log("pre",percentage,"all",allCount,"counttt",count)
        bars +=`
        <div class="">                          
            <div class="progress" style="height: 2px;">
                  <div class="progress-bar progress-bar-${sentiment}" role="progressbar" style="width: ${percentage}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>`
    })
    return bars
}
// function showMsg() {
//     console.log("hellloo");
// }

// var len = jsonLength();
// console.log("len " + len);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var url = "/static/data_refresh.json" + "?" + (new Date()).getTime();
    $(document).ready(function () {

        /////////////////////////////////////////////////////////////////
        // loading icon //

        var preview = document.createElement("div");
            var loading_gif = new Image();
            loading_gif.src = "/static/ajax-loader.gif";

            $("#preview").empty();
            $("#preview").append(loading_gif);

            $(document).ready(function () {
                $(document).ajaxStart(function () {
                    $("#preview").show();
                }).ajaxStop(function () {
                    $("#preview").hide();
                });
            });

        /////////////////////////////////////////////////////////////////


  //       $.ajax({
  //   url: "lines.txt",
  //   dataType: 'json',
  //   success: function(data) {
  //     $("#sentences").html(data);
  //   },
  //   error: function() {
  //     alert("error");
  //   }
  // });

        $.getJSON(url,
        function (json) {
            var submitter = json[0].submitter;
            var top_question = json[0].question;
            var reddit_link = json[0].redditLink;
            // console.log(submitter);
            // console.log(top_question);
            // console.log(json[0].redditLink);

            /////////////////////////////////////////////////////////////////
            // adaugare titlu postare + redirectionare catre topic

            var title = document.createElement("a");
            title.href = reddit_link;
            title.target = "_blank";
            title.innerHTML = "<h4>"+top_question+"</h4>";
            $("#topic_title").empty();
            $("#topic_title").append(title);
            // document.getElementById("post_title").innerHTML = top_question;
            // document.getElementById("link").innerHTML = json[1].reddit-link;

            /////////////////////////////////////////////////////////////////

            var author = [];
            var comment = [];
            for (var i = 1; i < json.length; i++) {
                author[i] = json[i].author;
                comment[i] = json[i].comment;
                // console.log(author[i]);
                // console.log(comment[i]);
            }

            // var links = [
            //     {
            //         source: function () {
            //             for (var k = 1; k < json.length; k++) {
            //                 return submitter;
            //             }
            //         },
            //         target: function () {
            //             for (var j = 1; j < json.length; j++) {
            //                 return author[j];
            //             }
            //         }
            //     }
            // ];
                // {source: "Microsoft", target: "HTC", type: "licensing"},
                // {source: "Samsung", target: "Apple", type: "suit"},
                // {source: "Motorola", target: "Apple", type: "suit"},
                // {source: "Nokia", target: "Apple", type: "resolved"},
                // {source: "HTC", target: "Apple", type: "suit"},
                // {source: "Kodak", target: "Apple", type: "suit"},
                // {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
                // {source: "Microsoft", target: "Foxconn", type: "suit"},
                // {source: "Oracle", target: "Google", type: "suit"},
                // {source: "Apple", target: "HTC", type: "suit"},
                // {source: "Microsoft", target: "Inventec", type: "suit"},
                // {source: "Samsung", target: "Kodak", type: "resolved"},
                // {source: "LG", target: "Kodak", type: "resolved"},
                // {source: "RIM", target: "Kodak", type: "suit"},
                // {source: "Sony", target: "LG", type: "suit"},
                // {source: "Kodak", target: "LG", type: "resolved"},
                // {source: "Apple", target: "Nokia", type: "resolved"},
                // {source: "Qualcomm", target: "Nokia", type: "resolved"},
                // {source: "Apple", target: "Motorola", type: "suit"},
                // {source: "Microsoft", target: "Motorola", type: "suit"},
                // {source: "Motorola", target: "Microsoft", type: "suit"},
                // {source: "Huawei", target: "ZTE", type: "suit"},
                // {source: "Ericsson", target: "ZTE", type: "suit"},
                // {source: "Kodak", target: "Samsung", type: "resolved"},
                // {source: "Apple", target: "Samsung", type: "suit"},
                // {source: "Kodak", target: "RIM", type: "suit"},
                // {source: "Nokia", target: "Qualcomm", type: "suit"}

            var links = [];
            // author.forEach(function(users) {
            //     links.push({
            //         source: submitter,
            //         target: users
            //     });
            // });

            // var comm = [];
            var reply = [];

            // for (var j = 1; j < json.length; j++) {
            //     comm[j] = comment[j];
            // }

            for (var j = 1; j < json.length; j++) {
                reply[j] = author[j] + " : " + comment[j];
                // console.log(reply);
            }

            reply.forEach(function (userReply) {
                var sourceNode = submitter + " : " + top_question;
                links.push({
                    source: sourceNode,
                    target: userReply
                });
            });

            var nodes = {};

            links.forEach(function (link) {
                link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
                link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
            });

            var width = 500;
            var height = 500;
            // var nodecolor = {};

            // var svg1 = d3.select("body").append("svg1")
            // .attr("width", width + margin.right + margin.left)
            // .attr("height", height + margin.top + margin.bottom)
            // .attr("class", "graph-svg-component");

            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 1e-6);

            var svg = d3.select("#chart").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "graph-svg-component");

            var force = d3.layout.force()
                .nodes(d3.values(nodes))
                .links(links)
                .size([width, height])
                .linkDistance(60)
                .on("tick", tick)
                .start();

            // -------------------------------------------------- //
            var link = svg.selectAll("line.link")
                .data(force.links());
            var linkEnter = link
                .enter().insert("svg:line", "circle.node")
                .attr("class", "link")
                .style("stroke-width", function () {
                    return 2;
                })
                .style("stroke", "gray")
                .style("opacity", 0.8);

            // -------------------------------------------------- //

            var node = svg.selectAll("circle.node")
                .data(force.nodes());
            var nodeEnter = node
                .enter()
                .append("svg:circle")
                .attr("class", node)
                .attr("class", "node")
                // .attr("r", function (d) {
                //       links.forEach(function (link) {
                //           if (d === link.source) {
                //               return 15;
                //           } else return 6;
                //       })
                // })
                .style("opacity", 0.8)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout)
                .call(force.drag);

            setDiameter();
            colorNodes();

            function tick() {
                link.attr("x1", function (d) {return d.source.x;})
                    .attr("y1", function (d) {return d.source.y;})
                    .attr("x2", function (d) {return d.target.x;})
                    .attr("y2", function (d) {return d.target.y;});

                node.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";});
            }

            function mouseover() {
                div.transition()
                    .duration(150)
                    .style("opacity", 0.85);
            }

            function mousemove(d) {
                div.text(d.name)
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY + 15) + "px");
            }

            function mouseout() {
                div.transition()
                    .duration(150)
                    .style("opacity", 1e-6);
            }

            function colorNodes() {
                links.forEach(function (link) {
                    svg.selectAll("circle")
                        .style("fill", function(d) {
                            if (d === link.source) {
                                return "orange";
                            }
                            else return "black";
                                // return d3.rgb(255 * Math.random(), 255 * Math.random(), 255 * Math.random());
                        });
                });
            }

            function setDiameter() {
                links.forEach(function (link) {
                    svg.selectAll("circle")
                        .attr("r", function (d) {
                          if (d === link.source) {
                              return 40;
                          } else return Math.floor(Math.random() * 15) + 6;
                    })
                });
            }

            // json = {};
        });
    });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// -------------------------------------------------- //

// force.start();

